import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/integrations/supabase/client";
import { useAuth } from "@/app/contexts/AuthContext";
import { BuyerFilter } from "@/app/lib/validations/buyer";
import { Database } from "@/app/integrations/supabase/types";
import { toast } from "sonner";

type Buyer = Database["public"]["Tables"]["buyers"]["Row"];
type BuyerInsert = Database["public"]["Tables"]["buyers"]["Insert"];
type BuyerUpdate = Database["public"]["Tables"]["buyers"]["Update"];

export function useBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBuyers = async (filters?: BuyerFilter) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from("buyers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
        );
      }

      if (filters?.city) {
        query = query.eq("city", filters.city);
      }

      if (filters?.propertyType) {
        query = query.eq("property_type", filters.propertyType);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.timeline) {
        query = query.eq("timeline", filters.timeline);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBuyers(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch buyers");
      toast.error("Failed to fetch buyer leads");
    } finally {
      setLoading(false);
    }
  };

  const createBuyer = useCallback(
    async (
      buyerData: Omit<
        BuyerInsert,
        "id" | "user_id" | "created_at" | "updated_at"
      >
    ) => {
      if (!user) {
        const error = new Error("User not authenticated");
        console.error(error);
        return { data: null, error: error.message };
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("buyers")
          .insert({
            ...buyerData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("No data returned from create operation");

        // Update local state optimistically
        setBuyers((prev) => [data, ...prev]);

        // Show success message
        toast.success(`Lead for ${buyerData.full_name} created successfully`);

        return { data, error: null };
      } catch (err) {
        console.error("Error creating buyer:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create buyer lead";
        toast.error(errorMessage);
        return { data: null, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateBuyer = async (id: string, updates: BuyerUpdate) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("buyers")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setBuyers((prev) =>
        prev.map((buyer) => (buyer.id === id ? data : buyer))
      );
      toast.success("Lead updated successfully");

      return { data, error: null };
    } catch (err) {
      console.error("Error updating buyer:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update buyer lead";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteBuyer = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { error } = await supabase
        .from("buyers")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setBuyers((prev) => prev.filter((buyer) => buyer.id !== id));
      toast.success("Lead deleted successfully");
      return { error: null };
    } catch (err) {
      console.error("Error deleting buyer:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete buyer lead";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  // Memoize the getBuyer function to prevent unnecessary re-renders
  const getBuyer = useCallback(
    async (id: string): Promise<Buyer | null> => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from("buyers")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Error fetching buyer:", err);
        throw err; // Re-throw to allow error handling in the component
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          await fetchBuyers();
          setFetchError(null);
        } catch (err) {
          setFetchError(
            err instanceof Error ? err.message : "Failed to fetch buyers"
          );
        }
      };
      fetchData();
    }
  }, [user]);

  return {
    buyers,
    loading,
    error: error || fetchError,
    fetchBuyers,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    getBuyer,
  };
}
