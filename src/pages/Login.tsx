import React, { useState } from 'react';
import { Mail, Lock, Eye, ArrowRight, Wallet, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authData = await authService.login({ email, password });
      localStorage.setItem('access_token', authData.token);
      localStorage.setItem('refresh_token', authData.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column: Editorial Brand Imagery */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 min-h-100 md:min-h-screen overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Dakar Architecture" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8ROSyK9jW7QGyRvhCtHoAT6dV1yTUlU8yIeNNhX28l2uTuypuXsMYt3Yj2bf87ZT4N9lXmg4jgBQ4M4IekgbXwPYRCSqQty0KoeTD4Su6J-hzpiNHg_omhTUSbjwTJD60R_azOIQX3Z30pJSYTddvkGX8FOINuSjCO7Mgy7vjJ3bD6XFA5TXy8M9J_6uz0Vr-C-sgwaTuIwEZzo3tRONlwz4y4RAyvTXHlpA-WIrofpXvi4Faz3w6FUI8xvbz803sUeZ2fmU1cjp"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-primary via-primary/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16 lg:p-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-container flex items-center justify-center rounded-lg">
              <Wallet className="w-6 h-6 text-on-secondary-container" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-headline">Cadoobi</span>
          </div>

          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-headline leading-tight mb-6">
              The Sovereign <br/><span className="text-secondary-fixed">Ledger of West Africa</span>
            </h1>
            <p className="text-primary-fixed-dim text-lg md:text-xl font-body leading-relaxed max-w-md">
              Secure, transparent, and high-velocity mobile money management for the modern Senegalese enterprise.
            </p>
            
            <div className="mt-12 flex flex-col gap-6">
              <div className="flex items-start gap-4 p-6 rounded-xl glass-panel border border-white/5 max-w-sm">
                <ShieldCheck className="text-secondary-fixed w-8 h-8" />
                <div>
                  <h3 className="text-white font-semibold font-headline">Enterprise Security</h3>
                  <p className="text-white/60 text-sm mt-1">Multi-layered encryption ensuring every XOF is accounted for with absolute precision.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-primary"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-white/50 text-sm">Trusted by 500+ merchants in Dakar</p>
          </div>
        </div>
      </section>

      {/* Right Column: Login Form */}
      <section className="w-full md:w-1/2 lg:w-2/5 bg-surface flex items-center justify-center p-8 md:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-on-surface font-headline mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant font-body">Manage your transactions with ease and security.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
    </main>
  );
}
