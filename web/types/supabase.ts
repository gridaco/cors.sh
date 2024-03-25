export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          allowed_origins: string[] | null;
          allowed_targets: string[] | null;
          archived_at: string | null;
          created_at: string;
          expires_at: string | null;
          id: number;
          name: string;
          owner_id: number;
          signature_live: string;
          signature_test: string;
        };
        Insert: {
          allowed_origins?: string[] | null;
          allowed_targets?: string[] | null;
          archived_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: number;
          name?: string | null;
          owner_id: number;
          signature_live?: string | null;
          signature_test?: string | null;
        };
        Update: {
          allowed_origins?: string[] | null;
          allowed_targets?: string[] | null;
          archived_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: number;
          name?: string | null;
          owner_id?: number;
          signature_live?: string | null;
          signature_test?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      applications_onboarding: {
        Row: {
          allowed_origins: string[] | null;
          created_at: string | null;
          email: string | null;
          email_sent_at: string[] | null;
          expires_at: string;
          id: number;
          key: string | null;
          name: string | null;
          price_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_origins?: string[] | null;
          created_at?: string | null;
          email?: string | null;
          email_sent_at?: string[] | null;
          expires_at: string;
          id?: number;
          key?: string | null;
          name?: string | null;
          price_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_origins?: string[] | null;
          created_at?: string | null;
          email?: string | null;
          email_sent_at?: string[] | null;
          expires_at?: string;
          id?: number;
          key?: string | null;
          name?: string | null;
          price_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          created_at: string | null;
          email: string | null;
          email_verified: boolean | null;
          id: number;
          stripe_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          email_verified?: boolean | null;
          id?: number;
          stripe_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          email_verified?: boolean | null;
          id?: number;
          stripe_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
