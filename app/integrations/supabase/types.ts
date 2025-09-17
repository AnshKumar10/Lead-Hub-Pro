export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      buyer_history: {
        Row: {
          buyer_id: string;
          created_at: string;
          field_name: string;
          id: string;
          new_value: string | null;
          old_value: string | null;
          user_id: string;
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          field_name: string;
          id?: string;
          new_value?: string | null;
          old_value?: string | null;
          user_id: string;
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          field_name?: string;
          id?: string;
          new_value?: string | null;
          old_value?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "buyer_history_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "buyers";
            referencedColumns: ["id"];
          }
        ];
      };
      buyers: {
        Row: {
          bhk: number | null;
          budget_max: number | null;
          budget_min: number | null;
          city: string;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          notes: string | null;
          phone: string;
          property_type: Database["public"]["Enums"]["property_type"];
          purpose: Database["public"]["Enums"]["buyer_purpose"];
          source: Database["public"]["Enums"]["lead_source"];
          status: Database["public"]["Enums"]["buyer_status"];
          tags: string[] | null;
          timeline: Database["public"]["Enums"]["timeline"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bhk?: number | null;
          budget_max?: number | null;
          budget_min?: number | null;
          city: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          phone: string;
          property_type: Database["public"]["Enums"]["property_type"];
          purpose: Database["public"]["Enums"]["buyer_purpose"];
          source: Database["public"]["Enums"]["lead_source"];
          status?: Database["public"]["Enums"]["buyer_status"];
          tags?: string[] | null;
          timeline: Database["public"]["Enums"]["timeline"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bhk?: number | null;
          budget_max?: number | null;
          budget_min?: number | null;
          city?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          phone?: string;
          property_type?: Database["public"]["Enums"]["property_type"];
          purpose?: Database["public"]["Enums"]["buyer_purpose"];
          source?: Database["public"]["Enums"]["lead_source"];
          status?: Database["public"]["Enums"]["buyer_status"];
          tags?: string[] | null;
          timeline?: Database["public"]["Enums"]["timeline"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
          user_id?: string;
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
      buyer_purpose: "investment" | "end-use";
      buyer_status:
        | "new"
        | "contacted"
        | "qualified"
        | "viewing"
        | "negotiating"
        | "closed"
        | "lost";
      lead_source:
        | "website"
        | "referral"
        | "social media"
        | "advertisement"
        | "walk-in"
        | "phone"
        | "other";
      property_type:
        | "apartment"
        | "villa"
        | "plot"
        | "office"
        | "shop"
        | "warehouse";
      timeline: "immediate" | "1-3 months" | "3-6 months" | "6+ months";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      buyer_purpose: ["investment", "end-use"],
      buyer_status: [
        "new",
        "contacted",
        "qualified",
        "viewing",
        "negotiating",
        "closed",
        "lost",
      ],
      lead_source: [
        "website",
        "referral",
        "social media",
        "advertisement",
        "walk-in",
        "phone",
        "other",
      ],
      property_type: [
        "apartment",
        "villa",
        "plot",
        "office",
        "shop",
        "warehouse",
      ],
      timeline: ["immediate", "1-3 months", "3-6 months", "6+ months"],
    },
  },
} as const;
