"use client";
import React from "react";
import PersonalKycForm from "@/components/kyc/PersonalKycForm";
import { useT } from '@/lib/i18n';

export default function Page() {
  const { tr } = useT();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-serif">{tr("Vérification - Compte Personnel")}</h1>
      <div className="mt-4">
        <PersonalKycForm />
      </div>
    </div>
  );
}
