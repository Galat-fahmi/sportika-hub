export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          admin_notes: string | null
          cancelled_at: string | null
          created_at: string
          data_export_expires_at: string | null
          data_export_url: string | null
          deleted_at: string | null
          export_data_before_deletion: boolean | null
          feedback: string | null
          id: string
          keep_anonymized_stats: boolean | null
          reason: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          scheduled_deletion_date: string | null
          status: Database["public"]["Enums"]["account_deletion_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          cancelled_at?: string | null
          created_at?: string
          data_export_expires_at?: string | null
          data_export_url?: string | null
          deleted_at?: string | null
          export_data_before_deletion?: boolean | null
          feedback?: string | null
          id?: string
          keep_anonymized_stats?: boolean | null
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_deletion_date?: string | null
          status?: Database["public"]["Enums"]["account_deletion_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          cancelled_at?: string | null
          created_at?: string
          data_export_expires_at?: string | null
          data_export_url?: string | null
          deleted_at?: string | null
          export_data_before_deletion?: boolean | null
          feedback?: string | null
          id?: string
          keep_anonymized_stats?: boolean | null
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_deletion_date?: string | null
          status?: Database["public"]["Enums"]["account_deletion_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      achievement_definitions: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          badge_url: string | null
          category: string | null
          code: string
          color_hex: string | null
          created_at: string
          description: string
          display_order: number | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          name: string
          points_value: number | null
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          requirement_conditions: Json | null
          requirement_type: string | null
          requirement_value: number | null
          sport: string | null
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          badge_url?: string | null
          category?: string | null
          code: string
          color_hex?: string | null
          created_at?: string
          description: string
          display_order?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          name: string
          points_value?: number | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          requirement_conditions?: Json | null
          requirement_type?: string | null
          requirement_value?: number | null
          sport?: string | null
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          badge_url?: string | null
          category?: string | null
          code?: string
          color_hex?: string | null
          created_at?: string
          description?: string
          display_order?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          name?: string
          points_value?: number | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          requirement_conditions?: Json | null
          requirement_type?: string | null
          requirement_value?: number | null
          sport?: string | null
        }
        Relationships: []
      }
      achievement_timeline: {
        Row: {
          achievement_id: string | null
          athlete_id: string
          certificate_id: string | null
          created_at: string
          description: string | null
          entry_type: string
          event_id: string | null
          icon_url: string | null
          id: string
          is_milestone: boolean | null
          is_public: boolean | null
          occurred_at: string
          share_url: string | null
          title: string
        }
        Insert: {
          achievement_id?: string | null
          athlete_id: string
          certificate_id?: string | null
          created_at?: string
          description?: string | null
          entry_type: string
          event_id?: string | null
          icon_url?: string | null
          id?: string
          is_milestone?: boolean | null
          is_public?: boolean | null
          occurred_at: string
          share_url?: string | null
          title: string
        }
        Update: {
          achievement_id?: string | null
          athlete_id?: string
          certificate_id?: string | null
          created_at?: string
          description?: string | null
          entry_type?: string
          event_id?: string | null
          icon_url?: string | null
          id?: string
          is_milestone?: boolean | null
          is_public?: boolean | null
          occurred_at?: string
          share_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_timeline_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "athlete_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_timeline_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "athlete_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_timeline_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_achievements: {
        Row: {
          achievement_id: string
          athlete_id: string
          custom_data: Json | null
          earned_at: string
          earned_from_event_id: string | null
          earned_from_event_name: string | null
          id: string
          is_completed: boolean | null
          is_showcased: boolean | null
          notes: string | null
          progress_target: number | null
          progress_value: number | null
          share_count: number | null
        }
        Insert: {
          achievement_id: string
          athlete_id: string
          custom_data?: Json | null
          earned_at?: string
          earned_from_event_id?: string | null
          earned_from_event_name?: string | null
          id?: string
          is_completed?: boolean | null
          is_showcased?: boolean | null
          notes?: string | null
          progress_target?: number | null
          progress_value?: number | null
          share_count?: number | null
        }
        Update: {
          achievement_id?: string
          athlete_id?: string
          custom_data?: Json | null
          earned_at?: string
          earned_from_event_id?: string | null
          earned_from_event_name?: string | null
          id?: string
          is_completed?: boolean | null
          is_showcased?: boolean | null
          notes?: string | null
          progress_target?: number | null
          progress_value?: number | null
          share_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_achievements_earned_from_event_id_fkey"
            columns: ["earned_from_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_certificates: {
        Row: {
          athlete_id: string
          category: string | null
          certificate_number: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string
          custom_data: Json | null
          description: string | null
          event_date: string | null
          event_id: string | null
          event_name: string | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          issue_date: string
          issued_by: string | null
          issued_by_user_id: string | null
          pdf_generated_at: string | null
          pdf_url: string | null
          position: number | null
          share_count: number | null
          sport: string | null
          template_id: string | null
          title: string
          updated_at: string
          verification_code: string | null
        }
        Insert: {
          athlete_id: string
          category?: string | null
          certificate_number?: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          issue_date?: string
          issued_by?: string | null
          issued_by_user_id?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          position?: number | null
          share_count?: number | null
          sport?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
          verification_code?: string | null
        }
        Update: {
          athlete_id?: string
          category?: string | null
          certificate_number?: string | null
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          issue_date?: string
          issued_by?: string | null
          issued_by_user_id?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          position?: number | null
          share_count?: number | null
          sport?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_performance_history: {
        Row: {
          athlete_id: string
          category: string | null
          created_at: string
          event_date: string
          event_id: string | null
          event_name: string | null
          id: string
          is_personal_best: boolean | null
          is_podium: boolean | null
          is_win: boolean | null
          notes: string | null
          percentile: number | null
          points_earned: number | null
          position: number | null
          score: number | null
          sport: string
          total_participants: number | null
        }
        Insert: {
          athlete_id: string
          category?: string | null
          created_at?: string
          event_date: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_personal_best?: boolean | null
          is_podium?: boolean | null
          is_win?: boolean | null
          notes?: string | null
          percentile?: number | null
          points_earned?: number | null
          position?: number | null
          score?: number | null
          sport: string
          total_participants?: number | null
        }
        Update: {
          athlete_id?: string
          category?: string | null
          created_at?: string
          event_date?: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_personal_best?: boolean | null
          is_podium?: boolean | null
          is_win?: boolean | null
          notes?: string | null
          percentile?: number | null
          points_earned?: number | null
          position?: number | null
          score?: number | null
          sport?: string
          total_participants?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_performance_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_personal_bests: {
        Row: {
          athlete_id: string
          category: string | null
          created_at: string
          event_date: string | null
          event_id: string | null
          event_location: string | null
          event_name: string | null
          id: string
          improvement: number | null
          is_verified: boolean | null
          metric_type: string
          notes: string | null
          photo_url: string | null
          previous_best: number | null
          rank_at_time: number | null
          record_unit: string
          record_value: number
          sport: string
          verified_at: string | null
          verified_by: string | null
          video_url: string | null
        }
        Insert: {
          athlete_id: string
          category?: string | null
          created_at?: string
          event_date?: string | null
          event_id?: string | null
          event_location?: string | null
          event_name?: string | null
          id?: string
          improvement?: number | null
          is_verified?: boolean | null
          metric_type: string
          notes?: string | null
          photo_url?: string | null
          previous_best?: number | null
          rank_at_time?: number | null
          record_unit: string
          record_value: number
          sport: string
          verified_at?: string | null
          verified_by?: string | null
          video_url?: string | null
        }
        Update: {
          athlete_id?: string
          category?: string | null
          created_at?: string
          event_date?: string | null
          event_id?: string | null
          event_location?: string | null
          event_name?: string | null
          id?: string
          improvement?: number | null
          is_verified?: boolean | null
          metric_type?: string
          notes?: string | null
          photo_url?: string | null
          previous_best?: number | null
          rank_at_time?: number | null
          record_unit?: string
          record_value?: number
          sport?: string
          verified_at?: string | null
          verified_by?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_personal_bests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_portfolios: {
        Row: {
          allow_comments: boolean | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          custom_css: string | null
          email: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          last_updated_at: string | null
          phone: string | null
          profile_image_url: string | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          shares_count: number | null
          show_contact_form: boolean | null
          slug: string | null
          social_links: Json | null
          specialties: string[] | null
          sports: string[] | null
          tagline: string | null
          theme_color: string | null
          title: string | null
          user_id: string
          views_count: number | null
          visibility: Database["public"]["Enums"]["portfolio_visibility"] | null
          website: string | null
        }
        Insert: {
          allow_comments?: boolean | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          custom_css?: string | null
          email?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          last_updated_at?: string | null
          phone?: string | null
          profile_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares_count?: number | null
          show_contact_form?: boolean | null
          slug?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          sports?: string[] | null
          tagline?: string | null
          theme_color?: string | null
          title?: string | null
          user_id: string
          views_count?: number | null
          visibility?:
            | Database["public"]["Enums"]["portfolio_visibility"]
            | null
          website?: string | null
        }
        Update: {
          allow_comments?: boolean | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          custom_css?: string | null
          email?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          last_updated_at?: string | null
          phone?: string | null
          profile_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares_count?: number | null
          show_contact_form?: boolean | null
          slug?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          sports?: string[] | null
          tagline?: string | null
          theme_color?: string | null
          title?: string | null
          user_id?: string
          views_count?: number | null
          visibility?:
            | Database["public"]["Enums"]["portfolio_visibility"]
            | null
          website?: string | null
        }
        Relationships: []
      }
      athlete_rankings: {
        Row: {
          athlete_id: string
          category: string | null
          country: string | null
          created_at: string
          current_rank: number
          id: string
          percentile: number | null
          period_end: string | null
          period_start: string | null
          points: number | null
          previous_rank: number | null
          rank_change: number | null
          ranking_type: string
          region: string | null
          season_year: number | null
          sport: string
          total_athletes: number | null
          updated_at: string
        }
        Insert: {
          athlete_id: string
          category?: string | null
          country?: string | null
          created_at?: string
          current_rank: number
          id?: string
          percentile?: number | null
          period_end?: string | null
          period_start?: string | null
          points?: number | null
          previous_rank?: number | null
          rank_change?: number | null
          ranking_type: string
          region?: string | null
          season_year?: number | null
          sport: string
          total_athletes?: number | null
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          category?: string | null
          country?: string | null
          created_at?: string
          current_rank?: number
          id?: string
          percentile?: number | null
          period_end?: string | null
          period_start?: string | null
          points?: number | null
          previous_rank?: number | null
          rank_change?: number | null
          ranking_type?: string
          region?: string | null
          season_year?: number | null
          sport?: string
          total_athletes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      athlete_settings: {
        Row: {
          allow_messages_from: string | null
          allow_pdf_download: boolean | null
          athlete_id: string
          created_at: string
          date_format: string | null
          email_notifications: boolean | null
          event_reminders: boolean | null
          id: string
          language: string | null
          login_alerts: boolean | null
          marketing_emails: boolean | null
          portfolio_is_public: boolean | null
          profile_visibility: string | null
          push_notifications: boolean | null
          result_announcements: boolean | null
          show_results_on_profile: boolean | null
          show_stats_on_profile: boolean | null
          sms_notifications: boolean | null
          timezone: string | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          updated_at: string
        }
        Insert: {
          allow_messages_from?: string | null
          allow_pdf_download?: boolean | null
          athlete_id: string
          created_at?: string
          date_format?: string | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          language?: string | null
          login_alerts?: boolean | null
          marketing_emails?: boolean | null
          portfolio_is_public?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          result_announcements?: boolean | null
          show_results_on_profile?: boolean | null
          show_stats_on_profile?: boolean | null
          sms_notifications?: boolean | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string
        }
        Update: {
          allow_messages_from?: string | null
          allow_pdf_download?: boolean | null
          athlete_id?: string
          created_at?: string
          date_format?: string | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          language?: string | null
          login_alerts?: boolean | null
          marketing_emails?: boolean | null
          portfolio_is_public?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          result_announcements?: boolean | null
          show_results_on_profile?: boolean | null
          show_stats_on_profile?: boolean | null
          sms_notifications?: boolean | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      athlete_stats: {
        Row: {
          athlete_id: string
          average_position: number | null
          average_score: number | null
          best_position: number | null
          best_score: number | null
          current_rank: number | null
          current_streak: number | null
          id: string
          longest_streak: number | null
          podium_finishes: number | null
          season_end_date: string | null
          season_start_date: string | null
          season_year: number | null
          sport: string | null
          top_10_finishes: number | null
          top_5_finishes: number | null
          total_events: number | null
          total_points: number | null
          total_wins: number | null
          updated_at: string
          win_rate: number | null
          worst_position: number | null
        }
        Insert: {
          athlete_id: string
          average_position?: number | null
          average_score?: number | null
          best_position?: number | null
          best_score?: number | null
          current_rank?: number | null
          current_streak?: number | null
          id?: string
          longest_streak?: number | null
          podium_finishes?: number | null
          season_end_date?: string | null
          season_start_date?: string | null
          season_year?: number | null
          sport?: string | null
          top_10_finishes?: number | null
          top_5_finishes?: number | null
          total_events?: number | null
          total_points?: number | null
          total_wins?: number | null
          updated_at?: string
          win_rate?: number | null
          worst_position?: number | null
        }
        Update: {
          athlete_id?: string
          average_position?: number | null
          average_score?: number | null
          best_position?: number | null
          best_score?: number | null
          current_rank?: number | null
          current_streak?: number | null
          id?: string
          longest_streak?: number | null
          podium_finishes?: number | null
          season_end_date?: string | null
          season_start_date?: string | null
          season_year?: number | null
          sport?: string | null
          top_10_finishes?: number | null
          top_5_finishes?: number | null
          total_events?: number | null
          total_points?: number | null
          total_wins?: number | null
          updated_at?: string
          win_rate?: number | null
          worst_position?: number | null
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sport: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sport?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sport?: string | null
        }
        Relationships: []
      }
      event_category_mappings: {
        Row: {
          category_id: string
          event_id: string
        }
        Insert: {
          category_id: string
          event_id: string
        }
        Update: {
          category_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_category_mappings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          athlete_id: string
          event_id: string
          id: string
<<<<<<< HEAD
          payment_amount: number | null
          payment_date: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          registered_at: string
          status: Database["public"]["Enums"]["registration_status"]
        }
        Insert: {
          athlete_id: string
          event_id: string
          id?: string
<<<<<<< HEAD
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"]
        }
        Update: {
          athlete_id?: string
          event_id?: string
          id?: string
<<<<<<< HEAD
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"]
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
          age_category: string | null
          banner_image_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          is_featured: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string
          prizes: string | null
          registration_close_date: string | null
          registration_fee: number | null
          registration_open_date: string | null
          requirements: string | null
          skill_level: string | null
          sport: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          age_category?: string | null
          banner_image_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          prizes?: string | null
          registration_close_date?: string | null
          registration_fee?: number | null
          registration_open_date?: string | null
          requirements?: string | null
          skill_level?: string | null
          sport: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          age_category?: string | null
          banner_image_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          prizes?: string | null
          registration_close_date?: string | null
          registration_fee?: number | null
          registration_open_date?: string | null
          requirements?: string | null
          skill_level?: string | null
          sport?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          athlete_id: string
          back_image_url: string | null
          created_at: string
          document_country: string | null
          document_number: string | null
          document_type: string
          extracted_data: Json | null
          front_image_url: string | null
          id: string
          selfie_image_url: string | null
          updated_at: string
          verification_notes: string | null
        }
        Insert: {
          athlete_id: string
          back_image_url?: string | null
          created_at?: string
          document_country?: string | null
          document_number?: string | null
          document_type: string
          extracted_data?: Json | null
          front_image_url?: string | null
          id?: string
          selfie_image_url?: string | null
          updated_at?: string
          verification_notes?: string | null
        }
        Update: {
          athlete_id?: string
          back_image_url?: string | null
          created_at?: string
          document_country?: string | null
          document_number?: string | null
          document_type?: string
          extracted_data?: Json | null
          front_image_url?: string | null
          id?: string
          selfie_image_url?: string | null
          updated_at?: string
          verification_notes?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          achievements_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          achievements_enabled: boolean | null
          created_at: string
          enabled_email: boolean | null
          enabled_in_app: boolean | null
          enabled_push: boolean | null
          enabled_sms: boolean | null
          event_reminders_advance_hours: number | null
          event_reminders_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          event_reminders_enabled: boolean | null
          id: string
          messages_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          messages_enabled: boolean | null
          platform_updates_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          platform_updates_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          quiet_hours_timezone: string | null
          registration_updates_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          registration_updates_enabled: boolean | null
          result_announcements_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          result_announcements_enabled: boolean | null
          sponsorship_offers_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          sponsorship_offers_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          achievements_enabled?: boolean | null
          created_at?: string
          enabled_email?: boolean | null
          enabled_in_app?: boolean | null
          enabled_push?: boolean | null
          enabled_sms?: boolean | null
          event_reminders_advance_hours?: number | null
          event_reminders_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          event_reminders_enabled?: boolean | null
          id?: string
          messages_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          messages_enabled?: boolean | null
          platform_updates_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          platform_updates_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          quiet_hours_timezone?: string | null
          registration_updates_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          registration_updates_enabled?: boolean | null
          result_announcements_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          result_announcements_enabled?: boolean | null
          sponsorship_offers_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          sponsorship_offers_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          achievements_enabled?: boolean | null
          created_at?: string
          enabled_email?: boolean | null
          enabled_in_app?: boolean | null
          enabled_push?: boolean | null
          enabled_sms?: boolean | null
          event_reminders_advance_hours?: number | null
          event_reminders_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          event_reminders_enabled?: boolean | null
          id?: string
          messages_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          messages_enabled?: boolean | null
          platform_updates_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          platform_updates_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          quiet_hours_timezone?: string | null
          registration_updates_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          registration_updates_enabled?: boolean | null
          result_announcements_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          result_announcements_enabled?: boolean | null
          sponsorship_offers_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          sponsorship_offers_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string
          delivered_at: string | null
          expires_at: string | null
          icon_url: string | null
          id: string
          image_url: string | null
          is_delivered: boolean | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority: Database["public"]["Enums"]["notification_priority"] | null
          read_at: string | null
          related_achievement_id: string | null
          related_certificate_id: string | null
          related_event_id: string | null
          related_registration_id: string | null
          scheduled_for: string | null
          sender_id: string | null
          sent_via: Database["public"]["Enums"]["notification_channel"][] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          delivered_at?: string | null
          expires_at?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_delivered?: boolean | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          related_achievement_id?: string | null
          related_certificate_id?: string | null
          related_event_id?: string | null
          related_registration_id?: string | null
          scheduled_for?: string | null
          sender_id?: string | null
          sent_via?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          delivered_at?: string | null
          expires_at?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_delivered?: boolean | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          related_achievement_id?: string | null
          related_certificate_id?: string | null
          related_event_id?: string | null
          related_registration_id?: string | null
          scheduled_for?: string | null
          sender_id?: string | null
          sent_via?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_achievement_id_fkey"
            columns: ["related_achievement_id"]
            isOneToOne: false
            referencedRelation: "athlete_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_certificate_id_fkey"
            columns: ["related_certificate_id"]
            isOneToOne: false
            referencedRelation: "athlete_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_registration_id_fkey"
            columns: ["related_registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_media: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          file_size: number | null
          id: string
          is_featured: boolean | null
          media_type: string
          mime_type: string | null
          portfolio_id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          uploaded_at: string | null
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          media_type: string
          mime_type?: string | null
          portfolio_id: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          uploaded_at?: string | null
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          media_type?: string
          mime_type?: string | null
          portfolio_id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "athlete_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_sections: {
        Row: {
          content: string | null
          created_at: string | null
          custom_data: Json | null
          display_order: number
          id: string
          is_visible: boolean | null
          media_urls: string[] | null
          portfolio_id: string
          section_type: Database["public"]["Enums"]["portfolio_section_type"]
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          custom_data?: Json | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          media_urls?: string[] | null
          portfolio_id: string
          section_type: Database["public"]["Enums"]["portfolio_section_type"]
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          custom_data?: Json | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          media_urls?: string[] | null
          portfolio_id?: string
          section_type?: Database["public"]["Enums"]["portfolio_section_type"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_sections_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "athlete_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_testimonials: {
        Row: {
          author_company: string | null
          author_image_url: string | null
          author_name: string
          author_title: string | null
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          portfolio_id: string
          rating: number | null
        }
        Insert: {
          author_company?: string | null
          author_image_url?: string | null
          author_name: string
          author_title?: string | null
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          portfolio_id: string
          rating?: number | null
        }
        Update: {
          author_company?: string | null
          author_image_url?: string | null
          author_name?: string
          author_title?: string | null
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          portfolio_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_testimonials_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "athlete_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_views: {
        Row: {
          city: string | null
          country: string | null
          id: string
          ip_address: unknown
          pages_viewed: number | null
          portfolio_id: string
          referrer_source: string | null
          referrer_url: string | null
          session_id: string | null
          time_spent_seconds: number | null
          user_agent: string | null
          viewed_at: string | null
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown
          pages_viewed?: number | null
          portfolio_id: string
          referrer_source?: string | null
          referrer_url?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_agent?: string | null
          viewed_at?: string | null
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown
          pages_viewed?: number | null
          portfolio_id?: string
          referrer_source?: string | null
          referrer_url?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_agent?: string | null
          viewed_at?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_views_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "athlete_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
<<<<<<< HEAD
          bio: string | null
          city: string | null
          country: string | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
<<<<<<< HEAD
          kyc_rejection_reason: string | null
          kyc_reviewed_at: string | null
          kyc_reviewed_by: string | null
          kyc_submitted_at: string | null
          phone: string | null
          postal_code: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_website: string | null
          social_youtube: string | null
          sport: string | null
          state_province: string | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          weight_kg: number | null
=======
          updated_at: string
          user_id: string
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
        }
        Insert: {
          avatar_url?: string | null
<<<<<<< HEAD
          bio?: string | null
          city?: string | null
          country?: string | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
<<<<<<< HEAD
          kyc_rejection_reason?: string | null
          kyc_reviewed_at?: string | null
          kyc_reviewed_by?: string | null
          kyc_submitted_at?: string | null
          phone?: string | null
          postal_code?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_website?: string | null
          social_youtube?: string | null
          sport?: string | null
          state_province?: string | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          weight_kg?: number | null
=======
          updated_at?: string
          user_id: string
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
        }
        Update: {
          avatar_url?: string | null
<<<<<<< HEAD
          bio?: string | null
          city?: string | null
          country?: string | null
=======
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
<<<<<<< HEAD
          kyc_rejection_reason?: string | null
          kyc_reviewed_at?: string | null
          kyc_reviewed_by?: string | null
          kyc_submitted_at?: string | null
          phone?: string | null
          postal_code?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_website?: string | null
          social_youtube?: string | null
          sport?: string | null
          state_province?: string | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_description: string | null
          activity_type: string
          created_at: string
          device_info: Json | null
          id: string
          ip_address: string | null
          is_suspicious: boolean | null
          location_info: Json | null
          metadata: Json | null
          risk_score: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_suspicious?: boolean | null
          location_info?: Json | null
          metadata?: Json | null
          risk_score?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_suspicious?: boolean | null
          location_info?: Json | null
          metadata?: Json | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          allow_data_for_analytics: boolean | null
          allow_messages_from: string | null
          allow_sponsorship_offers: boolean | null
          allow_third_party_integration: boolean | null
          appear_in_leaderboards: boolean | null
          appear_in_search_results: boolean | null
          created_at: string
          id: string
          portfolio_is_public: boolean | null
          profile_visibility: string | null
          show_achievements: boolean | null
          show_age: boolean | null
          show_certificates: boolean | null
          show_email: boolean | null
          show_event_history: boolean | null
          show_full_name: boolean | null
          show_location: boolean | null
          show_online_status: boolean | null
          show_performance_stats: boolean | null
          show_phone: boolean | null
          show_rankings: boolean | null
          show_social_links: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_data_for_analytics?: boolean | null
          allow_messages_from?: string | null
          allow_sponsorship_offers?: boolean | null
          allow_third_party_integration?: boolean | null
          appear_in_leaderboards?: boolean | null
          appear_in_search_results?: boolean | null
          created_at?: string
          id?: string
          portfolio_is_public?: boolean | null
          profile_visibility?: string | null
          show_achievements?: boolean | null
          show_age?: boolean | null
          show_certificates?: boolean | null
          show_email?: boolean | null
          show_event_history?: boolean | null
          show_full_name?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          show_performance_stats?: boolean | null
          show_phone?: boolean | null
          show_rankings?: boolean | null
          show_social_links?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_data_for_analytics?: boolean | null
          allow_messages_from?: string | null
          allow_sponsorship_offers?: boolean | null
          allow_third_party_integration?: boolean | null
          appear_in_leaderboards?: boolean | null
          appear_in_search_results?: boolean | null
          created_at?: string
          id?: string
          portfolio_is_public?: boolean | null
          profile_visibility?: string | null
          show_achievements?: boolean | null
          show_age?: boolean | null
          show_certificates?: boolean | null
          show_email?: boolean | null
          show_event_history?: boolean | null
          show_full_name?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          show_performance_stats?: boolean | null
          show_phone?: boolean | null
          show_rankings?: boolean | null
          show_social_links?: boolean | null
          updated_at?: string
          user_id?: string
=======
          updated_at?: string
          user_id?: string
>>>>>>> d0ebc8c299c26bfd9a1e6b566960cdce6ee8a43d
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
      user_security_settings: {
        Row: {
          account_locked_until: string | null
          backup_codes: string[] | null
          created_at: string
          failed_login_attempts: number | null
          id: string
          last_failed_login_at: string | null
          last_login_at: string | null
          last_login_device: string | null
          last_login_ip: string | null
          login_alerts_enabled: boolean | null
          max_active_sessions: number | null
          password_expires_in_days: number | null
          password_last_changed_at: string | null
          require_password_change_on_next_login: boolean | null
          require_reauth_for_sensitive_actions: boolean | null
          session_timeout_minutes: number | null
          suspicious_activity_alerts: boolean | null
          trusted_devices: Json | null
          two_factor_enabled: boolean | null
          two_factor_enabled_at: string | null
          two_factor_method: string | null
          two_factor_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_locked_until?: string | null
          backup_codes?: string[] | null
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          last_failed_login_at?: string | null
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          login_alerts_enabled?: boolean | null
          max_active_sessions?: number | null
          password_expires_in_days?: number | null
          password_last_changed_at?: string | null
          require_password_change_on_next_login?: boolean | null
          require_reauth_for_sensitive_actions?: boolean | null
          session_timeout_minutes?: number | null
          suspicious_activity_alerts?: boolean | null
          trusted_devices?: Json | null
          two_factor_enabled?: boolean | null
          two_factor_enabled_at?: string | null
          two_factor_method?: string | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_locked_until?: string | null
          backup_codes?: string[] | null
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          last_failed_login_at?: string | null
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          login_alerts_enabled?: boolean | null
          max_active_sessions?: number | null
          password_expires_in_days?: number | null
          password_last_changed_at?: string | null
          require_password_change_on_next_login?: boolean | null
          require_reauth_for_sensitive_actions?: boolean | null
          session_timeout_minutes?: number | null
          suspicious_activity_alerts?: boolean | null
          trusted_devices?: Json | null
          two_factor_enabled?: boolean | null
          two_factor_enabled_at?: string | null
          two_factor_method?: string | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_performance_history: {
        Args: {
          _athlete_id: string
          _category?: string
          _event_date: string
          _event_id: string
          _event_name: string
          _notes?: string
          _points_earned?: number
          _position?: number
          _score?: number
          _sport: string
          _total_participants?: number
        }
        Returns: string
      }
      admin_review_kyc: {
        Args: {
          _athlete_id: string
          _rejection_reason?: string
          _status: string
        }
        Returns: boolean
      }
      award_achievement: {
        Args: {
          _achievement_code: string
          _athlete_id: string
          _custom_data?: Json
          _event_id?: string
          _event_name?: string
        }
        Returns: {
          achievement_id: string
          achievement_name: string
          is_new: boolean
        }[]
      }
      browse_events: {
        Args: {
          _age_category?: string
          _event_type?: string
          _is_featured?: boolean
          _limit?: number
          _location?: string
          _offset?: number
          _search_query?: string
          _skill_level?: string
          _sport?: string
          _start_date_from?: string
          _start_date_to?: string
        }
        Returns: {
          age_category: string
          banner_image_url: string
          description: string
          end_date: string
          event_id: string
          event_type: string
          is_featured: boolean
          is_registered: boolean
          location: string
          max_participants: number
          registered_count: number
          registration_close_date: string
          registration_fee: number
          registration_open_date: string
          skill_level: string
          sport: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }[]
      }
      calculate_athlete_rankings: {
        Args: { _season_year?: number; _sport: string }
        Returns: undefined
      }
      cancel_account_deletion: { Args: { _user_id: string }; Returns: boolean }
      cancel_registration: {
        Args: { _registration_id: string }
        Returns: boolean
      }
      change_password_with_logging: {
        Args: { _user_id: string }
        Returns: undefined
      }
      check_achievement_progress: {
        Args: { _athlete_id: string }
        Returns: undefined
      }
      delete_notification: {
        Args: { _notification_id: string }
        Returns: boolean
      }
      export_user_data: { Args: { _user_id: string }; Returns: Json }
      generate_certificate_number: { Args: never; Returns: string }
      get_achievement_timeline: {
        Args: { _athlete_id: string; _limit?: number; _offset?: number }
        Returns: {
          achievement_details: Json
          certificate_details: Json
          description: string
          entry_type: string
          icon_url: string
          is_milestone: boolean
          is_public: boolean
          occurred_at: string
          timeline_id: string
          title: string
        }[]
      }
      get_athlete_achievements: {
        Args: {
          _achievement_type?: string
          _athlete_id: string
          _rarity?: string
          _showcased_only?: boolean
        }
        Returns: {
          achievement_code: string
          achievement_name: string
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          athlete_achievement_id: string
          badge_url: string
          color_hex: string
          description: string
          earned_at: string
          earned_from_event_name: string
          icon_url: string
          is_showcased: boolean
          points_value: number
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          share_count: number
        }[]
      }
      get_athlete_certificates: {
        Args: {
          _athlete_id: string
          _certificate_type?: string
          _limit?: number
        }
        Returns: {
          category: string
          certificate_id: string
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          description: string
          event_date: string
          event_name: string
          is_public: boolean
          issue_date: string
          issued_by: string
          pdf_url: string
          position: number
          share_count: number
          sport: string
          title: string
          verification_code: string
        }[]
      }
      get_athlete_dashboard_overview: {
        Args: { _athlete_id: string }
        Returns: {
          avatar_url: string
          average_position: number
          current_rank: number
          full_name: string
          recent_results: Json
          sport: string
          total_events: number
          total_points: number
          total_wins: number
          upcoming_events: Json
          user_id: string
          win_rate: number
        }[]
      }
      get_athlete_performance_stats: {
        Args: { _athlete_id: string; _season_year?: number; _sport?: string }
        Returns: {
          average_position: number
          average_score: number
          best_position: number
          best_score: number
          current_streak: number
          longest_streak: number
          podium_finishes: number
          podium_ratio: number
          recent_form: Json
          top_10_finishes: number
          top_5_finishes: number
          total_events: number
          total_points: number
          total_wins: number
          win_ratio: number
          worst_position: number
        }[]
      }
      get_athlete_personal_bests: {
        Args: { _athlete_id: string; _sport?: string }
        Returns: {
          category: string
          event_date: string
          event_location: string
          event_name: string
          improvement: number
          is_verified: boolean
          metric_type: string
          personal_best_id: string
          photo_url: string
          previous_best: number
          record_unit: string
          record_value: number
          sport: string
          video_url: string
        }[]
      }
      get_athlete_profile: {
        Args: { _athlete_id: string }
        Returns: {
          age: number
          avatar_url: string
          bio: string
          city: string
          country: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          full_name: string
          gender: string
          height_cm: number
          kyc_rejection_reason: string
          kyc_reviewed_at: string
          kyc_submitted_at: string
          phone: string
          postal_code: string
          settings: Json
          social_facebook: string
          social_instagram: string
          social_linkedin: string
          social_tiktok: string
          social_twitter: string
          social_website: string
          social_youtube: string
          sport: string
          state_province: string
          user_id: string
          verification_status: string
          weight_kg: number
        }[]
      }
      get_athlete_rankings: {
        Args: { _athlete_id: string; _sport?: string }
        Returns: {
          category: string
          country: string
          current_rank: number
          percentile: number
          points: number
          previous_rank: number
          rank_change: number
          ranking_id: string
          ranking_type: string
          region: string
          season_year: number
          sport: string
          total_athletes: number
        }[]
      }
      get_athlete_recent_results: {
        Args: { _athlete_id: string; _limit?: number }
        Returns: {
          event_date: string
          event_id: string
          event_name: string
          notes: string
          position: number
          score: number
        }[]
      }
      get_athlete_upcoming_events: {
        Args: { _athlete_id: string; _limit?: number }
        Returns: {
          event_date: string
          event_id: string
          event_name: string
          location: string
          payment_status: string
          status: string
        }[]
      }
      get_certificates_achievements_summary: {
        Args: { _athlete_id: string }
        Returns: {
          rarity_counts: Json
          recent_certificates: Json
          showcased_achievements: Json
          total_achievements: number
          total_badges: number
          total_certificates: number
          total_medals: number
        }[]
      }
      get_deletion_request_status: {
        Args: { _user_id: string }
        Returns: {
          can_cancel: boolean
          days_remaining: number
          request_id: string
          scheduled_deletion_date: string
          status: Database["public"]["Enums"]["account_deletion_status"]
        }[]
      }
      get_event_details: {
        Args: { _event_id: string }
        Returns: {
          age_category: string
          banner_image_url: string
          contact_email: string
          contact_phone: string
          description: string
          end_date: string
          event_id: string
          event_type: string
          is_featured: boolean
          is_registered: boolean
          is_registration_open: boolean
          location: string
          max_participants: number
          organizer_id: string
          organizer_name: string
          prizes: string
          registered_count: number
          registration_close_date: string
          registration_fee: number
          registration_open_date: string
          requirements: string
          skill_level: string
          sport: string
          spots_remaining: number
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }[]
      }
      get_event_history: {
        Args: {
          _athlete_id: string
          _limit?: number
          _offset?: number
          _sport?: string
        }
        Returns: {
          event_banner_image_url: string
          event_end_date: string
          event_id: string
          event_location: string
          event_sport: string
          event_start_date: string
          event_title: string
          percentile: number
          performance_rating: string
          position: number
          registration_status: Database["public"]["Enums"]["registration_status"]
          result_id: string
          result_notes: string
          score: number
          total_participants: number
        }[]
      }
      get_my_registrations: {
        Args: {
          _athlete_id: string
          _limit?: number
          _offset?: number
          _payment_status?: string
          _registration_status?: string
          _status_filter?: string
        }
        Returns: {
          checked_in: boolean
          checked_in_at: string
          event_banner_image_url: string
          event_description: string
          event_end_date: string
          event_id: string
          event_location: string
          event_sport: string
          event_start_date: string
          event_title: string
          is_upcoming: boolean
          payment_amount: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          registered_at: string
          registration_id: string
          registration_status: Database["public"]["Enums"]["registration_status"]
        }[]
      }
      get_notification_stats: {
        Args: { _user_id: string }
        Returns: {
          by_type: Json
          today_count: number
          total_count: number
          unread_count: number
          urgent_count: number
        }[]
      }
      get_performance_dashboard: {
        Args: { _athlete_id: string; _sport?: string }
        Returns: {
          personal_bests: Json
          rankings: Json
          recent_trend: Json
          stats_overview: Json
        }[]
      }
      get_performance_trend: {
        Args: {
          _athlete_id: string
          _category?: string
          _metric?: string
          _sport?: string
          _time_range?: string
        }
        Returns: {
          event_date: string
          event_name: string
          is_personal_best: boolean
          points_earned: number
          position: number
          score: number
          trend_value: number
        }[]
      }
      get_portfolio_by_slug: {
        Args: { _slug: string }
        Returns: {
          bio: string
          cover_image_url: string
          email: string
          id: string
          is_verified: boolean
          phone: string
          profile_image_url: string
          published_at: string
          slug: string
          social_links: Json
          specialties: string[]
          sports: string[]
          tagline: string
          theme_color: string
          title: string
          user_id: string
          views_count: number
          visibility: Database["public"]["Enums"]["portfolio_visibility"]
          website: string
        }[]
      }
      get_portfolio_sections: {
        Args: { _portfolio_id: string }
        Returns: {
          content: string
          custom_data: Json
          display_order: number
          id: string
          is_visible: boolean
          media_urls: string[]
          section_type: Database["public"]["Enums"]["portfolio_section_type"]
          title: string
        }[]
      }
      get_registration_details: {
        Args: { _registration_id: string }
        Returns: {
          checked_in: boolean
          checked_in_at: string
          event_id: string
          event_location: string
          event_start_date: string
          event_title: string
          payment_amount: number
          payment_date: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          qr_code_data: string
          registered_at: string
          registration_id: string
          registration_status: Database["public"]["Enums"]["registration_status"]
        }[]
      }
      get_share_metadata: {
        Args: { _item_id: string; _item_type: string }
        Returns: {
          description: string
          image_url: string
          metadata: Json
          share_url: string
          title: string
        }[]
      }
      get_user_activity_log: {
        Args: {
          _activity_type?: string
          _limit?: number
          _offset?: number
          _user_id: string
        }
        Returns: {
          activity_description: string
          activity_type: string
          created_at: string
          device_info: Json
          ip_address: string
          is_suspicious: boolean
          log_id: string
          user_agent: string
        }[]
      }
      get_user_notifications: {
        Args: {
          _limit?: number
          _notification_type?: string
          _offset?: number
          _unread_only?: boolean
          _user_id: string
        }
        Returns: {
          action_label: string
          action_url: string
          created_at: string
          event_info: Json
          icon_url: string
          image_url: string
          is_read: boolean
          message: string
          metadata: Json
          notification_id: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string
          sender_info: Json
          title: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_settings: {
        Args: { _user_id: string }
        Returns: {
          notification_preferences: Json
          privacy_settings: Json
          security_settings: Json
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_event_view: { Args: { _event_id: string }; Returns: undefined }
      increment_portfolio_views: {
        Args: {
          _portfolio_id: string
          _referrer_url?: string
          _session_id?: string
          _visitor_id?: string
        }
        Returns: boolean
      }
      increment_share_count: {
        Args: { _item_id: string; _item_type: string }
        Returns: undefined
      }
      issue_certificate: {
        Args: {
          _athlete_id: string
          _category?: string
          _certificate_type: string
          _custom_data?: Json
          _description?: string
          _event_date?: string
          _event_id?: string
          _event_name?: string
          _issued_by?: string
          _position?: number
          _sport?: string
          _template_id?: string
          _title: string
        }
        Returns: string
      }
      log_user_activity: {
        Args: {
          _activity_description?: string
          _activity_type: string
          _device_info?: Json
          _ip_address?: string
          _is_suspicious?: boolean
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
      mark_all_notifications_read: {
        Args: { _user_id: string }
        Returns: number
      }
      mark_notification_read: {
        Args: { _is_read?: boolean; _notification_id: string }
        Returns: boolean
      }
      recalculate_athlete_stats: {
        Args: { _athlete_id: string }
        Returns: undefined
      }
      record_personal_best: {
        Args: {
          _athlete_id: string
          _category: string
          _event_date?: string
          _event_id?: string
          _event_location?: string
          _event_name?: string
          _metric_type: string
          _notes?: string
          _photo_url?: string
          _record_unit: string
          _record_value: number
          _sport: string
          _video_url?: string
        }
        Returns: {
          improvement: number
          is_new_record: boolean
          previous_value: number
        }[]
      }
      register_for_event: {
        Args: { _event_id: string; _payment_amount?: number }
        Returns: {
          message: string
          registration_id: string
          success: boolean
        }[]
      }
      request_account_deletion: {
        Args: {
          _export_data?: boolean
          _feedback?: string
          _keep_anonymized_stats?: boolean
          _reason?: string
          _user_id: string
        }
        Returns: {
          deletion_request_id: string
          grace_period_days: number
          scheduled_deletion_date: string
        }[]
      }
      schedule_event_reminders: { Args: never; Returns: undefined }
      send_bulk_notification: {
        Args: {
          _action_label?: string
          _action_url?: string
          _message: string
          _notification_type: string
          _priority?: string
          _title: string
          _user_ids: string[]
        }
        Returns: number
      }
      send_notification: {
        Args: {
          _action_label?: string
          _action_url?: string
          _expires_at?: string
          _icon_url?: string
          _image_url?: string
          _message: string
          _metadata?: Json
          _notification_type: string
          _priority?: string
          _related_achievement_id?: string
          _related_certificate_id?: string
          _related_event_id?: string
          _related_registration_id?: string
          _scheduled_for?: string
          _sender_id?: string
          _title: string
          _user_id: string
        }
        Returns: string
      }
      submit_kyc_verification: {
        Args: { _athlete_id: string; _documents: Json }
        Returns: boolean
      }
      update_athlete_portfolio: {
        Args: {
          _bio?: string
          _cover_image_url?: string
          _email?: string
          _phone?: string
          _profile_image_url?: string
          _slug?: string
          _social_links?: Json
          _specialties?: string[]
          _sports?: string[]
          _tagline?: string
          _theme_color?: string
          _title?: string
          _user_id: string
          _visibility?: Database["public"]["Enums"]["portfolio_visibility"]
          _website?: string
        }
        Returns: string
      }
      update_athlete_profile: {
        Args: {
          _age?: number
          _athlete_id: string
          _bio?: string
          _city?: string
          _country?: string
          _date_of_birth?: string
          _emergency_contact_name?: string
          _emergency_contact_phone?: string
          _full_name?: string
          _gender?: string
          _height_cm?: number
          _phone?: string
          _postal_code?: string
          _social_facebook?: string
          _social_instagram?: string
          _social_linkedin?: string
          _social_tiktok?: string
          _social_twitter?: string
          _social_website?: string
          _social_youtube?: string
          _sport?: string
          _state_province?: string
          _weight_kg?: number
        }
        Returns: boolean
      }
      update_athlete_settings: {
        Args: {
          _allow_messages_from?: string
          _allow_pdf_download?: boolean
          _athlete_id: string
          _date_format?: string
          _email_notifications?: boolean
          _event_reminders?: boolean
          _language?: string
          _login_alerts?: boolean
          _marketing_emails?: boolean
          _portfolio_is_public?: boolean
          _profile_visibility?: string
          _push_notifications?: boolean
          _result_announcements?: boolean
          _show_results_on_profile?: boolean
          _show_stats_on_profile?: boolean
          _sms_notifications?: boolean
          _timezone?: string
          _two_factor_enabled?: boolean
          _two_factor_method?: string
        }
        Returns: boolean
      }
      update_notification_preferences: {
        Args: {
          _achievements_channels?: Database["public"]["Enums"]["notification_channel"][]
          _achievements_enabled?: boolean
          _event_reminders_advance_hours?: number
          _event_reminders_channels?: Database["public"]["Enums"]["notification_channel"][]
          _event_reminders_enabled?: boolean
          _platform_updates_channels?: Database["public"]["Enums"]["notification_channel"][]
          _platform_updates_enabled?: boolean
          _quiet_hours_enabled?: boolean
          _quiet_hours_end?: string
          _quiet_hours_start?: string
          _registration_updates_channels?: Database["public"]["Enums"]["notification_channel"][]
          _registration_updates_enabled?: boolean
          _result_announcements_channels?: Database["public"]["Enums"]["notification_channel"][]
          _result_announcements_enabled?: boolean
          _sponsorship_offers_channels?: Database["public"]["Enums"]["notification_channel"][]
          _sponsorship_offers_enabled?: boolean
          _user_id: string
        }
        Returns: boolean
      }
      update_privacy_settings: {
        Args: {
          _allow_messages_from?: string
          _allow_sponsorship_offers?: boolean
          _appear_in_leaderboards?: boolean
          _appear_in_search_results?: boolean
          _portfolio_is_public?: boolean
          _profile_visibility?: string
          _show_achievements?: boolean
          _show_event_history?: boolean
          _show_performance_stats?: boolean
          _show_rankings?: boolean
          _user_id: string
        }
        Returns: boolean
      }
      update_profile_avatar: {
        Args: { _athlete_id: string; _avatar_url: string }
        Returns: boolean
      }
      update_security_settings: {
        Args: {
          _login_alerts_enabled?: boolean
          _max_active_sessions?: number
          _session_timeout_minutes?: number
          _suspicious_activity_alerts?: boolean
          _two_factor_enabled?: boolean
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_deletion_status:
        | "active"
        | "requested"
        | "scheduled"
        | "deleted"
        | "cancelled"
      achievement_rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
      achievement_type:
        | "medal"
        | "badge"
        | "trophy"
        | "milestone"
        | "streak"
        | "record"
      app_role: "athlete" | "organizer" | "admin"
      certificate_type:
        | "participation"
        | "winner"
        | "runner_up"
        | "podium"
        | "completion"
        | "record_breaker"
        | "milestone"
        | "special_achievement"
      event_status:
        | "draft"
        | "published"
        | "ongoing"
        | "completed"
        | "cancelled"
      notification_channel: "in_app" | "email" | "push" | "sms"
      notification_priority: "low" | "medium" | "high" | "urgent"
      notification_type:
        | "event_reminder"
        | "registration_approved"
        | "registration_rejected"
        | "registration_waitlisted"
        | "payment_confirmed"
        | "payment_failed"
        | "result_announced"
        | "certificate_issued"
        | "achievement_earned"
        | "event_cancelled"
        | "event_updated"
        | "platform_update"
        | "sponsorship_offer"
        | "message"
        | "system_alert"
      payment_status: "pending" | "completed" | "failed" | "refunded" | "waived"
      portfolio_section_type:
        | "about"
        | "achievements"
        | "results"
        | "media"
        | "stats"
        | "sponsors"
        | "testimonials"
        | "custom"
      portfolio_visibility: "public" | "unlisted" | "private"
      registration_status:
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled"
        | "waitlisted"
      verification_status:
        | "unverified"
        | "pending"
        | "in_review"
        | "verified"
        | "rejected"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_deletion_status: [
        "active",
        "requested",
        "scheduled",
        "deleted",
        "cancelled",
      ],
      achievement_rarity: ["common", "uncommon", "rare", "epic", "legendary"],
      achievement_type: [
        "medal",
        "badge",
        "trophy",
        "milestone",
        "streak",
        "record",
      ],
      app_role: ["athlete", "organizer", "admin"],
      certificate_type: [
        "participation",
        "winner",
        "runner_up",
        "podium",
        "completion",
        "record_breaker",
        "milestone",
        "special_achievement",
      ],
      event_status: ["draft", "published", "ongoing", "completed", "cancelled"],
      notification_channel: ["in_app", "email", "push", "sms"],
      notification_priority: ["low", "medium", "high", "urgent"],
      notification_type: [
        "event_reminder",
        "registration_approved",
        "registration_rejected",
        "registration_waitlisted",
        "payment_confirmed",
        "payment_failed",
        "result_announced",
        "certificate_issued",
        "achievement_earned",
        "event_cancelled",
        "event_updated",
        "platform_update",
        "sponsorship_offer",
        "message",
        "system_alert",
      ],
      payment_status: ["pending", "completed", "failed", "refunded", "waived"],
      portfolio_section_type: [
        "about",
        "achievements",
        "results",
        "media",
        "stats",
        "sponsors",
        "testimonials",
        "custom",
      ],
      portfolio_visibility: ["public", "unlisted", "private"],
      registration_status: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "waitlisted",
      ],
      verification_status: [
        "unverified",
        "pending",
        "in_review",
        "verified",
        "rejected",
      ],
    },
  },
} as const

