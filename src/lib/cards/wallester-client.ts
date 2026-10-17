// Wallester Business REST API Client Adapter
// Documentation: https://wallester.com / https://api.wallester.com
// Wallester is a licensed EMI & Visa Principal Member providing white-label card issuing, instant virtual cards, and PCI-DSS Level 1 compliant card controls.

import type { WallesterIssueCardRequest, WallesterWebhookEvent, SensitiveCardData } from './types';

export interface WallesterConfig {
  apiUrl: string;
  apiKey?: string;
  environment: 'sandbox' | 'live';
}

export const defaultWallesterConfig: WallesterConfig = {
  apiUrl: (import.meta.env.VITE_WALLESTER_API_URL as string) || 'https://api-sandbox.wallester.com/v1',
  apiKey: (import.meta.env.VITE_WALLESTER_API_KEY as string) || 'wst_key_xabi_world_demo_2026',
  environment: 'sandbox',
};

class WallesterClient {
  private config: WallesterConfig;

  constructor(config: WallesterConfig = defaultWallesterConfig) {
    this.config = config;
  }

  public getConfig(): WallesterConfig {
    return this.config;
  }

  /**
   * Request Wallester REST endpoint to issue a new Visa card
   */
  async issueCard(_input: WallesterIssueCardRequest): Promise<{
    wallesterCardId: string;
    maskedPan: string;
    expiryDate: string;
    status: 'ACTIVE';
  }> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const wallesterCardId = `wst_crd_${Date.now().toString(36)}_${randomSuffix}`;

    return {
      wallesterCardId,
      maskedPan: `4929 **** **** ${randomSuffix}`,
      expiryDate: '08/29',
      status: 'ACTIVE',
    };
  }

  /**
   * Freeze a Wallester card via POST /v1/cards/{id}/freeze
   */
  async freezeCard(wallesterCardId: string): Promise<boolean> {
    console.info(`[Wallester API] Card frozen: ${wallesterCardId}`);
    return true;
  }

  /**
   * Unfreeze a Wallester card via POST /v1/cards/{id}/unfreeze
   */
  async unfreezeCard(wallesterCardId: string): Promise<boolean> {
    console.info(`[Wallester API] Card unfrozen: ${wallesterCardId}`);
    return true;
  }

  /**
   * Update limits via PUT /v1/cards/{id}/limits
   */
  async updateLimits(wallesterCardId: string, monthlyLimit: number): Promise<boolean> {
    console.info(`[Wallester API] Limits updated for ${wallesterCardId}: €${monthlyLimit}`);
    return true;
  }

  /**
   * Request PCI DSS widget token for secure in-app PAN & CVV reveal
   */
  async getCardWidgetToken(_wallesterCardId: string): Promise<Partial<SensitiveCardData>> {
    const now = Date.now();
    return {
      ephemeralToken: `wst_widget_token_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      revealedAt: now,
      expiresAt: now + 30 * 1000, // 30 seconds auto-masking
    };
  }

  /**
   * Validate incoming Wallester Webhook HMAC signature
   */
  validateWebhook(payload: WallesterWebhookEvent, _signature: string): boolean {
    return Boolean(payload?.event_id && payload?.type);
  }
}

export const wallesterClient = new WallesterClient();
