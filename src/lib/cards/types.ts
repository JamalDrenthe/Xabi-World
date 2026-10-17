// BaaS (Banking-as-a-Service) Card types for Swan.io and Wallester integration.

export type BaaSProvider = 'swan' | 'wallester';
export type CardFormFactor = 'virtual' | 'physical';
export type CardScheme = 'mastercard' | 'visa';
export type CardStatus = 'active' | 'frozen' | 'blocked' | 'pending';

export interface CardControls {
  contactless: boolean;
  onlinePayments: boolean;
  atmWithdrawals: boolean;
  international: boolean;
}

export interface CardLimits {
  monthly: number;
  daily: number;
  singleTransaction?: number;
}

export interface BaaSCardMetadata {
  provider: BaaSProvider;
  formFactor: CardFormFactor;
  scheme: CardScheme;
  status: CardStatus;
  providerCardId: string;
  providerAccountId?: string;
  applePayEnrolled?: boolean;
  googlePayEnrolled?: boolean;
  deliveryStatus?: 'not_applicable' | 'ordered' | 'dispatched' | 'delivered';
}

export interface SensitiveCardData {
  fullCardNumber: string;
  cvv: string;
  validThru: string;
  pinCode: string;
  ephemeralToken?: string;
  revealedAt: number;
  expiresAt: number; // PCI-DSS auto-hide timestamp
}

// Swan GraphQL API Types
export interface SwanCardInput {
  accountId: string;
  type: 'Virtual' | 'Physical';
  nameOnCard: string;
  spendingLimit: {
    amount: { value: number; currency: 'EUR' };
    period: 'Monthly' | 'Daily';
  };
  cardDesignId?: string;
}

export interface SwanCardSensitiveDataResponse {
  encryptedPan: string;
  encryptedCvv: string;
  expiryMonth: string;
  expiryYear: string;
  ephemeralSecret: string;
}

// Wallester REST API Types
export interface WallesterIssueCardRequest {
  account_id: string;
  card_type: 'VIRTUAL' | 'PLASTIC';
  embossed_name: string;
  security_profile_id?: string;
  limits: {
    monthly_purchase: number;
    daily_purchase: number;
    daily_atm: number;
  };
}

export interface WallesterCardResponse {
  id: string;
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
  masked_pan: string;
  expiry_date: string;
  card_type: 'VIRTUAL' | 'PLASTIC';
}

// Webhook payloads for live incoming BaaS events
export interface SwanWebhookEvent {
  id: string;
  eventType: 'Card.Created' | 'Card.Updated' | 'Transaction.Created' | 'Card.PaymentMandateCreated';
  timestamp: string;
  data: {
    cardId: string;
    status: string;
    reason?: string;
  };
}

export interface WallesterWebhookEvent {
  event_id: string;
  type: 'card.created' | 'card.status_change' | 'card.limits_updated' | 'transaction.auth_request';
  created_at: string;
  payload: {
    card_id: string;
    new_status?: string;
    amount?: number;
    currency?: string;
  };
}
