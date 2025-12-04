
import { supabase } from '../lib/supabase';

// Helper to map DB column names to camelCase if needed, 
// but for simplicity we will try to keep them consistent or map them here.
// Current app uses camelCase. Supabase usually uses snake_case.
// We will handle mapping here.

export const api = {
    // --- Services ---
    getServices: async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id');
        if (error) throw error;
        return data;
    },

    addService: async (service) => {
        // Remove ID if it's auto-generated, or handle it.
        // The app currently generates IDs manually. 
        // We'll let the app generate ID or let DB do it. 
        // For now, let's stick to the app's logic of generating IDs to keep it simple,
        // or better, let's just insert and let DB handle it if we switch to UUIDs, 
        // but the app relies on numeric IDs for bundles.
        const { data, error } = await supabase
            .from('services')
            .insert([service])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateService: async (id, updates) => {
        const { data, error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteService: async (id) => {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // --- Bundles ---
    getBundles: async () => {
        const { data, error } = await supabase
            .from('bundles')
            .select('*')
            .order('id');
        if (error) throw error;
        return data;
    },

    addBundle: async (bundle) => {
        const { data, error } = await supabase
            .from('bundles')
            .insert([bundle])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateBundle: async (id, updates) => {
        const { data, error } = await supabase
            .from('bundles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteBundle: async (id) => {
        const { error } = await supabase
            .from('bundles')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // --- Settings ---
    getSettings: async () => {
        const { data, error } = await supabase
            .from('ui_settings')
            .select('*')
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            throw error;
        }
        return data;
    },

    updateSettings: async (settings) => {
        // Upsert based on a fixed ID or single row logic
        // We assume there's only one row.
        const { data, error } = await supabase
            .from('ui_settings')
            .upsert({ id: 1, ...settings })
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
