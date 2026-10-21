"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useT } from '@/lib/i18n';

// Input look comes from .form-input (globals.css); height fixed so icons line up.
const inp = "form-input h-12 !py-0";

export default function SignInPage() {
  const { tr } = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      if (res?.error) {
        setError(tr("Email ou mot de passe incorrect"));
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(tr("Une erreur est survenue"));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <h1 className="text-h2 font-semibold text-sand-900">
          {tr("Bon retour 👋")}
        </h1>
        <p className="mt-3 text-[15px] text-sand-600">
          {tr("Connectez-vous pour accéder à votre espace The Communium")}
        </p>
      </div>

      {/* Form card */}
      <div className="relative rounded-token-xl border border-line bg-sand-0 p-6 shadow-token-lg sm:p-8">

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-token-sm border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">
              ⚠ {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-sand-800">
              {tr("Adresse Email")}
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-500" />
              <input
                id="email" name="email" type="email" required autoComplete="email"
                placeholder={tr("vous@exemple.com")}
                className={`${inp} ps-10 pe-4`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-medium text-sand-800">
                {tr("Mot de Passe")}
              </label>
              <Link href="#" className="text-[12.5px] font-medium text-brand-600 hover:text-brand-700">
                {tr("Mot de passe oublié ?")}
              </Link>
            </div>
            <div className="relative">
              <Lock aria-hidden="true" className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-500" />
              <input
                id="password" name="password" type={showPassword ? "text" : "password"} required
                autoComplete="current-password" placeholder="••••••••"
                className={`${inp} ps-10 pe-11`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? tr("Masquer le mot de passe") : tr("Afficher le mot de passe")}
                className="absolute end-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full text-sand-500 hover:bg-sand-100 hover:text-sand-900 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-primary btn-lg mt-2 w-full disabled:cursor-not-allowed">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{tr("Se connecter")} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-sand-0 px-3 text-sand-500">{tr("ou")}</span>
          </div>
        </div>

        <p className="text-center text-sm text-sand-600">
          {tr("Pas encore membre ?")}{" "}
          <Link href="/sign-up" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            {tr("Créer un compte")}
          </Link>
        </p>
      </div>
    </div>
  );
}
