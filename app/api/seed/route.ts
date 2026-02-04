import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import properties from '@/data/properties.json';

export async function GET() {
    try {
        // 1. Check if table is empty or create it (Supabase usually requires dashboard setup for schema, but we can try to insert)
        // Assuming table 'properties' exists with appropriate columns.

        // Check if data already exists
        const { count, error: countError } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            return NextResponse.json({ error: countError.message }, { status: 500 });
        }

        if (count && count > 0) {
            return NextResponse.json({ message: 'Data already seeded', count });
        }

        // 2. Insert data in chunks to avoid payload limits
        const chunkSize = 50;
        let insertedCount = 0;

        for (let i = 0; i < properties.length; i += chunkSize) {
            const chunk = properties.slice(i, i + chunkSize).map(p => ({
                // Map fields if necessary, or ensure JSON matches DB columns
                // Assuming DB columns: title, type, saleMode, usage, price, area, city, locality, lat, lng, images, description
                title: p.title,
                type: p.type,
                sale_mode: p.saleMode, // Note casing change for typical DB conventions, or keep camelCase if DB is quoted
                usage: p.usage,
                price: p.price,
                area: p.area,
                city: p.city,
                locality: p.locality,
                lat: p.lat,
                lng: p.lng,
                images: p.images,
                description: p.description
            }));

            const { error } = await supabase.from('properties').insert(chunk);

            if (error) {
                console.error('Error inserting chunk:', error);
                return NextResponse.json({ error: error.message, insertedCount }, { status: 500 });
            }

            insertedCount += chunk.length;
        }

        return NextResponse.json({ success: true, message: `Seeded ${insertedCount} properties` });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
