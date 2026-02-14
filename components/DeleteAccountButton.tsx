"use client";

import { deleteAccount } from "@/app/actions/account";
import { useState } from "react";

const CONFIRM_MESSAGE =
  "Sei sicuro di voler eliminare il tuo account? Verrai disconnesso. Questa azione non può essere annullata.";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm(CONFIRM_MESSAGE)) return;
    setLoading(true);
    await deleteAccount();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {loading ? "Elaborazione…" : "Elimina account"}
    </button>
  );
}
