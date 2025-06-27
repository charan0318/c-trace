
// Feature flags configuration
export const FEATURES = {
  WALLET_CONNECTION: true, // Set to false to disable wallet connection
  // Add more feature flags here as needed
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature];
}
