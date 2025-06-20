import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      return new Response('No email address found', { status: 400 });
    }

    // Create user in Supabase with the same ID as Clerk
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: primaryEmail,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        clerk_user_id: id
      },
      password: crypto.randomUUID(), // Random password since we're using Clerk for auth
      id: id // Use the same ID as Clerk
    });

    if (createError) {
      console.error('Error creating user in Supabase:', createError);
      return new Response('Error creating user', { status: 500 });
    }

    return new Response('User created successfully', { status: 201 });
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (!id) {
      return new Response('No user ID found', { status: 400 });
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

    if (deleteError) {
      console.error('Error deleting user from Supabase:', deleteError);
      return new Response('Error deleting user', { status: 500 });
    }

    return new Response('User deleted successfully', { status: 200 });
  }

  return new Response('Webhook processed', { status: 200 });
} 