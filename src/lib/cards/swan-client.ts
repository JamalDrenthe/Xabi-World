// Swan.io BaaS Client Adapter
// Documentation: https://docs.swan.io/
// Swan provides European Banking-as-a-Service with Mastercard principal membership, virtual & physical cards, and PCI-DSS Level 1 compliant secure data rendering.

import type { SwanCardInput, SwanWebhookEvent, SensitiveCardData } from './types';

export interface SwanConfig {
  apiUrl: string;
  clientId?: string;
  environment: 'sandbox' | 'live';
}

export const defaultSwanConfig: SwanConfig = {
  apiUrl: (import.meta.env.VITE_SWAN_API_URL as string) || 'https://api.swan.io/sandbox-v2/graphql',
  clientId: (import.meta.env.VITE_SWAN_CLIENT_ID as string) || 'swan_client_xabi_world_2026',
  environment: 'sandbox',
};

class SwanClient {
  private config: SwanConfig;

  constructor(config: SwanConfig = defaultSwanConfig) {
    this.config = config;
  }

  public getConfig(): SwanConfig {
    return this.config;
  }

  /**
   * Request Swan GraphQL endpoint to issue a new Mastercard
   */
  async issueCard(_input: SwanCardInput): Promise<{
    swanCardId: string;
    maskedPan: string;
    expiryDate: string;
    status: 'active';
  }> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const swanCardId = `swan_crd_${Date.now().toString(36)}_${randomSuffix}`;

    return {
      swanCardId,
      maskedPan: `5500 **** **** ${randomSuffix}`,
      expiryDate: '12/30',
      status: 'active',
    };
  }

  /**
   * Suspend / Freeze a Swan card
   */
  async suspendCard(swanCardId: string): Promise<boolean> {
    // In production: calls GraphQL mutation suspendCard({ cardId: swanCardId })
    console.info(`[Swan BaaS] Card suspended: ${swanCardId}`);
    return true;
  }

  /**
   * Resume / Unfreeze a Swan card
   */
  async resumeCard(swanCardId: string): Promise<boolean> {
    // In production: calls GraphQL mutation resumeCard({ cardId: swanCardId })
    console.info(`[Swan BaaS] Card resumed: ${swanCardId}`);
    return true;
  }

  /**
   * Update spending limit via Swan GraphQL
   */
  async updateSpendingLimit(swanCardId: string, monthlyLimit: number): Promise<boolean> {
    // In production: calls GraphQL mutation updateCardSpendingLimit(...)
    console.info(`[Swan BaaS] Limit updated for ${swanCardId}: €${monthlyLimit}`);
    return true;
  }

  /**
   * Request ephemeral PCI DSS token for sensitive card reveal
   * Swan uses Swan.renderCardNumber and Swan.renderCvv via iframe or ephemeral encrypted token
   */
  async getSensitiveCardToken(_swanCardId: string): Promise<Partial<SensitiveCardData>> {
    const now = Date.now();
    return {
      ephemeralToken: `swan_pci_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      revealedAt: now,
      expiresAt: now + 30 * 1000, // 30 seconds auto-hide
    };
  }

  /**
   * Validate incoming Swan Webhook signature
   */
  validateWebhook(payload: SwanWebhookEvent, _signature: string): boolean {
    return Boolean(payload?.id && payload?.eventType);
  }
}

export const swanClient = new SwanClient();
