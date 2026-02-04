import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const saleMode = searchParams.get('saleMode');
    const usage = searchParams.get('usage');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    let query = supabase.from('properties').select('*');

    if (type && type !== 'All') {
        query = query.eq('type', type);
    }

    // Assuming DB uses sale_mode
    if (saleMode && saleMode !== 'All') {
        query = query.eq('sale_mode', saleMode);
    }

    if (usage && usage !== 'All') {
        query = query.eq('usage', usage);
    }

    if (minPrice) {
        query = query.gte('price', parseInt(minPrice));
    }

    if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice));
    }

    if (search) {
        // ILIKE is case-insensitive pattern matching
        // Note: this is simplistic. Usually you'd want OR logic across multiple fields.
        // Supabase .or syntax: .or(`title.ilike.%${search}%,city.ilike.%${search}%`)
        query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,locality.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform snake_case back to camelCase for frontend consistency
    const transformedData = data?.map(p => ({
        ...p,
        saleMode: p.sale_mode, // Map back
    }));

    return NextResponse.json(transformedData);
}
