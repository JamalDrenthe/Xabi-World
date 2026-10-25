import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ExtendedBankCard } from '../financial-store';

export const CARDS_COLLECTION = 'cards';

// All predefined account cards to seed Firestore with
export const SEED_ACCOUNTS_CARDS: Array<{
  email: string;
  name: string;
  userId: string;
  cards: ExtendedBankCard[];
}> = [
  {
    email: 'info@xabi.world',
    name: 'Jamal Drenthe',
    userId: 'demo-admin',
    cards: [
      {
        id: 'c-admin-1',
        label: 'Xabi Obsidian Metal',
        network: 'Mastercard World Elite',
        balance: 9850.0,
        holder: 'Jamal Drenthe',
        validThru: '12/30',
        maskedNumber: '5500 **** **** 0001',
        fullCardNumber: '5500 9481 2049 0001',
        variant: 'dark',
        isFrozen: false,
        spendingLimit: 25000,
        pinCode: '4921',
        cvv: '918',
        provider: 'swan',
        cardType: 'physical',
        providerCardId: 'swan_crd_jamal_obsidian_01',
        userEmail: 'info@xabi.world',
        userId: 'demo-admin',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true },
      },
      {
        id: 'c-admin-2',
        label: 'Quantum Executive Corporate',
        network: 'Visa Infinite',
        balance: 4520.0,
        holder: 'Jamal Drenthe',
        validThru: '08/29',
        maskedNumber: '4929 **** **** 8888',
        fullCardNumber: '4929 6183 9402 8888',
        variant: 'light',
        isFrozen: false,
        spendingLimit: 15000,
        pinCode: '1840',
        cvv: '442',
        provider: 'wallester',
        cardType: 'virtual',
        providerCardId: 'wst_crd_jamal_exec_88',
        userEmail: 'info@xabi.world',
        userId: 'demo-admin',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: false, international: true },
      },
    ],
  },
  {
    email: 'daan.vermeulen@xabi.world',
    name: 'Daan Vermeulen',
    userId: 'demo-daan',
    cards: [
      {
        id: 'c1',
        label: 'Xabi Signature Metal',
        network: 'Mastercard World Elite',
        balance: 8412.3,
        holder: 'Daan Vermeulen',
        validThru: '09/29',
        maskedNumber: '5273 **** **** 8901',
        fullCardNumber: '5273 4019 8263 8901',
        variant: 'dark',
        isFrozen: false,
        spendingLimit: 5000,
        pinCode: '7134',
        cvv: '482',
        provider: 'swan',
        cardType: 'physical',
        providerCardId: 'swan_crd_01HQ8901',
        userEmail: 'daan.vermeulen@xabi.world',
        userId: 'demo-daan',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true },
      },
      {
        id: 'c2',
        label: 'Xabi Classic Card',
        network: 'Visa Corporate',
        balance: 6275.4,
        holder: 'Daan Vermeulen',
        validThru: '03/28',
        maskedNumber: '4726 **** **** 4127',
        fullCardNumber: '4726 9182 3014 4127',
        variant: 'light',
        isFrozen: false,
        spendingLimit: 3000,
        pinCode: '9012',
        cvv: '127',
        provider: 'wallester',
        cardType: 'virtual',
        providerCardId: 'wst_crd_4127_biz',
        userEmail: 'daan.vermeulen@xabi.world',
        userId: 'demo-daan',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: false, international: true },
      },
    ],
  },
  {
    email: 'sophie.vandijk@xabi.world',
    name: 'Sophie van Dijk',
    userId: 'demo-sophie',
    cards: [
      {
        id: 'c-sophie-1',
        label: 'Xabi Gold Reserve',
        network: 'Mastercard Platinum',
        balance: 6830.5,
        holder: 'Sophie van Dijk',
        validThru: '05/30',
        maskedNumber: '5310 **** **** 4490',
        fullCardNumber: '5310 8291 3042 4490',
        variant: 'dark',
        isFrozen: false,
        spendingLimit: 12500,
        pinCode: '2981',
        cvv: '761',
        provider: 'swan',
        cardType: 'physical',
        providerCardId: 'swan_crd_sophie_gold_01',
        userEmail: 'sophie.vandijk@xabi.world',
        userId: 'demo-sophie',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true },
      },
      {
        id: 'c-sophie-2',
        label: 'Xabi Green Impact Card',
        network: 'Visa Signature',
        balance: 3200.0,
        holder: 'Sophie van Dijk',
        validThru: '11/29',
        maskedNumber: '4111 **** **** 9032',
        fullCardNumber: '4111 6729 8812 9032',
        variant: 'light',
        isFrozen: false,
        spendingLimit: 7500,
        pinCode: '5512',
        cvv: '319',
        provider: 'wallester',
        cardType: 'virtual',
        providerCardId: 'wst_crd_sophie_green_90',
        userEmail: 'sophie.vandijk@xabi.world',
        userId: 'demo-sophie',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: false, international: true },
      },
    ],
  },
  {
    email: 'lucas.deboer@xabi.world',
    name: 'Lucas de Boer',
    userId: 'demo-lucas',
    cards: [
      {
        id: 'c-lucas-1',
        label: 'Xabi Business Obsidian',
        network: 'Mastercard World Elite',
        balance: 12450.0,
        holder: 'Lucas de Boer',
        validThru: '04/30',
        maskedNumber: '5421 **** **** 7744',
        fullCardNumber: '5421 8832 9912 7744',
        variant: 'dark',
        isFrozen: false,
        spendingLimit: 20000,
        pinCode: '6128',
        cvv: '824',
        provider: 'swan',
        cardType: 'physical',
        providerCardId: 'swan_crd_lucas_biz_77',
        userEmail: 'lucas.deboer@xabi.world',
        userId: 'demo-lucas',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true },
      },
      {
        id: 'c-lucas-2',
        label: 'Xabi Commercial Fuel & Travel',
        network: 'Visa Corporate',
        balance: 2180.0,
        holder: 'Lucas de Boer',
        validThru: '09/28',
        maskedNumber: '4800 **** **** 3321',
        fullCardNumber: '4800 5591 2094 3321',
        variant: 'light',
        isFrozen: false,
        spendingLimit: 5000,
        pinCode: '4019',
        cvv: '190',
        provider: 'wallester',
        cardType: 'virtual',
        providerCardId: 'wst_crd_lucas_fuel_33',
        userEmail: 'lucas.deboer@xabi.world',
        userId: 'demo-lucas',
        controls: { contactless: true, onlinePayments: true, atmWithdrawals: true, international: false },
      },
    ],
  },
];

