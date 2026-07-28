import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a customer item photo file (or dataURL) to Supabase storage bucket 'quote-photos'.
 * Returns public URL of the uploaded image.
 */
export async function uploadQuotePhoto(fileOrDataUrl, quoteNumber) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured yet. Returning local image data.');
    return fileOrDataUrl; // Fallback: returns base64 or blob string
  }

  try {
    let fileBlob = fileOrDataUrl;
    let fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

    // Convert dataURL to Blob if needed
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const res = await fetch(fileOrDataUrl);
      fileBlob = await res.blob();
    }

    const filePath = `${quoteNumber || 'temp'}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('quote-photos')
      .upload(filePath, fileBlob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase photo upload error:', error);
      return fileOrDataUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('quote-photos')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload photo to Supabase:', err);
    return fileOrDataUrl;
  }
}

/**
 * Saves a new quote record into Supabase 'quotes' database table.
 */
export async function saveQuoteToSupabase(quoteRecord) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert([
        {
          quote_number: quoteRecord.quoteNumber,
          customer_name: quoteRecord.customer?.name,
          customer_phone: quoteRecord.customer?.phone,
          customer_email: quoteRecord.customer?.email,
          service: quoteRecord.service,
          vehicle: quoteRecord.vehicle,
          delivery_team: quoteRecord.deliveryTeam,
          pickup_data: quoteRecord.pickup,
          delivery_data: quoteRecord.delivery,
          items_data: quoteRecord.items,
          pricing_data: quoteRecord.pricingBreakdown,
          status: quoteRecord.status || 'New',
          created_at: quoteRecord.timestamp || new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase save error:', error);
      return null;
    }

    return data[0];
  } catch (err) {
    console.error('Failed to save quote to Supabase DB:', err);
    return null;
  }
}
