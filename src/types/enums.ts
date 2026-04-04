// ─── Payment ──────────────────────────────────────────────────────────────────

/** Maps to PaymentStatus.java */
export enum PaymentStatus {
  INITIATED  = 'INITIATED',
  PENDING    = 'PENDING',
  COMPLETED  = 'COMPLETED',
  FAILED     = 'FAILED',
  EXPIRED    = 'EXPIRED',
  CANCELLED  = 'CANCELLED',
}

/** Maps to OperationType.java */
export enum OperationType {
  PAYIN  = 'PAYIN',
  PAYOUT = 'PAYOUT',
}

/** Maps to FeeType.java */
export enum FeeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED      = 'FIXED',
  MIXED      = 'MIXED',
}

/** Maps to PayoutStatus.java */
export enum PayoutStatus {
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED    = 'FAILED',
}

// ─── Merchant ─────────────────────────────────────────────────────────────────

/** Maps to MerchantStatus.java */
export enum MerchantStatus {
  PENDING   = 'PENDING',
  ACTIVE    = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED   = 'BLOCKED',
}

/** Maps to CompensationAccountType.java */
export enum CompensationAccountType {
  BANK     = 'BANK',
  OPERATOR = 'OPERATOR',
}

// ─── User ─────────────────────────────────────────────────────────────────────

/** Maps to UserStatus.java */
export enum UserStatus {
  PENDING   = 'PENDING',
  ACTIVE    = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED    = 'LOCKED',
  BLOCKED   = 'BLOCKED',
}

// ─── Notification ─────────────────────────────────────────────────────────────

/** Maps to NotificationStatus.java */
export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT    = 'SENT',
  FAILED  = 'FAILED',
}

/** Maps to NotificationEventType.java */
export enum NotificationEventType {
  PAYMENT_COMPLETED  = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED     = 'PAYMENT_FAILED',
  CARD_REDEEMED      = 'CARD_REDEEMED',
  CASHIN_COMPLETED   = 'CASHIN_COMPLETED',
  CARD_EXPIRED       = 'CARD_EXPIRED',
}
