// shared db
export interface KeyInfo {
  signature: string;
  last_synced: number;
  plan: string;
  allowed_origins: string[];
  allowed_targets: string[];
  active: boolean;
}
