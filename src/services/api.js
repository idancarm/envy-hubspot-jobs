
import { supabase } from '../lib/supabase';

// Helper to map DB column names to camelCase if needed, 
// but for simplicity we will try to keep them consistent or map them here.
// Current app uses camelCase. Supabase usually uses snake_case.
// We will handle mapping here.

// Helper to map DB response to frontend model
const mapServiceFromDb = (s) => ({
    ...s,
    youtubeVideoId: s.youtube_video_id,
    colorTheme: s.color_theme || 'primary',
    pricingModel: s.pricing_model || 'fixed',
    monthlyPrice: s.monthly_price || 0,
    seoTitle: s.seo_title || '',
    seoDescription: s.seo_description || '',
});

export const api = {
    // --- Services ---
    getServices: async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true }); // Fallback
        if (error) throw error;
        return data.map(mapServiceFromDb);
    },

    updateServicesOrder: async (updates) => {
        // updates is array of { id, sort_order }
        const { data, error } = await supabase
            .from('services')
            .upsert(updates)
            .select();
        if (error) throw error;
        return data.map(mapServiceFromDb);
    },

    addService: async (service) => {
        // Map camelCase to snake_case for DB
        const dbPayload = {
            ...service,
            youtube_video_id: service.youtubeVideoId,
            color_theme: service.colorTheme,
            pricing_model: service.pricingModel,
            monthly_price: service.monthlyPrice,
            seo_title: service.seoTitle,
            seo_description: service.seoDescription,
        };
        // Remove camelCase keys that aren't in DB (optional, but cleaner)
        delete dbPayload.youtubeVideoId;
        delete dbPayload.colorTheme;
        delete dbPayload.pricingModel;
        delete dbPayload.monthlyPrice;
        delete dbPayload.seoTitle;
        delete dbPayload.seoDescription;
        delete dbPayload.uniqueId; // client-side only

        const { data, error } = await supabase
            .from('services')
            .insert([dbPayload])
            .select()
            .single();
        if (error) throw error;
        return mapServiceFromDb(data);
    },

    updateService: async (id, updates) => {
        // Map camelCase to snake_case for DB
        const dbPayload = {
            ...updates,
            youtube_video_id: updates.youtubeVideoId,
            color_theme: updates.colorTheme,
            pricing_model: updates.pricingModel,
            monthly_price: updates.monthlyPrice,
            seo_title: updates.seoTitle,
            seo_description: updates.seoDescription,
        };
        delete dbPayload.youtubeVideoId;
        delete dbPayload.colorTheme;
        delete dbPayload.pricingModel;
        delete dbPayload.monthlyPrice;
        delete dbPayload.seoTitle;
        delete dbPayload.seoDescription;
        delete dbPayload.uniqueId;

        const { data, error } = await supabase
            .from('services')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return mapServiceFromDb(data);
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
