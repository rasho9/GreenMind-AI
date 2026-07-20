import { clientEnvironment } from '@/services/platform';

/**
 * Keeps provider selection outside UI components. Demo mode is the safe default;
 * a live provider may enhance a result when it succeeds, but never blocks a flow.
 */
export function isDemoMode() {
  return !clientEnvironment.liveServicesEnabled;
}

/** Returns deterministic local data whenever a live provider is disabled or fails. */
export async function withDemoFallback<T>(
  getLive: () => Promise<T>,
  getDemo: () => T | Promise<T>,
): Promise<T> {
  if (isDemoMode()) return getDemo();
  try {
    return await getLive();
  } catch {
    return getDemo();
  }
}
