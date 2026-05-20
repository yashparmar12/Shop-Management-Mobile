import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 5000;

/** Host the JS bundle is loaded from (your PC when using Expo Go on the same Wi‑Fi). */
function getDevMachineHost(): string | null {
  const expoGo = Constants.expoGoConfig as { debuggerHost?: string } | null | undefined;
  const fromDebugger = expoGo?.debuggerHost?.trim();
  if (fromDebugger) {
    return fromDebugger.split(':')[0]?.trim() || null;
  }
  const hostUri = Constants.expoConfig?.hostUri?.trim();
  if (hostUri) {
    return hostUri.split(':')[0]?.trim() || null;
  }
  return null;
}

function apiUrlLooksEmulatorOnly(url: string): boolean {
  return /(^https?:\/\/)?(localhost|127\.0\.0\.1|10\.0\.2\.2)(:|\/|$)/i.test(url);
}

/**
 * Builds API base URL:
 * - **Release builds:** uses `EXPO_PUBLIC_API_URL` or platform localhost defaults (set the env for production).
 * - **Dev:** prefers the machine running Metro (works for Expo Go on a **real phone** on the same Wi‑Fi).
 *   Your `.env` often has `10.0.2.2` (Android emulator only). On a physical device we override that using
 *   the Expo dev server host (`debuggerHost`).
 * - Set `EXPO_PUBLIC_API_STRICT_ENV=true` to always use exactly `EXPO_PUBLIC_API_URL` (no overrides).
 */
const getDefaultApiUrl = (): string => {
  const strict = process.env.EXPO_PUBLIC_API_STRICT_ENV === 'true';
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (__DEV__) {
    const devHost = getDevMachineHost();

    if (!strict && fromEnv && apiUrlLooksEmulatorOnly(fromEnv) && devHost) {
      // Physical phone (or LAN): emulator-only URL in .env will break — use Metro host instead.
      return `http://${devHost}:${BACKEND_PORT}/api`;
    }

    if (!strict && (!fromEnv || fromEnv === '')) {
      if (devHost && devHost !== 'unknown') {
        return `http://${devHost}:${BACKEND_PORT}/api`;
      }
    }
  }

  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${BACKEND_PORT}/api`
    : `http://localhost:${BACKEND_PORT}/api`;
};

export const API_URL = getDefaultApiUrl();

if (__DEV__) {
  // eslint-disable-next-line no-console -- helpful when debugging phone ↔ API connection
  console.info('[ShopInventory] API_URL =', API_URL);
}

export const TOKEN_KEY = 'shop_inventory_token';
export const USER_KEY = 'shop_inventory_user';

export const PAYMENT_METHODS = ['cash', 'card', 'upi', 'credit'] as const;

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Salary',
  'Transport',
  'Maintenance',
  'Miscellaneous',
] as const;

export const PRODUCT_CATEGORIES = [
  'Grocery',
  'Dairy',
  'Household',
  'Beverages',
  'Snacks',
  'Personal Care',
  'Other',
] as const;
