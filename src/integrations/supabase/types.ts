export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      deals: {
        Row: {
          booking_url: string | null
          category: string
          city: string
          created_at: string
          description: string
          discounted_price: number
          expiration_date: string | null
          featured: boolean | null
          id: number
          image_url: string
          is_active: boolean
          is_free: boolean | null
          original_price: number
          quantity_left: number
          requires_discount_code: boolean | null
          salon_id: number | null
          status: string
          stripe_price_id: string | null
          time_remaining: string
          title: string
          updated_at: string
        }
        Insert: {
          booking_url?: string | null
          category: string
          city: string
          created_at?: string
          description: string
          discounted_price: number
          expiration_date?: string | null
          featured?: boolean | null
          id?: never
          image_url: string
          is_active?: boolean
          is_free?: boolean | null
          original_price: number
          quantity_left?: number
          requires_discount_code?: boolean | null
          salon_id?: number | null
          status?: string
          stripe_price_id?: string | null
          time_remaining: string
          title: string
          updated_at?: string
        }
        Update: {
          booking_url?: string | null
          category?: string
          city?: string
          created_at?: string
          description?: string
          discounted_price?: number
          expiration_date?: string | null
          featured?: boolean | null
          id?: never
          image_url?: string
          is_active?: boolean
          is_free?: boolean | null
          original_price?: number
          quantity_left?: number
          requires_discount_code?: boolean | null
          salon_id?: number | null
          status?: string
          stripe_price_id?: string | null
          time_remaining?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          deal_id: number | null
          id: number
          is_used: boolean | null
          purchase_id: number | null
          updated_at: string | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          deal_id?: number | null
          id?: number
          is_used?: boolean | null
          purchase_id?: number | null
          updated_at?: string | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          deal_id?: number | null
          id?: number
          is_used?: boolean | null
          purchase_id?: number | null
          updated_at?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_statistics"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "discount_codes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_codes_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: string[] | null
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          name?: string
        }
        Relationships: []
      }
      partner_requests: {
        Row: {
          address: string | null
          business_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          plan_deal_count: number | null
          plan_payment_type: string | null
          plan_price: number | null
          plan_title: string | null
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          plan_deal_count?: number | null
          plan_payment_type?: string | null
          plan_price?: number | null
          plan_title?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          plan_deal_count?: number | null
          plan_payment_type?: string | null
          plan_price?: number | null
          plan_title?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          customer_email: string
          deal_id: number | null
          discount_code: string
          id: number
          status: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          deal_id?: number | null
          discount_code: string
          id?: number
          status?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          deal_id?: number | null
          discount_code?: string
          id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_statistics"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "purchases_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          deal_id: number | null
          id: number
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          deal_id?: number | null
          id?: never
          rating: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          deal_id?: number | null
          id?: never
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_statistics"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "reviews_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_ratings: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string
          id: number
          rating: number
          salon_id: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by: string
          id?: number
          rating: number
          salon_id?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string
          id?: number
          rating?: number
          salon_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_ratings_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_user_status: {
        Row: {
          created_at: string
          first_login: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          first_login?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          first_login?: boolean
          user_id?: string
        }
        Relationships: []
      }
      salons: {
        Row: {
          address: string | null
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: number
          name: string
          phone: string | null
          privacy_accepted: boolean | null
          rating: number | null
          rating_comment: string | null
          role: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_plan: string | null
          subscription_type: string | null
          terms_accepted: boolean | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: number
          name: string
          phone?: string | null
          privacy_accepted?: boolean | null
          rating?: number | null
          rating_comment?: string | null
          role?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_type?: string | null
          terms_accepted?: boolean | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: number
          name?: string
          phone?: string | null
          privacy_accepted?: boolean | null
          rating?: number | null
          rating_comment?: string | null
          role?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_type?: string | null
          terms_accepted?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      deal_statistics: {
        Row: {
          customer_signups: number | null
          deal_id: number | null
          deal_title: string | null
          salon_id: number | null
          salon_name: string | null
          total_codes: number | null
          used_codes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_newsletter_subscriber: {
        Args: {
          p_email: string
          p_name: string
          p_interests?: string[]
        }
        Returns: boolean
      }
      create_test_salon: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      deactivate_expired_deals: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrease_quantity: {
        Args: {
          price_id: string
        }
        Returns: undefined
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          row_count: number
        }[]
      }
      is_admin_or_salon_owner: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_deal_to_free: {
        Args: {
          deal_id: number
          deal_status?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "salon"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
