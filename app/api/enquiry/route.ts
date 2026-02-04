import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, mobile, email, message, propertyId } = body;

        if (!name || !mobile || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('enquiries')
            .insert([
                {
                    name,
                    mobile,
                    email,
                    message,
                    property_id: propertyId
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Enquiry sent successfully!' });
    } catch (error) {
        console.error('Error processing enquiry:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
