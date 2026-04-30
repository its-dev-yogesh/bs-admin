"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Step = "phone" | "otp";

function normalizePhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("+")) return trimmed.replace(/\s+/g, "");
  return `+${trimmed.replace(/\D/g, "")}`;
}

export default function SignInForm() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (auth.status === "authenticated") router.replace("/");
  }, [auth.status, router]);

  async function handleStartLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const normalized = normalizePhone(phone);
    if (!normalized || normalized.length < 8) {
      setError("Enter a valid phone number with country code (e.g. +9198…).");
      return;
    }
    setSubmitting(true);
    try {
      await auth.startLogin(normalized);
      setPhone(normalized);
      setStep("otp");
      setInfo(`OTP sent to ${normalized}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,8}$/.test(otp.trim())) {
      setError("Enter the OTP code sent to your phone.");
      return;
    }
    setSubmitting(true);
    try {
      await auth.verifyOtp(phone, otp.trim());
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await auth.resendOtp(phone);
      setInfo(`OTP resent to ${phone}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend OTP");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Admin sign in
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === "phone"
              ? "Enter your registered phone number to receive a one-time code."
              : `Enter the 6-digit code sent to ${phone}.`}
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-300">
            {error}
          </div>
        ) : null}
        {info ? (
          <div className="mb-4 rounded-lg border border-success-300 bg-success-50 px-4 py-3 text-sm text-success-700 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300">
            {info}
          </div>
        ) : null}

        {step === "phone" ? (
          <form onSubmit={handleStartLogin} className="space-y-6">
            <div>
              <Label>
                Phone number <span className="text-error-500">*</span>
              </Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button className="w-full" size="sm" disabled={submitting}>
              {submitting ? "Sending OTP…" : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Label>
                OTP code <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={submitting}
                className="text-sm text-brand-500 hover:text-brand-600 disabled:opacity-50"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setInfo(null);
                  setError(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Use a different number
              </button>
            </div>
            <Button className="w-full" size="sm" disabled={submitting}>
              {submitting ? "Verifying…" : "Verify & sign in"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Only accounts with the <span className="font-medium">admin</span> or
          <span className="font-medium"> super_admin</span> role can sign in
          here.
        </p>
      </div>
    </div>
  );
}
