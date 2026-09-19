"use client";

import { login, type LoginState } from "@/lib/actions/auth/login";
import { useActionState } from "react";

const initialState: LoginState = { error: "" };

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-[#f2ede480]">E-posta</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className="rounded-[6px] border border-[#f2ede433] bg-[#16140f] px-4 py-3.5 text-base text-[#f2ede4] outline-none transition-colors focus:border-main"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-[#f2ede480]">Şifre</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-[6px] border border-[#f2ede433] bg-[#16140f] px-4 py-3.5 text-base text-[#f2ede4] outline-none transition-colors focus:border-main"
        />
      </label>
      {state.error && (
        <p role="alert" className="m-0 text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 cursor-pointer rounded-full bg-main px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#0f0e0c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
};

export default LoginForm;
