'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              dob,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Check if we have a user
        if (data?.user) {
          try {
            // Create profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  name,
                  dob,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              ]);

            if (profileError) {
              console.error('Profile creation error:', profileError);
              setStatus({ 
                type: 'success', 
                message: 'Account created! Please check your email to verify your account. (Note: Profile creation will be completed upon verification)' 
              });
            } else {
              setStatus({ 
                type: 'success', 
                message: 'Account created! Please check your email to verify your account.' 
              });
            }
          } catch (profileError) {
            console.error('Profile creation error:', profileError);
            setStatus({ 
              type: 'success', 
              message: 'Account created! Please check your email to verify your account. (Note: Profile creation will be completed upon verification)' 
            });
          }
        }
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        if (data?.user) {
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError || !profileData) {
            // Create profile if it doesn't exist
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  name: data.user.user_metadata.name || 'User',
                  dob: data.user.user_metadata.dob || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              ]);

            if (createError) {
              console.error('Profile creation error:', createError);
            }
          }

          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate max date (must be at least 13 years old)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-sage-50 to-cream-100 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-forest-600 mb-2">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-sage-600 italic">
            {isSignUp 
              ? 'Begin your journey of self-discovery'
              : 'Return to your inner library'
            }
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 bg-white/80 rounded-xl p-8 shadow-soft">
          <div className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="block text-forest-600 font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-sage-200
                             text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                    required={isSignUp}
                    minLength={2}
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="block text-forest-600 font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={maxDateString}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-sage-200
                             text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                    required={isSignUp}
                  />
                  <p className="mt-1 text-xs text-sage-600">
                    Must be at least 13 years old
                  </p>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-forest-600 font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-sage-200
                         text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-forest-600 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-sage-200
                         text-brown-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-sage-600">
                  Must be at least 6 characters long
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password || (isSignUp && (!name || !dob))}
            className="w-full px-8 py-3 bg-forest-500 text-white rounded-xl font-medium
                     transition-all duration-300 hover:bg-forest-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>

          {status.message && (
            <p className={`text-sm ${
              status.type === 'success' ? 'text-forest-600' : 'text-red-500'
            }`}>
              {status.message}
            </p>
          )}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStatus({ type: '', message: '' });
              }}
              className="text-forest-500 hover:text-forest-600 text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : 'Need an account? Sign up'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 