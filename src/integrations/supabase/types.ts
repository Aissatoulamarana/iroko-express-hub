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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
        }
        Relationships: []
      }
      shipment_events: {
        Row: {
          description: string | null
          id: string
          location: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
          timestamp: string
        }
        Insert: {
          description?: string | null
          id?: string
          location?: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
          timestamp?: string
        }
        Update: {
          description?: string | null
          id?: string
          location?: string | null
          shipment_id?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          cargo_type: string | null
          client_email: string | null
          client_name: string
          created_at: string
          destination: string
          estimated_delivery: string | null
          id: string
          notes: string | null
          origin: string
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          cargo_type?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          destination: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          origin: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          cargo_type?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          destination?: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          origin?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      shipments_public: {
        Row: {
          cargo_type: string | null
          client_name: string | null
          created_at: string | null
          destination: string | null
          estimated_delivery: string | null
          id: string | null
          origin: string | null
          status: Database["public"]["Enums"]["shipment_status"] | null
          tracking_number: string | null
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          cargo_type?: string | null
          client_name?: string | null
          created_at?: string | null
          destination?: string | null
          estimated_delivery?: string | null
          id?: string | null
          origin?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          cargo_type?: string | null
          client_name?: string | null
          created_at?: string | null
          destination?: string | null
          estimated_delivery?: string | null
          id?: string | null
          origin?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      shipment_status:
        | "created"
        | "in_transit"
        | "customs"
        | "delivered"
        | "blocked"
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
      shipment_status: [
        "created",
        "in_transit",
        "customs",
        "delivered",
        "blocked",
      ],
    },
  },
} as const
