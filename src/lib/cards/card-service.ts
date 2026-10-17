// Unified BaaS Card Service for Xabi World
// Orchestrates between Swan (Mastercard BaaS) and Wallester (Visa EMI Issuing).

import { swanClient } from './swan-client';
import { wallesterClient } from './wallester-client';
import type { BaaSProvider, CardFormFactor, CardScheme, SensitiveCardData } from './types';

export interface NewCardOptions {
  provider: BaaSProvider;
  formFactor: CardFormFactor;
  label: string;
  holder: string;
  spendingLimit: number;
  scheme?: CardScheme;
}

export interface IssuedCardResult {
  id: string;
  provider: BaaSProvider;
  providerCardId: string;
  label: string;
  holder: string;
  network: string;
  formFactor: CardFormFactor;
  fullCardNumber: string;
  maskedNumber: string;
  validThru: string;
  cvv: string;
  pinCode: string;
  spendingLimit: number;
  balance: number;
  isFrozen: boolean;
  variant: 'dark' | 'light';
}

class BaaSCardService {
  /**
   * Issue a new debit/credit card via Swan or Wallester
   */
  async issueCard(options: NewCardOptions): Promise<IssuedCardResult> {
    const isSwan = options.provider === 'swan';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const randomMid1 = Math.floor(1000 + Math.random() * 9000).toString();
    const randomMid2 = Math.floor(1000 + Math.random() * 9000).toString();

    let fullCardNumber: string;
    let maskedNumber: string;
    let providerCardId: string;
    let network: string;

    if (isSwan) {
      fullCardNumber = `5500 ${randomMid1} ${randomMid2} ${randomSuffix}`;
      maskedNumber = `5500 **** **** ${randomSuffix}`;
      providerCardId = `swan_crd_${Date.now().toString(36)}_${randomSuffix}`;
      network = 'Mastercard World Elite';
      await swanClient.issueCard({
        accountId: 'swan_acc_primary',
        type: options.formFactor === 'physical' ? 'Physical' : 'Virtual',
        nameOnCard: options.holder,
        spendingLimit: {
          amount: { value: options.spendingLimit, currency: 'EUR' },
          period: 'Monthly',
        },
      });
    } else {
      fullCardNumber = `4929 ${randomMid1} ${randomMid2} ${randomSuffix}`;
      maskedNumber = `4929 **** **** ${randomSuffix}`;
      providerCardId = `wst_crd_${Date.now().toString(36)}_${randomSuffix}`;
      network = 'Visa Infinite';
      await wallesterClient.issueCard({
        account_id: 'wst_acc_primary',
        card_type: options.formFactor === 'physical' ? 'PLASTIC' : 'VIRTUAL',
        embossed_name: options.holder,
        limits: {
          monthly_purchase: options.spendingLimit,
          daily_purchase: Math.round(options.spendingLimit / 5),
          daily_atm: 1000,
        },
      });
    }

    const randomCvv = Math.floor(100 + Math.random() * 900).toString();
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    return {
      id: `c-${options.provider}-${Date.now().toString(36)}`,
      provider: options.provider,
      providerCardId,
      label: options.label || (isSwan ? 'Xabi Swan Obsidian' : 'Xabi Wallester Virtual'),
      holder: options.holder,
      network,
      formFactor: options.formFactor,
      fullCardNumber,
      maskedNumber,
      validThru: '10/30',
      cvv: randomCvv,
      pinCode: randomPin,
      spendingLimit: options.spendingLimit,
      balance: 0,
      isFrozen: false,
      variant: options.formFactor === 'physical' ? 'dark' : 'light',
    };
  }

  /**
   * Freeze card with BaaS provider
   */
  async freezeCard(provider: BaaSProvider, providerCardId: string): Promise<boolean> {
    if (provider === 'swan') {
      return swanClient.suspendCard(providerCardId);
    }
    return wallesterClient.freezeCard(providerCardId);
  }

  /**
   * Resume / Unfreeze card with BaaS provider
   */
  async unfreezeCard(provider: BaaSProvider, providerCardId: string): Promise<boolean> {
    if (provider === 'swan') {
      return swanClient.resumeCard(providerCardId);
    }
    return wallesterClient.unfreezeCard(providerCardId);
  }

  /**
   * Update spending limit
   */
  async updateLimit(provider: BaaSProvider, providerCardId: string, limit: number): Promise<boolean> {
    if (provider === 'swan') {
      return swanClient.updateSpendingLimit(providerCardId, limit);
    }
    return wallesterClient.updateLimits(providerCardId, limit);
  }

  /**
   * Ephemeral PCI-DSS token generation for in-app secure reveal
   */
  async requestSecureRevealToken(provider: BaaSProvider, providerCardId: string): Promise<Partial<SensitiveCardData>> {
    if (provider === 'swan') {
      return swanClient.getSensitiveCardToken(providerCardId);
    }
    return wallesterClient.getCardWidgetToken(providerCardId);
  }

  /**
   * Apple Pay Push Provisioning Payload
   */
  generateApplePayPayload(providerCardId: string, holder: string) {
    return {
      primaryAccountIdentifier: providerCardId,
      cardholderName: holder,
      localizedDescription: 'Xabi Obsidian Metal Card',
      paymentNetwork: 'MASTERCARD',
      encryptionScheme: 'ECC_V2',
    };
  }

  /**
   * Google Pay Push Provisioning Payload
   */
  generateGooglePayPayload(providerCardId: string, holder: string) {
    return {
      tokenServiceProvider: 'MASTERCARD',
      cardholderName: holder,
      opaquePaymentCard: `OPC_${providerCardId}`,
    };
  }
}

export const cardService = new BaaSCardService();
