import React from 'react';
import { Mail, Eye, ArrowRight, TrendingUp } from 'lucide-react';

interface LoginFormSectionProps {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginFormSection({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: LoginFormSectionProps) {
  return (
    <section className="w-full md:w-1/2 lg:w-2/5 bg-surface flex items-center justify-center p-8 md:p-12 lg:p-20">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-on-surface font-headline mb-2">Welcome Back</h2>
          <p className="text-on-surface-variant font-body">Manage your transactions with ease and security.</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface" htmlFor="email">Email address</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-highest px-4 py-4 rounded-lg outline-none border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-on-surface-variant/50"
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-on-surface" htmlFor="password">Password</label>
              <button type="button" className="text-sm font-medium text-surface-tint hover:underline">Forgot password?</button>
            </div>
            <div className="relative">
              <input
                className="w-full bg-surface-container-highest px-4 py-4 rounded-lg outline-none border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-on-surface-variant/50"
                id="password"
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              className="w-5 h-5 rounded border-outline-variant bg-surface-container-highest text-primary focus:ring-0 cursor-pointer"
              id="remember"
              type="checkbox"
            />
            <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Keep me signed in for 30 days</label>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-primary hover:bg-primary-container text-white py-4 px-6 rounded shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all font-headline font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-surface-container-high flex flex-col items-center gap-6">
          <p className="text-sm text-on-surface-variant">Don't have an admin account yet?</p>
          <button className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
            Request Merchant Access
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-20 flex justify-between items-center opacity-50 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          <span>© 2024 Cadoobi Transactions</span>
          <div className="flex gap-4">
            <button className="hover:text-on-surface">Privacy</button>
            <button className="hover:text-on-surface">Support</button>
          </div>
        </div>
      </div>
    </section>
  );
}
