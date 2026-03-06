#!/usr/bin/env node

/**
 * SQLite 数据库模块
 * 持久化存储支付记录、用户访问权限等
 */

import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../data/defi-advisor.db');

// 确保数据目录存在
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// 初始化数据库
const db = new Database(DB_PATH);

// 启用 WAL 模式（更好的并发性能）
db.pragma('journal_mode = WAL');

/**
 * 初始化数据库表
 */
export function initDatabase() {
  // 支付记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      tx_hash TEXT,
      network TEXT DEFAULT 'base-mainnet',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      completed_at INTEGER,
      valid_until INTEGER,
      request_count INTEGER DEFAULT 0,
      request_limit INTEGER,
      metadata TEXT
    )
  `);
  
  // 用户访问记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_access (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      payment_id TEXT NOT NULL,
      activated_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      request_count INTEGER DEFAULT 0,
      request_limit INTEGER,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
    )
  `);
  
  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_user_access_user ON user_access(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_access_active ON user_access(is_active, expires_at);
  `);
  
  console.log('✅ 数据库初始化完成');
}

/**
 * 保存支付记录
 */
export function savePayment(payment) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO payments 
    (payment_id, user_id, service_type, amount, currency, status, tx_hash, network, 
     created_at, expires_at, completed_at, valid_until, request_count, request_limit, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    payment.paymentId,
    payment.userId,
    payment.serviceType,
    payment.amount,
    payment.currency,
    payment.status,
    payment.txHash || null,
    payment.network || 'base-mainnet',
    payment.timestamp || Date.now(),
    payment.expiresAt,
    payment.completedAt || null,
    payment.validUntil || null,
    payment.usedCount || 0,
    payment.requestLimit || null,
    JSON.stringify(payment.metadata || {})
  );
  
  return result.changes > 0;
}

/**
 * 获取支付记录
 */
export function getPayment(paymentId) {
  const stmt = db.prepare('SELECT * FROM payments WHERE payment_id = ?');
  const row = stmt.get(paymentId);
  
  if (!row) {
    return null;
  }
  
  return {
    paymentId: row.payment_id,
    userId: row.user_id,
    serviceType: row.service_type,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    txHash: row.tx_hash,
    network: row.network,
    timestamp: row.created_at,
    expiresAt: row.expires_at,
    completedAt: row.completed_at,
    validUntil: row.valid_until,
    usedCount: row.request_count,
    requestLimit: row.request_limit,
    metadata: JSON.parse(row.metadata || '{}')
  };
}

/**
 * 更新支付状态
 */
export function updatePaymentStatus(paymentId, status, additionalFields = {}) {
  const fields = ['status = ?'];
  const values = [status];
  
  if (additionalFields.txHash) {
    fields.push('tx_hash = ?');
    values.push(additionalFields.txHash);
  }
  
  if (additionalFields.completedAt) {
    fields.push('completed_at = ?');
    values.push(additionalFields.completedAt);
  }
  
  if (additionalFields.validUntil) {
    fields.push('valid_until = ?');
    values.push(additionalFields.validUntil);
  }
  
  if (additionalFields.usedCount !== undefined) {
    fields.push('request_count = ?');
    values.push(additionalFields.usedCount);
  }
  
  values.push(paymentId);
  
  const stmt = db.prepare(`
    UPDATE payments SET ${fields.join(', ')} WHERE payment_id = ?
  `);
  
  const result = stmt.run(...values);
  return result.changes > 0;
}

/**
 * 检查用户访问权限
 */
export function checkUserAccess(userId, serviceType) {
  const stmt = db.prepare(`
    SELECT * FROM user_access 
    WHERE user_id = ? AND service_type = ? AND is_active = 1 AND expires_at > ?
    ORDER BY expires_at DESC
    LIMIT 1
  `);
  
  const row = stmt.get(userId, serviceType, Date.now());
  
  if (!row) {
    return { hasAccess: false };
  }
  
  // 检查使用限制
  if (row.request_limit && row.request_count >= row.request_limit) {
    return { 
      hasAccess: false, 
      reason: 'limit_exceeded',
      used: row.request_count,
      limit: row.request_limit
    };
  }
  
  return {
    hasAccess: true,
    paymentId: row.payment_id,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    usedCount: row.request_count,
    limit: row.request_limit
  };
}

/**
 * 激活用户访问权限
 */
export function activateUserAccess(payment) {
  // 先停用旧的访问记录
  const deactivateStmt = db.prepare(`
    UPDATE user_access SET is_active = 0 WHERE user_id = ? AND service_type = ?
  `);
  deactivateStmt.run(payment.userId, payment.serviceType);
  
  // 创建新的访问记录
  const insertStmt = db.prepare(`
    INSERT INTO user_access 
    (user_id, service_type, payment_id, activated_at, expires_at, request_count, request_limit, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  
  const result = insertStmt.run(
    payment.userId,
    payment.serviceType,
    payment.paymentId,
    Date.now(),
    payment.validUntil || payment.expiresAt,
    0,
    payment.requestLimit || null
  );
  
  return result.lastInsertRowid;
}

/**
 * 增加使用次数
 */
export function incrementUsage(userId, serviceType) {
  const stmt = db.prepare(`
    UPDATE user_access 
    SET request_count = request_count + 1 
    WHERE user_id = ? AND service_type = ? AND is_active = 1
  `);
  
  const result = stmt.run(userId, serviceType);
  return result.changes > 0;
}

/**
 * 获取用户使用统计
 */
export function getUserStats(userId) {
  const stmt = db.prepare(`
    SELECT 
      service_type,
      COUNT(*) as total_payments,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
      SUM(amount) as total_spent,
      MAX(expires_at) as latest_expiry
    FROM payments
    WHERE user_id = ?
    GROUP BY service_type
  `);
  
  return stmt.all(userId);
}

/**
 * 清理过期记录
 */
export function cleanupExpiredRecords() {
  const now = Date.now();
  
  // 清理过期的用户访问
  const accessStmt = db.prepare(`
    UPDATE user_access SET is_active = 0 WHERE expires_at < ? AND is_active = 1
  `);
  const accessResult = accessStmt.run(now);
  
  // 清理 30 天前的支付记录（归档）
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const paymentStmt = db.prepare(`
    DELETE FROM payments WHERE created_at < ? AND status = 'expired'
  `);
  const paymentResult = paymentStmt.run(thirtyDaysAgo);
  
  return {
    deactivatedAccess: accessResult.changes,
    deletedPayments: paymentResult.changes
  };
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  db.close();
}

// 初始化
initDatabase();

// 导出 db 实例
export { db };

export default {
  db,
  initDatabase,
  savePayment,
  getPayment,
  updatePaymentStatus,
  checkUserAccess,
  activateUserAccess,
  incrementUsage,
  getUserStats,
  cleanupExpiredRecords,
  closeDatabase
};
