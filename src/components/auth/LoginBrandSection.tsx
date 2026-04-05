import React from 'react';
import { Wallet, ShieldCheck } from 'lucide-react';

export function LoginBrandSection() {
  return (
    <section className="relative w-full md:w-1/2 lg:w-3/5 min-h-100 md:min-h-screen overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        <img
          alt="Dakar Architecture"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8ROSyK9jW7QGyRvhCtHoAT6dV1yTUlU8yIeNNhX28l2uTuypuXsMYt3Yj2bf87ZT4N9lXmg4jgBQ4M4IekgbXwPYRCSqQty0KoeTD4Su6J-hzpiNHG_omhTUSbjwTJD60R_azOIQX3Z30pJSYTddvkGX8FOINuSjCO7Mgy7vjJ3bD6XFA5TXy8M9J_6uz0Vr-C-sgwaTuIwEZzo3tRONlwz4y4RAyvTXHlpA-WIrofpXvi4Faz3w6FUI8xvbz803sUeZ2fmU1cjp"
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
  );
}
