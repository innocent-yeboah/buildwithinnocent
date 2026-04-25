import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, service, message } = await request.json();
    
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        source: 'website',
        service_interest: service || null,
        message: message || null,
        contacted: false,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