/**
 * Clean card object to ensure all required fields are present
 */
function sanitizeCardData(card: Partial<ExtendedBankCard>, defaultEmail: string): ExtendedBankCard {
  const fullNum = card.fullCardNumber || '5500 0000 0000 0000';
  const cleanDigits = fullNum.replace(/\s+/g, '');
  const last4 = cleanDigits.slice(-4) || '0000';
  const masked = card.maskedNumber || `${cleanDigits.slice(0, 4)} **** **** ${last4}`;

  return {
    id: card.id || `c-${Date.now().toString(36)}`,
    label: card.label || 'Xabi Card',
    network: card.network || (card.provider === 'wallester' ? 'Visa Infinite' : 'Mastercard World Elite'),
    balance: Number(card.balance ?? 0),
    holder: card.holder || 'Kaarthouder',
    validThru: card.validThru || '12/29',
    maskedNumber: masked,
    fullCardNumber: fullNum,
    cvv: card.cvv || '123',
    pinCode: card.pinCode || '0000',
    provider: card.provider || 'swan',
    cardType: card.cardType || 'virtual',
    providerCardId: card.providerCardId || `crd_${Date.now()}`,
    variant: card.variant || 'dark',
    isFrozen: Boolean(card.isFrozen),
    spendingLimit: Number(card.spendingLimit || 5000),
    userEmail: (card.userEmail || defaultEmail).toLowerCase().trim(),
    userId: card.userId || '',
    controls: {
      contactless: card.controls?.contactless ?? true,
      onlinePayments: card.controls?.onlinePayments ?? true,
      atmWithdrawals: card.controls?.atmWithdrawals ?? true,
      international: card.controls?.international ?? true,
    },
  };
}

/**
 * Save a single card to Cloud Firestore
 */
