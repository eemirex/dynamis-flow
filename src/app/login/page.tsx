"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!isSupabaseConfigured()) {
      setMessage("Live authentication is not connected in this preview. Open the demo workspace instead.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) setMessage(result.error.message);
    else if (mode === "signup") setMessage("Check your email to confirm your account.");
    else window.location.href = "/workspace";
    setLoading(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link href="/" className="brand auth-brand"><span className="brand-mark">D</span><span>Dynamis</span><span className="brand-product">Flow</span></Link>
        <div>
          <span className="auth-kicker">A CLEARER WAY TO SHIP</span>
          <h1>Turn shared ambition into visible momentum.</h1>
          <p>Plan the work, protect your team&apos;s focus, and keep every decision connected to the outcome.</p>
          <ul>
            <li><CheckCircle2 size={16} /> Flexible views for every working style</li>
            <li><CheckCircle2 size={16} /> Secure organizations, roles, and permissions</li>
            <li><CheckCircle2 size={16} /> A complete record of work and decisions</li>
          </ul>
        </div>
        <p>© {new Date().getFullYear()} Dynamis</p>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form-card">
          <div className="auth-mobile-brand"><span className="brand-mark">D</span><strong>Dynamis Flow</strong></div>
          <h2>{mode === "signin" ? "Welcome back" : "Create your workspace"}</h2>
          <p>{mode === "signin" ? "Sign in to continue to your workspace." : "Start organizing meaningful work in minutes."}</p>
          <form onSubmit={submit}>
            <label>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></label>
            <label>Password<div className="password-input"><input type={visible ? "text" : "password"} required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /><button type="button" onClick={() => setVisible((current) => !current)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
            {mode === "signin" && <button className="forgot" type="button">Forgot password?</button>}
            {message && <div className="auth-message"><LockKeyhole size={14} />{message}</div>}
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}<ArrowRight size={16} /></button>
          </form>
          <div className="auth-divider"><span>OR</span></div>
          <Link href="/workspace" className="button button-outline auth-submit">Explore the demo workspace</Link>
          <p className="auth-switch">{mode === "signin" ? "New to Dynamis Flow?" : "Already have an account?"}<button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
        </div>
      </section>
    </main>
  );
}
