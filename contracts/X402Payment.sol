// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title X402Payment
 * @dev 简单的 x402 支付合约 - The Synthesis Hackathon 2026
 * @author 宝哥 (Sebo) - @sebo_luo
 */
contract X402Payment {
    
    struct Payment {
        address payer;
        address recipient;
        uint256 amount;
        string serviceType;
        uint256 createdAt;
        bool completed;
    }
    
    // 事件
    event PaymentCreated(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        string serviceType
    );
    
    event PaymentCompleted(
        bytes32 indexed paymentId,
        address indexed payer,
        uint256 timestamp
    );
    
    // 存储
    mapping(bytes32 => Payment) public payments;
    mapping(address => uint256) public creatorEarnings;
    address public owner;
    address public feeRecipient;
    uint256 public platformFeePercent = 2; // 2% 平台费
    
    // 定价 (单位：wei，实际使用 USDC)
    mapping(string => uint256) public pricing;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier validPayment(bytes32 paymentId) {
        require(payments[paymentId].payer != address(0), "Payment not found");
        require(!payments[paymentId].completed, "Payment already completed");
        _;
    }
    
    constructor(address _feeRecipient) {
        owner = msg.sender;
        feeRecipient = _feeRecipient;
        
        // 初始化定价 (USDC 6 decimals)
        pricing["singleConsultation"] = 500000; // 0.5 USDC
        pricing["dayPass"] = 5000000; // 5 USDC
        pricing["monthlySubscription"] = 50000000; // 50 USDC
        pricing["apiAccess"] = 100000000; // 100 USDC
    }
    
    /**
     * @dev 创建支付
     */
    function createPayment(
        string calldata serviceType,
        address recipient
    ) external payable returns (bytes32) {
        require(pricing[serviceType] > 0, "Invalid service type");
        require(msg.value >= pricing[serviceType], "Insufficient payment");
        
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                msg.value,
                serviceType,
                block.timestamp
            )
        );
        
        payments[paymentId] = Payment({
            payer: msg.sender,
            recipient: recipient,
            amount: msg.value,
            serviceType: serviceType,
            createdAt: block.timestamp,
            completed: false
        });
        
        emit PaymentCreated(paymentId, msg.sender, recipient, msg.value, serviceType);
        
        return paymentId;
    }
    
    /**
     * @dev 完成支付（服务商确认）
     */
    function completePayment(bytes32 paymentId) external validPayment(paymentId) {
        Payment storage payment = payments[paymentId];
        require(msg.sender == payment.recipient, "Only recipient can complete");
        
        payment.completed = true;
        
        // 分配资金
        uint256 platformFee = (payment.amount * platformFeePercent) / 100;
        uint256 recipientAmount = payment.amount - platformFee;
        
        // 转账给服务商
        (bool success1, ) = payment.recipient.call{value: recipientAmount}("");
        require(success1, "Transfer to recipient failed");
        
        // 转账平台费
        (bool success2, ) = feeRecipient.call{value: platformFee}("");
        require(success2, "Transfer fee failed");
        
        creatorEarnings[payment.recipient] += recipientAmount;
        
        emit PaymentCompleted(paymentId, payment.payer, block.timestamp);
    }
    
    /**
     * @dev 退款（超时未服务）
     */
    function refund(bytes32 paymentId) external validPayment(paymentId) {
        Payment storage payment = payments[paymentId];
        require(msg.sender == payment.payer, "Only payer can refund");
        require(block.timestamp > payment.createdAt + 1 hours, "Too early");
        
        payment.completed = true;
        
        (bool success, ) = payment.payer.call{value: payment.amount}("");
        require(success, "Refund failed");
        
        emit PaymentCompleted(paymentId, payment.payer, block.timestamp);
    }
    
    /**
     * @dev 获取支付详情
     */
    function getPayment(bytes32 paymentId) external view returns (
        address payer,
        address recipient,
        uint256 amount,
        string memory serviceType,
        uint256 createdAt,
        bool completed
    ) {
        Payment storage payment = payments[paymentId];
        return (
            payment.payer,
            payment.recipient,
            payment.amount,
            payment.serviceType,
            payment.createdAt,
            payment.completed
        );
    }
    
    /**
     * @dev 更新定价（仅 owner）
     */
    function updatePricing(string calldata serviceType, uint256 newPrice) external onlyOwner {
        pricing[serviceType] = newPrice;
    }
    
    /**
     * @dev 提取收益
     */
    function withdrawEarnings() external {
        uint256 amount = creatorEarnings[msg.sender];
        require(amount > 0, "No earnings");
        
        creatorEarnings[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }
    
    /**
     * @dev 提取合约余额（仅 owner，紧急情况）
     */
    function withdrawContractBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdraw failed");
    }
    
    /**
     * @dev 接收 ETH
     */
    receive() external payable {}
}
