// ==========================================
// RevenueCat Web SDK Integration (REAL)
// ==========================================
// Uses @revenuecat/purchases-js for actual paywall
// and entitlement management. Free tier: $0 up to $2,500 MTR.

import { Purchases } from '@revenuecat/purchases-js';

// Entitlement identifiers configured in RevenueCat dashboard
const ENTITLEMENT_PRO = 'pro';

export interface ProStatus {
  isActive: boolean;
  expirationDate: string | null;
  productIdentifier: string | null;
  willRenew: boolean;
}

let purchasesInstance: Purchases | null = null;
let configured = false;

/**
 * Initialize RevenueCat SDK with your API key.
 * Call this once at app startup (e.g., in App.tsx or main.tsx).
 */
export async function initRevenueCat(appUserId?: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;

  if (!apiKey || apiKey === 'your_revenuecat_api_key_here') {
    console.warn('[RevenueCat] No API key found. Running in demo mode.');
    return false;
  }

  try {
    purchasesInstance = Purchases.configure(
      apiKey,
      appUserId || `studybuddy_${Date.now()}`
    );
    configured = true;
    console.log('[RevenueCat] SDK configured successfully');
    return true;
  } catch (e) {
    console.error('[RevenueCat] Configuration failed:', e);
    return false;
  }
}

/**
 * Check if the current user has an active Pro entitlement.
 */
export async function checkProStatus(): Promise<ProStatus> {
  if (!configured || !purchasesInstance) {
    // Demo mode fallback — check localStorage for simulated purchase
    const simulated = localStorage.getItem('studybuddy_pro_active');
    return {
      isActive: simulated === 'true',
      expirationDate: null,
      productIdentifier: null,
      willRenew: false,
    };
  }

  try {
    const customerInfo = await purchasesInstance.getCustomerInfo();
    const proEntitlement = customerInfo.entitlements.active[ENTITLEMENT_PRO];

    if (proEntitlement) {
      return {
        isActive: true,
        expirationDate: proEntitlement.expirationDate?.toString() || null,
        productIdentifier: proEntitlement.productIdentifier,
        willRenew: proEntitlement.willRenew,
      };
    }

    return {
      isActive: false,
      expirationDate: null,
      productIdentifier: null,
      willRenew: false,
    };
  } catch (e) {
    console.error('[RevenueCat] Failed to fetch customer info:', e);
    return {
      isActive: false,
      expirationDate: null,
      productIdentifier: null,
      willRenew: false,
    };
  }
}

/**
 * Fetch available offerings (products/packages) from RevenueCat.
 */
export async function getOfferings() {
  if (!configured || !purchasesInstance) {
    // Demo mode: return mock offering
    return {
      current: {
        identifier: 'default',
        availablePackages: [
          {
            identifier: '$rc_annual',
            packageType: 'ANNUAL',
            product: {
              identifier: 'studybuddy_pro_annual',
              title: 'StudyBuddy Pro Annual',
              price: 29.99,
              priceString: '$29.99',
              currencyCode: 'USD',
            },
          },
        ],
      },
    };
  }

  try {
    const offerings = await purchasesInstance.getOfferings();
    return offerings;
  } catch (e) {
    console.error('[RevenueCat] Failed to fetch offerings:', e);
    return null;
  }
}

/**
 * Purchase a package (triggers RevenueCat Billing / Stripe checkout).
 */
export async function purchasePackage(pkg: any): Promise<boolean> {
  if (!configured || !purchasesInstance) {
    // Demo mode: simulate purchase
    localStorage.setItem('studybuddy_pro_active', 'true');
    return true;
  }

  try {
    const { customerInfo } = await purchasesInstance.purchase({ rcPackage: pkg });
    const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_PRO];
    return isPro;
  } catch (e: any) {
    if (e.userCancelled) {
      console.log('[RevenueCat] Purchase cancelled by user');
    } else {
      console.error('[RevenueCat] Purchase failed:', e);
    }
    return false;
  }
}

/**
 * Restore previous purchases (useful for returning users).
 */
export async function restorePurchases(): Promise<ProStatus> {
  if (!configured || !purchasesInstance) {
    return checkProStatus();
  }

  try {
    const customerInfo = await purchasesInstance.getCustomerInfo();
    const proEntitlement = customerInfo.entitlements.active[ENTITLEMENT_PRO];
    return {
      isActive: !!proEntitlement,
      expirationDate: proEntitlement?.expirationDate?.toString() || null,
      productIdentifier: proEntitlement?.productIdentifier || null,
      willRenew: proEntitlement?.willRenew || false,
    };
  } catch (e) {
    console.error('[RevenueCat] Restore failed:', e);
    return { isActive: false, expirationDate: null, productIdentifier: null, willRenew: false };
  }
}

/**
 * Check if SDK is running in real mode vs demo/fallback mode.
 */
export function isRealMode(): boolean {
  return configured;
}
