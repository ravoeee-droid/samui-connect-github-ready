import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, ArrowLeft, Sparkles, Store } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";
import { samuiVisuals } from "@/lib/visuals";

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const afterLogin = "/app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = afterLogin;
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", afterLogin);
  };

  const provider = () => {
    const text = encodeURIComponent(t('whatsapp.providerIntro'));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,hsl(var(--primary)/.22),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.04),transparent_44%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Landingpage
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-5 pb-10 md:grid-cols-[1fr_1fr] md:px-8">
        <section className="hidden md:block">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-card/70 p-3 shadow-[0_30px_100px_rgba(0,0,0,.44)] backdrop-blur-2xl">
            <img src={samuiVisuals.hero || samuiVisuals.party || samuiVisuals.stays} alt="Samui Connect login visual" className="h-[650px] w-full rounded-[2rem] object-cover" />
            <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary backdrop-blur-xl">
                <Sparkles className="mr-2 h-4 w-4" /> Samui Connect
              </div>
              <h1 className="font-heading text-5xl font-black leading-[0.95] text-white">{t('login.title')}</h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">{t('login.subtitle')}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-7 text-center md:text-left">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_15px_45px_hsl(var(--primary)/.35)]">
              <LogIn className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-4xl font-black tracking-tight">{t('login.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('login.subtitle')}</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-card/85 p-6 shadow-[0_25px_80px_rgba(0,0,0,.32)] backdrop-blur-2xl md:p-8">
            <Button variant="outline" className="mb-6 h-12 w-full rounded-2xl text-sm font-black" onClick={handleGoogle}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              {t('login.google')}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pl-10" required />
                </div>
              </div>

              <Button type="submit" className="h-12 w-full rounded-2xl font-black" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  t('login.submit')
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 grid gap-3 text-center text-sm text-muted-foreground">
            <p>
              {t('login.new')}{" "}
              <Link to="/register" className="font-black text-primary hover:underline">{t('login.create')}</Link>
            </p>
            <button onClick={provider} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-card/70 px-4 py-3 font-black text-foreground hover:bg-secondary">
              <Store className="h-4 w-4 text-primary" /> {t('landing.providerCta')}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
