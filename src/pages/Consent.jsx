import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HeartPulse,
  LockKeyhole,
  Mic,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";

import translations from "../data/translations";

function Consent({ language, onBack, onContinue }) {
  const [accepted, setAccepted] = useState(false);

  const t = translations[language] || translations.en;

  const information = [
    {
      icon: Mic,
      title: "Voice-first conversation",
      text: t.consentPoint1,
    },
    {
      icon: HeartPulse,
      title: "Clinical information",
      text: t.consentPoint2,
    },
    {
      icon: LockKeyhole,
      title: "Privacy & security",
      text: t.consentPoint3,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-250px] right-[-180px] h-[550px] w-[550px] rounded-full bg-emerald-500/[0.06] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.05] blur-[140px]" />

      {/* Grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07]">

              <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl" />

              <HeartPulse className="relative h-6 w-6 text-cyan-400" />

            </div>

            <div>

              <h1 className="text-sm font-bold tracking-[0.2em] sm:text-base">
                MEDIKIOSK
              </h1>

              <p className="mt-0.5 text-[9px] tracking-[0.22em] text-slate-500 sm:text-[10px]">
                AI CLINICAL ASSISTANT
              </p>

            </div>

          </div>


          {/* Progress */}

          <div className="flex items-center gap-3">

            <div className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/5 sm:block">

              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-cyan-400"
              />

            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-medium tracking-wide text-slate-400 sm:px-4 sm:text-xs">

              <span className="text-cyan-300">
                03
              </span>

              <span className="mx-1 text-slate-600">
                /
              </span>

              04

            </div>

          </div>

        </header>


        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="flex flex-1 items-center justify-center py-8 sm:py-12">

          <div className="w-full max-w-4xl">


            {/* =================================================
                HERO
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >

              {/* Shield */}

              <div className="relative mx-auto flex h-[82px] w-[82px] items-center justify-center">

                <div className="absolute inset-0 rounded-[1.8rem] border border-cyan-400/20 bg-cyan-400/[0.06] shadow-[0_0_60px_rgba(34,211,238,0.08)]" />

                <div className="absolute inset-2 rounded-[1.4rem] border border-cyan-300/10" />

                <ShieldCheck className="relative h-10 w-10 text-cyan-300" />

              </div>


              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-400 sm:text-xs">
                {t.consentLabel}
              </p>


              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">

                {t.consentTitle}

              </h2>


              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">

                {t.consentDescription}

              </p>

            </motion.div>


            {/* =================================================
                VOICE PREVIEW
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative mt-9 overflow-hidden rounded-[1.8rem] border border-cyan-400/15 bg-cyan-400/[0.035] p-5 sm:p-6"
            >

              {/* Glow */}

              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[250px] w-[250px] rounded-full bg-cyan-400/[0.08] blur-[90px]" />


              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">

                    <Volume2 className="h-6 w-6 text-cyan-300" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      Your consultation will be voice-first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Listen to questions and answer naturally using your voice.
                    </p>

                  </div>

                </div>


                {/* Voice indicator */}

                <div className="flex items-center gap-1.5 self-start rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2 sm:self-auto">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                  <span className="text-[10px] font-medium tracking-wide text-slate-400">
                    VOICE READY
                  </span>

                </div>

              </div>

            </motion.div>


            {/* =================================================
                INFORMATION CARDS
            ================================================= */}

            <div className="mt-5 grid gap-3 md:grid-cols-3">

              {information.map((item, index) => {

                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2 + index * 0.08,
                      duration: 0.45,
                    }}
                    className="group rounded-[1.5rem] border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.04]"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">

                      <Icon className="h-5 w-5 text-cyan-300" />

                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.text}
                    </p>

                  </motion.div>
                );
              })}

            </div>


            {/* =================================================
                CONSENT
            ================================================= */}

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
              onClick={() => setAccepted(!accepted)}
              className={`relative mt-5 flex w-full items-center gap-4 overflow-hidden rounded-[1.5rem] border p-5 text-left transition-all duration-300 sm:p-6 ${
                accepted
                  ? "border-cyan-400/40 bg-cyan-400/[0.07] shadow-[0_0_40px_rgba(34,211,238,0.06)]"
                  : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.16] hover:bg-white/[0.04]"
              }`}
            >

              {/* Selection glow */}

              {accepted && (
                <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" />
              )}


              {/* Checkbox */}

              <div
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                  accepted
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-600 bg-white/[0.02]"
                }`}
              >

                {accepted && (
                  <Check className="h-4 w-4 stroke-[3]" />
                )}

              </div>


              <div className="relative flex-1">

                <p
                  className={`text-sm font-medium transition-colors ${
                    accepted
                      ? "text-white"
                      : "text-slate-300"
                  }`}
                >
                  {t.consentCheckbox}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  You can stop the interview at any time.
                </p>

              </div>


              {accepted && (
                <CheckCircle2 className="relative hidden h-5 w-5 text-cyan-400 sm:block" />
              )}

            </motion.button>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
            >

              {/* Back */}

              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-4 text-sm font-medium text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >

                <ArrowLeft className="h-4 w-4" />

                {t.back}

              </button>


              {/* Continue */}

              <button
                disabled={!accepted}
                onClick={onContinue}
                className={`group flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold transition-all duration-300 ${
                  accepted
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.18)] hover:scale-[1.02] hover:bg-cyan-300"
                    : "cursor-not-allowed border border-white/[0.05] bg-white/[0.035] text-slate-600"
                }`}
              >

                <Sparkles
                  className={`h-4 w-4 ${
                    accepted
                      ? "text-slate-950"
                      : "text-slate-600"
                  }`}
                />

                {t.startInterview}

                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

              </button>

            </motion.div>


            {/* =================================================
                TRUST FOOTER
            ================================================= */}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] text-slate-600">

              <span className="flex items-center gap-2">

                <LockKeyhole className="h-3.5 w-3.5 text-emerald-400/60" />

                {t.secure}

              </span>


              <span className="flex items-center gap-2">

                <Mic className="h-3.5 w-3.5 text-cyan-400/60" />

                {t.voice}

              </span>


              <span className="flex items-center gap-2">

                <HeartPulse className="h-3.5 w-3.5 text-cyan-400/60" />

                {t.multilingual}

              </span>


              <span className="flex items-center gap-2">

                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/60" />

                AI assisted • Doctor verified

              </span>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Consent;