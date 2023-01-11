// shared db
export interface KeyInfo {
  signature: string;
  plan: string;
  config: {
    allowed_origins: string[];
    allowed_targets: string[];
  };
  active: boolean;
  expires_at: number;
  synced_at: number;
}
