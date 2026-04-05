import type {
  CompensationAccountType,
  FeeType,
  LedgerDirection,
  LedgerEntryType,
  MerchantStatus,
  NotificationEventType,
  NotificationStatus,
  OperationType,
  PaymentStatus,
  PayoutStatus,
  SystemEntryType,
  UserStatus,
} from './enums';

// ─── Shared ───────────────────────────────────────────────────────────────────

/** Generic API wrapper — maps to ControllerApiResponse<T> */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error: ApiErrorDetails | null;
  timestamp: string;   // ISO-8601
  path: string;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

/** Maps to ControllerApiResponse.ErrorDetails */
export interface ApiErrorDetails {
  code: number;
  type: string;
  message: string;
  details: Record<string, unknown> | null;
}

/** Maps to ErrorResponse.java */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ─── Compensation Account ─────────────────────────────────────────────────────

/** Maps to CompensationAccountDto.java */
export interface CompensationAccountDto {
  type: CompensationAccountType;
  // Bank fields
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  iban?: string;
  swift?: string;
  // Mobile money fields
  operatorCode?: string;
  operatorName?: string;
  operatorPhone?: string;
  operatorHolderName?: string;
}

// ─── Merchant ─────────────────────────────────────────────────────────────────

/** Maps to CreateMerchantRequest.java */
export interface CreateMerchantRequest {
  code: string;
  name: string;
  logoUrl?: string;
  phone: string;
  businessType: string;
  email: string;
  address: string;
  country: string;
  rccm?: string;
  ninea?: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerCni?: string;
  compensationAccount: CompensationAccountDto;
}

/** Maps to UpdateMerchantStatusRequest.java */
export interface UpdateMerchantStatusRequest {
  status?: MerchantStatus;
}

/** Maps to UpdateMerchantRequest.java */
export interface UpdateMerchantRequest {
  name?: string;
  logoUrl?: string;
  phone?: string;
  businessType?: string;
  email?: string;
  address?: string;
  country?: string;
  rccm?: string;
  ninea?: string;
  ownerFullName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerCni?: string;
  compensationAccount?: CompensationAccountDto;
  status?: MerchantStatus;
}

/** Maps to MerchantResponse.java */
export interface MerchantResponse {
  id: string;
  code: string;
  name: string;
  logoUrl: string | null;
  phone: string;
  businessType: string;
  email: string;
  address: string;
  country: string;
  rccm: string | null;
  ninea: string | null;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerCni: string | null;
  compensationAccount: CompensationAccountDto;
  symmetryMerchantId: string | null;
  agencyCode: string | null;
  status: MerchantStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Operator ─────────────────────────────────────────────────────────────────

/** Maps to CreateOperatorRequest.java */
export interface CreateOperatorRequest {
  code: string;
  name: string;
  country: string;
  supportsPayin: boolean;
  supportsPayout: boolean;
  apiBaseUrl: string;
  isActive: boolean;
}

/** Maps to OperatorResponse.java */
export interface OperatorResponse {
  id: string;
  code: string;
  name: string;
  country: string;
  supportsPayin: boolean;
  supportsPayout: boolean;
  apiBaseUrl: string;
  isActive: boolean;
  createdAt: string;
}

/** Maps to CreateOperatorFeeRequest.java */
export interface CreateOperatorFeeRequest {
  operationType: OperationType;
  feeType: FeeType;
  feePercentage?: number;
  feeFixed?: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  isActive: boolean;
  effectiveFrom: string;   // ISO date (YYYY-MM-DD)
  effectiveTo?: string;
}

/** Maps to OperatorFeeResponse.java */
export interface OperatorFeeResponse {
  id: string;
  operatorId: string;
  operationType: OperationType;
  feeType: FeeType;
  feePercentage: number | null;
  feeFixed: number | null;
  minAmount: number;
  maxAmount: number;
  currency: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

/** Maps to InitiatePaymentRequest.java */
export interface InitiatePaymentRequest {
  reference: string;
  merchantId: string;
  merchantCode: string;
  operatorCode: string;
  amount: number;
  currency: string;
  payerPhone: string;
  payerFullName: string;
  recipientPhone?: string;
  recipientName?: string;
  callbackUrl?: string;
}

/** Maps to PaymentResponse.java */
export interface PaymentResponse {
  id: string;
  reference: string;
  merchantId: string;
  merchantCode: string;
  operatorCode: string;
  payerPhone: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  operatorTransactionId: string | null;
  paymentUrl: string | null;
  expiresAt: string;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

/** Maps to CreateUserRequest.java */
export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleIds: string[];
  sendWelcomeEmail?: boolean;
}

/** Maps to UpdateUserRequest.java */
export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  phone?: string;
  status?: UserStatus;
  roleIds?: string[];
}

/** Maps to ChangePasswordRequest.java */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Maps to UserResponse.java */
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  emailVerified: boolean;
  failedLoginAttempts: number;
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  roles: RoleResponse[];
  createdAt: string;
  updatedAt: string;
}

