export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      event_registrations: {
        Row: {
          athlete_id: string
          checked_in: boolean | null
          checked_in_at: string | null
          event_id: string
          id: string
          payment_amount: number | null
          payment_date: string | null
          payment_status: string | null
          registered_at: string
          status: string
        }
        Insert: {
          athlete_id: string
          checked_in?: boolean | null
          checked_in_at?: string | null
          event_id: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          registered_at?: string
          status?: string
        }
        Update: {
          athlete_id?: string
          checked_in?: boolean | null
          checked_in_at?: string | null
          event_id?: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          registered_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_results: {
        Row: {
          athlete_id: string
          created_at: string
          event_id: string
          id: string
          notes: string | null
          position: number | null
          score: number | null
        }
        Insert: {
          athlete_id: string
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          position?: number | null
          score?: number | null
        }
        Update: {
          athlete_id?: string
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          position?: number | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          max_participants: number | null
          organizer_id: string
          registration_fee: number | null
          sport: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          registration_fee?: number | null
          sport: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          registration_fee?: number | null
          sport?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_website: string | null
          sport: string | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          sport?: string | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          sport?: string | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "athlete" | "organizer" | "admin"
      event_status:
        | "draft"
        | "published"
        | "ongoing"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["athlete", "organizer", "admin"],
      event_status: ["draft", "published", "ongoing", "completed", "cancelled"],
    },
  },
} as const
