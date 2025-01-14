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
          category: string
          city: string
          created_at: string
          description: string
          discounted_price: number
          featured: boolean | null
          id: number
          image_url: string
          original_price: number
          quantity_left: number
          salon_id: number | null
          status: string
          stripe_price_id: string | null
          time_remaining: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          city: string
          created_at?: string
          description: string
          discounted_price: number
          featured?: boolean | null
          id?: never
          image_url: string
          original_price: number
          quantity_left?: number
          salon_id?: number | null
          status?: string
          stripe_price_id?: string | null
          time_remaining: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          description?: string
          discounted_price?: number
          featured?: boolean | null
          id?: never
          image_url?: string
          original_price?: number
          quantity_left?: number
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
          deal_id: number | null
          id: number
          is_used: boolean | null
          purchase_id: number | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          deal_id?: number | null
          id?: number
          is_used?: boolean | null
          purchase_id?: number | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          deal_id?: number | null
          id?: number
          is_used?: boolean | null
          purchase_id?: number | null
          used_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: number
          name: string
          phone: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: number
          name: string
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_test_salon: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      decrease_quantity: {
        Args: {
          price_id: string
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