// ─── Role & Permission ────────────────────────────────────────────────────────

/** Maps to CreatePermissionRequest.java */
export interface CreatePermissionRequest {
  code: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

/** Maps to PermissionResponse.java */
export interface PermissionResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Maps to CreateRoleRequest.java */
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  permissionIds: string[];
  isActive: boolean;
}

/** Maps to UpdateRoleRequest.java */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
  isActive?: boolean;
}

/** Maps to RoleResponse.java */
export interface RoleResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystemRole: boolean;
  permissions: PermissionResponse[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  eventType: NotificationEventType;
  status: NotificationStatus;
  payload: Record<string, unknown>;
  createdAt: string;
}

// ─── Payout ───────────────────────────────────────────────────────────────────

/** Maps to CreatePayoutRequest.java */
export interface CreatePayoutRequest {
  merchantId: string;
  operatorCode: string;
  recipientNumber: string;
  amount: number;
  currency?: string;
  idempotencyKey: string;
}

/** Maps to PayoutResponse.java */
export interface PayoutResponse {
  id: string;
  merchantId: string;
  operatorCode: string;
  recipientNumber: string;
  merchantCode: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  merchantFeeAmount: number;
  currency: string;
  status: PayoutStatus;
  idempotencyKey: string;
  operatorTransactionId: string | null;
  createdAt: string;   // ISO-8601
  updatedAt: string;   // ISO-8601
}

/** Maps to UpdatePayoutStatusRequest (query params) */
export interface UpdatePayoutStatusRequest {
  status: PayoutStatus;
  operatorTransactionId?: string;
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

/** Maps to MerchantBalanceResponse.java */
export interface MerchantBalanceResponse {
  accountId: string;
  merchantId: string;
  currency: string;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  updatedAt: string;  // ISO-8601
}

/** Maps to LedgerEntryResponse.java */
export interface LedgerEntryResponse {
  id: string;
  merchantAccountId: string;
  direction: LedgerDirection;
  entryType: LedgerEntryType;
  amount: number;
  currency: string;
  description: string;
  idempotencyKey: string;
  paymentTransactionId?: string;
  payoutTransactionId?: string;
  createdAt: string;  // ISO-8601
}

// ─── System Account ───────────────────────────────────────────────────────────

/** Maps to SystemAccountBalanceResponse.java */
export interface SystemAccountBalanceResponse {
  accountId: string;
  currency: string;
  balance: number;
  updatedAt: string;  // ISO-8601
}

/** Maps to SystemAccountEntryResponse.java */
export interface SystemAccountEntryResponse {
  id: string;
  systemAccountId: string;
  direction: LedgerDirection;
  entryType: SystemEntryType;
  amount: number;
  currency: string;
  description: string;
  idempotencyKey: string;
  payoutTransactionId: string | null;
  createdAt: string;  // ISO-8601
}

// ─── Parameters ───────────────────────────────────────────────────────────────

/** Maps to ParameterResponse.java */
export interface ParameterResponse {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;  // ISO-8601
  updatedAt: string;  // ISO-8601
}

/** Maps to CreateParameterRequest.java */
export interface CreateParameterRequest {
  key: string;
  value: string;
  category?: string;
  description?: string;
  isActive?: boolean;
  isSystem?: boolean;
}

/** Maps to UpdateParameterRequest.java */
export interface UpdateParameterRequest {
  value?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
}

/** Maps to DefaultMerchantFeeResponse.java */
export interface DefaultMerchantFeeResponse {
  id: string;
  description: string;
  feeType: FeeType;
  feePercentage: number;
  feeFixed: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  isActive: boolean;
  effectiveTo: string | null;  // ISO-8601 date
}

/** Maps to CreateDefaultMerchantFeeRequest.java */
export interface CreateDefaultMerchantFeeRequest {
  description: string;
  feeType: FeeType;
  feePercentage?: number;
  feeFixed?: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  isActive?: boolean;
  effectiveTo?: string;  // ISO-8601 date
}
