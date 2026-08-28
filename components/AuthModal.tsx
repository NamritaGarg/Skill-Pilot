'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, identifyUser } from '@/lib/posthog';
import { Mail, Lock, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  onLoginSuccess: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, userEmail, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'DefaultPassword123!',
        });

        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! Please check your email inbox to confirm registration.',
        });
        trackEvent('user_signed_up', { email });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'DefaultPassword123!',
        });

        if (error) {
          // Attempt Magic Link fallback
          const { error: otpError } = await supabase.auth.signInWithOtp({ email });
          if (otpError) throw error;
          setMessage({
            type: 'success',
            text: 'Magic login link sent to your email inbox.',
          });
        } else {
          setMessage({ type: 'success', text: 'Successfully authenticated!' });
          onLoginSuccess(email);
          identifyUser(data.user?.id || email, { email });
          trackEvent('user_logged_in', { email });
          setTimeout(() => onClose(), 1200);
        }
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please verify credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#141418] border border-[#dfb76c]/30 rounded-xl shadow-2xl p-6 relative overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold Glow Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] border border-[#dfb76c]/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            {isSignUp ? 'Join AI Learning Mentor' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Sign in with email to persist conversation logs & telemetry in Supabase.
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@mentor.ai"
                className="w-full bg-[#1b1b22] border border-zinc-700/80 rounded-md py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb76c] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1b1b22] border border-zinc-700/80 rounded-md py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfb76c] transition"
              />
            </div>
          </div>

          {/* Full Corner Radius Pill Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42] text-zinc-950 font-bold text-xs hover:opacity-95 transition flex items-center justify-center gap-2 shadow-champagne-glow disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In with Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-[#dfb76c] hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-[#dfb76c] hover:underline font-semibold"
              >
                Create One
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
