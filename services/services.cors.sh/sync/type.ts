// shared db
export interface KeyInfo {
  key: string;
  plan: string;
  config: {
    allowed_origins: string[];
    allowed_targets: string[];
  };
  active: boolean;
  billing_group: string;
  expires_at: number;
  synced_at: number;
}
