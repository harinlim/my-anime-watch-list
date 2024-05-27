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
      anime: {
        Row: {
          created_at: string
          kitsu_id: string
          poster_image: Json | null
          synopsis: string | null
          title: string
        }
        Insert: {
          created_at?: string
          kitsu_id: string
          poster_image?: Json | null
          synopsis?: string | null
          title: string
        }
        Update: {
          created_at?: string
          kitsu_id?: string
          poster_image?: Json | null
          synopsis?: string | null
          title?: string
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          anime_id: string
          created_at: string
          rating: number | null
          review_text: string | null
          status: Database["public"]["Enums"]["watch_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anime_id: string
          created_at?: string
          rating?: number | null
          review_text?: string | null
          status?: Database["public"]["Enums"]["watch_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anime_id?: string
          created_at?: string
          rating?: number | null
          review_text?: string | null
          status?: Database["public"]["Enums"]["watch_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["kitsu_id"]
          },
          {
            foreignKeyName: "user_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          search_vector: unknown | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          search_vector?: unknown | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          search_vector?: unknown | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists_anime: {
        Row: {
          anime_id: string
          created_at: string
          watchlist_id: number
        }
        Insert: {
          anime_id: string
          created_at?: string
          watchlist_id: number
        }
        Update: {
          anime_id?: string
          created_at?: string
          watchlist_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_anime_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["kitsu_id"]
          },
          {
            foreignKeyName: "watchlists_anime_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists_users: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["collaborator_access"]
          user_id: string
          watchlist_id: number
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["collaborator_access"]
          user_id?: string
          watchlist_id?: number
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["collaborator_access"]
          user_id?: string
          watchlist_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_users_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_relationships: {
        Row: {
          shared_watchlist_count: number | null
          user1: string | null
          user2: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_users_user_id_fkey"
            columns: ["user2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_users_user_id_fkey"
            columns: ["user1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_edit_access_to_watchlist: {
        Args: {
          _user_id: string
          _watchlist_id: number
        }
        Returns: boolean
      }
      has_owner_access_to_watchlist: {
        Args: {
          _user_id: string
          _watchlist_id: number
        }
        Returns: boolean
      }
      has_watchlist: {
        Args: {
          _user_id: string
          _watchlist_id: number
        }
        Returns: boolean
      }
      is_watchlist_viewer: {
        Args: {
          _user_id: string
          _watchlist_id: number
        }
        Returns: boolean
      }
      json_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: {
          schema: Json
        }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: string[]
      }
      search_users:
        | {
            Args: {
              prefix: string
            }
            Returns: {
              id: string
              username: string
              avatar_url: string
              rank: number
            }[]
          }
        | {
            Args: {
              prefix: string
              exclude_watchlist_id: number
            }
            Returns: {
              id: string
              username: string
              avatar_url: string
              rank: number
            }[]
          }
        | {
            Args: {
              prefix: string
              exclude_watchlist_id: number
              querying_user_id: string
            }
            Returns: {
              id: string
              username: string
              avatar_url: string
              rank: number
            }[]
          }
        | {
            Args: {
              prefix: string
              querying_user_id: string
            }
            Returns: {
              id: string
              username: string
              avatar_url: string
              rank: number
            }[]
          }
      to_json2: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      to_jsonb2:
        | {
            Args: {
              "": unknown
            }
            Returns: Json
          }
        | {
            Args: {
              anyelement: string
            }
            Returns: Json
          }
    }
    Enums: {
      collaborator_access: "owner" | "editor" | "viewer"
      watch_status: "planned" | "watching" | "completed" | "dropped"
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