export async function saveCardToFirestore(card: ExtendedBankCard): Promise<{ success: boolean; error?: string }> {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, card.id);
    const dataToSave = {
      ...card,
      userEmail: card.userEmail?.toLowerCase().trim() || '',
      updatedAt: serverTimestamp(),
    };

    await setDoc(cardRef, dataToSave, { merge: true });

    // Also mirror to local storage cache
    const cacheKey = `xabi-cards-${card.userEmail?.toLowerCase()}`;
    try {
      const existing = localStorage.getItem(cacheKey);
      let list: ExtendedBankCard[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex((c) => c.id === card.id);
      if (idx >= 0) {
        list[idx] = card;
      } else {
        list.push(card);
      }
      localStorage.setItem(cacheKey, JSON.stringify(list));
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[Firestore] Could not save card to remote Firestore:', err?.message || err);

    // Update local cache even if offline/permission issue
    try {
      const cacheKey = `xabi-cards-${card.userEmail?.toLowerCase()}`;
      const existing = localStorage.getItem(cacheKey);
      let list: ExtendedBankCard[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex((c) => c.id === card.id);
      if (idx >= 0) {
        list[idx] = card;
      } else {
        list.push(card);
      }
      localStorage.setItem(cacheKey, JSON.stringify(list));
    } catch {
      // ignore
    }

    return { success: false, error: err?.message || 'Firestore fout bij opslaan' };
  }
}

/**
 * Delete a card from Cloud Firestore
 */
export async function deleteCardFromFirestore(cardId: string, userEmail?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    await deleteDoc(cardRef);

    if (userEmail) {
      const cacheKey = `xabi-cards-${userEmail.toLowerCase()}`;
      try {
        const existing = localStorage.getItem(cacheKey);
        if (existing) {
          const list: ExtendedBankCard[] = JSON.parse(existing);
          const filtered = list.filter((c) => c.id !== cardId);
          localStorage.setItem(cacheKey, JSON.stringify(filtered));
        }
      } catch {
        // ignore
      }
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[Firestore] Could not delete card from remote Firestore:', err?.message || err);
    return { success: false, error: err?.message || 'Fout bij verwijderen uit Firestore' };
  }
}

/**
 * Fetch cards for a specific account email from Firestore
 */
export async function fetchCardsForAccount(userEmail: string): Promise<ExtendedBankCard[]> {
  const cleanEmail = userEmail.toLowerCase().trim();
  const cacheKey = `xabi-cards-${cleanEmail}`;

  try {
    const q = query(collection(db, CARDS_COLLECTION), where('userEmail', '==', cleanEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const remoteCards: ExtendedBankCard[] = [];
      querySnapshot.forEach((d) => {
        const raw = d.data() as Partial<ExtendedBankCard>;
        remoteCards.push(sanitizeCardData({ ...raw, id: d.id }, cleanEmail));
      });

      // Update cache
      localStorage.setItem(cacheKey, JSON.stringify(remoteCards));
      return remoteCards;
    }
  } catch (err) {
    console.warn(`[Firestore] Fetch cards for ${cleanEmail} fallback to local cache:`, err);
  }

  // Fallback to localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: ExtendedBankCard[] = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c) => sanitizeCardData(c, cleanEmail));
      }
    }
  } catch {
    // ignore
  }

  // Fallback to seed account cards
  const foundAccount = SEED_ACCOUNTS_CARDS.find((a) => a.email.toLowerCase() === cleanEmail);
  if (foundAccount) {
    return foundAccount.cards;
  }

  return [];
}

/**
 * Fetch all cards across all accounts (for Admin view)
 */
export async function fetchAllCardsForAdmin(): Promise<Record<string, ExtendedBankCard[]>> {
  const grouped: Record<string, ExtendedBankCard[]> = {};

  // First initialize with seed accounts
  for (const acc of SEED_ACCOUNTS_CARDS) {
    grouped[acc.email.toLowerCase()] = [...acc.cards];
  }

  try {
    const querySnapshot = await getDocs(collection(db, CARDS_COLLECTION));
    if (!querySnapshot.empty) {
      // Clear grouped and populate from Firestore
      const emailMap: Record<string, ExtendedBankCard[]> = {};

      querySnapshot.forEach((d) => {
        const raw = d.data() as Partial<ExtendedBankCard>;
        const email = (raw.userEmail || 'info@xabi.world').toLowerCase().trim();
        const card = sanitizeCardData({ ...raw, id: d.id }, email);

        if (!emailMap[email]) {
          emailMap[email] = [];
        }
        emailMap[email].push(card);
      });

      // Merge with seed accounts in case any account has no cards yet
      for (const acc of SEED_ACCOUNTS_CARDS) {
        const email = acc.email.toLowerCase();
        if (emailMap[email] && emailMap[email].length > 0) {
          grouped[email] = emailMap[email];
        }
      }

      // Add any additional dynamic accounts from Firestore
      for (const [email, cards] of Object.entries(emailMap)) {
        grouped[email] = cards;
      }
    }
  } catch (err) {
    console.warn('[Firestore] Admin fetch all cards fallback to local cache/seeds:', err);
  }

  return grouped;
}

/**
 * Seed all default demo account cards to Firestore so Firestore is pre-populated
 */
export async function seedAllCardsToFirestore(): Promise<{ count: number; error?: string }> {
  let count = 0;
  try {
    for (const acc of SEED_ACCOUNTS_CARDS) {
      for (const card of acc.cards) {
        const cardRef = doc(db, CARDS_COLLECTION, card.id);
        await setDoc(
          cardRef,
          {
            ...card,
            userEmail: acc.email.toLowerCase(),
            userId: acc.userId,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
        count++;
      }
    }
    return { count };
  } catch (err: any) {
    console.warn('[Firestore] Seed cards failed:', err?.message || err);
    return { count, error: err?.message || 'Fout bij synchroniseren met Firestore' };
  }
}
