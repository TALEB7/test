"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useT } from '@/lib/i18n';

// Input look comes from .form-input (globals.css); height fixed so icons line up.
const inp = "form-input h-12 !py-0";

const lbl = "text-[13px] font-medium text-sand-800";
const icon = "text-sand-500";

export default function SignUpPage() {
  const { tr } = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email     = formData.get("email")     as string;
    const password  = formData.get("password")  as string;
    const phone     = formData.get("phone")     as string;

    try {
      const regRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, accountType, phone }),
        },
      );
      if (!regRes.ok) {
        const data = await regRes.json().catch(() => ({}));
        throw new Error(data.message || tr("Erreur lors de la création du compte."));
      }
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) throw new Error(tr("Erreur de connexion après inscription."));
      router.push("/onboarding");
      router.refresh();
    } catch (err: any) {
      setError(err.message === "Failed to fetch"
        ? tr("Impossible de contacter le serveur. Vérifiez que le backend est démarré.")
        : err.message || tr("Une erreur est survenue"));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-h2 font-semibold text-sand-900">
          {tr("Rejoindre The Communium")}
        </h1>
        <p className="mt-3 text-[15px] text-sand-600">
          {tr("Créez votre compte et développez votre réseau professionnel")}
        </p>
      </div>

      <div className="relative rounded-token-xl border border-line bg-sand-0 p-6 shadow-token-lg sm:p-8">

        {/* Account type toggle */}
        <div role="radiogroup" aria-label={tr("Type de compte")} className="mb-6 flex gap-1 rounded-full border border-line bg-sand-50 p-1">
          {[
            { value: "personal" as const, icon: User,      label: "Personnel" },
            { value: "business" as const, icon: Briefcase, label: "Business" },
          ].map(({ value, icon: Icon, label }) => (
            <button key={value} type="button" role="radio" aria-checked={accountType === value} onClick={() => setAccountType(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                accountType === value
                  ? "bg-sand-0 text-sand-900 shadow-token-sm ring-1 ring-line"
                  : "text-sand-600 hover:text-sand-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tr(label)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-token-sm border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">
              ⚠ {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className={lbl}>{tr("Email")}</label>
            <div className="relative">
              <Mail aria-hidden="true" className={`absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${icon}`} />
              <input id="email" name="email" type="email" required autoComplete="email"
                placeholder={tr("vous@exemple.com")} className={`${inp} ps-10`} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className={lbl}>{tr("Téléphone")}</label>
            <div className="relative">
              <span dir="ltr" className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-sand-600">+212</span>
              <input id="phone" name="phone" dir="ltr" type="tel" required
                placeholder="6 00 00 00 00" className={`${inp} ps-14`} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className={lbl}>{tr("Mot de Passe")}</label>
            <div className="relative">
              <Lock aria-hidden="true" className={`absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${icon}`} />
              <input id="password" name="password" type={showPassword ? "text" : "password"} required
                autoComplete="new-password" minLength={8}
                placeholder={tr("8+ caractères")} className={`${inp} ps-10 pe-11`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? tr("Masquer le mot de passe") : tr("Afficher le mot de passe")}
                className="absolute end-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full text-sand-500 hover:bg-sand-100 hover:text-sand-900 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary btn-lg mt-2 w-full disabled:cursor-not-allowed">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{tr("Continuer")} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" /></>}
          </button>

          <p className="text-[12px] text-center text-sand-500">
            {tr("En continuant, vous acceptez nos")}{" "}
            <Link href="/terms" className="text-brand-600 underline-offset-2 hover:underline">{tr("Conditions d'utilisation")}</Link>.
          </p>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-sand-0 px-3 text-sand-500">{tr("ou")}</span>
          </div>
        </div>

        <p className="text-center text-sm text-sand-600">
          {tr("Déjà membre ?")}{" "}
          <Link href="/sign-in" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            {tr("Se connecter")}
          </Link>
        </p>
      </div>
    </div>
  );
}
