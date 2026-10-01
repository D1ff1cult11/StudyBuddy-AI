// ==========================================
// RevenueCat SDK Integration Unit Tests
// ==========================================
// Validates initialization, paywall offerings,
// entitlement check, and demo-mode fallbacks.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initRevenueCat,
  checkProStatus,
  getOfferings,
  purchasePackage,
  restorePurchases,
  isRealMode
} from '../utils/revenuecat';

const mockStorage: Record<string, string> = {};
const safeLocalStorage = {
  getItem: (k: string) => mockStorage[k] ?? null,
  setItem: (k: string, v: string) => { mockStorage[k] = String(v); },
  removeItem: (k: string) => { delete mockStorage[k]; },
  clear: () => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  }
};

describe('RevenueCat SDK Integration', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: safeLocalStorage,
      writable: true,
      configurable: true
    });
    safeLocalStorage.clear();
    vi.restoreAllMocks();
  });

  it('runs safely in demo/fallback mode when API key is missing or unconfigured', async () => {
    const initialized = await initRevenueCat();
    // Default env has placeholder or no key
    expect(typeof initialized).toBe('boolean');
  });

  it('checkProStatus returns inactive by default in demo mode', async () => {
    const status = await checkProStatus();
    expect(status.isActive).toBe(false);
    expect(status.expirationDate).toBeNull();
    expect(status.productIdentifier).toBeNull();
  });

  it('checkProStatus detects simulated Pro purchase from localStorage', async () => {
    localStorage.setItem('studybuddy_pro_active', 'true');
    const status = await checkProStatus();
    expect(status.isActive).toBe(true);
  });

  it('getOfferings returns structured packages in fallback mode', async () => {
    const offerings = await getOfferings();
    expect(offerings).toBeDefined();
    expect(offerings?.current).toBeDefined();
    expect(offerings?.current?.availablePackages.length).toBeGreaterThan(0);

    const firstPkg = offerings?.current?.availablePackages[0];
    expect(firstPkg?.identifier).toBe('$rc_annual');
    expect((firstPkg?.product as any).price).toBe(29.99);
    expect((firstPkg?.product as any).currencyCode).toBe('USD');
  });

  it('purchasePackage handles purchase simulation and stores Pro entitlement', async () => {
    const offerings = await getOfferings();
    const pkg = offerings?.current?.availablePackages[0];

    const success = await purchasePackage(pkg);
    expect(success).toBe(true);

    const proStatus = await checkProStatus();
    expect(proStatus.isActive).toBe(true);
  });

  it('restorePurchases recovers stored Pro entitlement state', async () => {
    localStorage.setItem('studybuddy_pro_active', 'true');
    const status = await restorePurchases();
    expect(status.isActive).toBe(true);
  });

  it('isRealMode returns boolean flag without throwing', () => {
    const real = isRealMode();
    expect(typeof real).toBe('boolean');
  });
});
