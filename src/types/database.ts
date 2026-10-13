export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "member" | "super_admin";
export type UserStatus = "active" | "suspended";
export type LinkStatus = "active" | "expired" | "blocked";
export type DeviceType = "mobile" | "desktop" | "tablet" | "other";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          email_weekly_digest: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          email_weekly_digest?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          email_weekly_digest?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      links: {
        Row: {
          id: string;
          user_id: string | null;
          original_url: string;
          slug: string;
          title: string | null;
          description: string | null;
          tags: string[];
          status: LinkStatus;
          is_custom_slug: boolean;
          click_count: number;
          unique_click_count: number;
          password_hash: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          original_url: string;
          slug: string;
          title?: string | null;
          description?: string | null;
          tags?: string[];
          status?: LinkStatus;
          is_custom_slug?: boolean;
          click_count?: number;
          unique_click_count?: number;
          password_hash?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          original_url?: string;
          slug?: string;
          title?: string | null;
          description?: string | null;
          tags?: string[];
          status?: LinkStatus;
          is_custom_slug?: boolean;
          click_count?: number;
          unique_click_count?: number;
          password_hash?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          ip_hash: string;
          country: string | null;
          city: string | null;
          referrer: string | null;
          device: DeviceType | null;
          browser: string | null;
          os: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          ip_hash: string;
          country?: string | null;
          city?: string | null;
          referrer?: string | null;
          device?: DeviceType | null;
          browser?: string | null;
          os?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string;
          ip_hash?: string;
          country?: string | null;
          city?: string | null;
          referrer?: string | null;
          device?: DeviceType | null;
          browser?: string | null;
          os?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clicks_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          }
        ];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          last_used_at: string | null;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          key_prefix: string;
          key_hash: string;
          last_used_at?: string | null;
          revoked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          key_prefix?: string;
          key_hash?: string;
          last_used_at?: string | null;
          revoked_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reserved_words: {
        Row: {
          id: number;
          word: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          word: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          word?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      blocked_domains: {
        Row: {
          id: number;
          domain: string;
          reason: string | null;
          added_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          domain: string;
          reason?: string | null;
          added_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          domain?: string;
          reason?: string | null;
          added_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_domains_added_by_fkey";
            columns: ["added_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      link_status: LinkStatus;
      device_type: DeviceType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenient row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Link = Database["public"]["Tables"]["links"]["Row"];
export type Click = Database["public"]["Tables"]["clicks"]["Row"];
export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];
export type ReservedWord = Database["public"]["Tables"]["reserved_words"]["Row"];
export type BlockedDomain = Database["public"]["Tables"]["blocked_domains"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
