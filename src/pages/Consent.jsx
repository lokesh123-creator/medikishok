
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  LockKeyhole,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import translations from "../data/translations";

function Consent({ language, onBack, onContinue }) {
  const [accepted, setAccepted] = useState(false);

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <HeartPulse className="h-6 w-6 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-[0.18em]">
                MEDIKIOSK
              </h1>

              <p className="text-[10px] tracking-[0.2em] text-slate-500">
                AI CLINICAL ASSISTANT
              </p>
            </div>

          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
            {t.consentStep}
          </div>

        </header>


        {/* Main */}
        <main className="flex flex-1 items-center justify-center py-10">

          <div className="w-full max-w-3xl">

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_50px_rgba(34,211,238,0.08)]"
            >
              <ShieldCheck className="h-10 w-10 text-cyan-300" />
            </motion.div>


            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-7 text-center"
            >

              <p className="text-xs font-semibold tracking-[0.3em] text-cyan-400">
                {t.consentLabel}
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.consentTitle}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
                {t.consentDescription}
              </p>

            </motion.div>


            {/* Information cards */}
            <div className="mt-10 grid gap-3">

              {[
                {
                  icon: Mic,
                  text: t.consentPoint1,
                },
                {
                  icon: HeartPulse,
                  text: t.consentPoint2,
                },
                {
                  icon: LockKeyhole,
                  text: t.consentPoint3,
                },
              ].map((item, index) => {

                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <p className="text-sm text-slate-300">
                      {item.text}
                    </p>

                  </motion.div>
                );
              })}

            </div>


            {/* Consent checkbox */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              onClick={() => setAccepted(!accepted)}
              className={`mt-6 flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                accepted
                  ? "border-cyan-400/50 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                  accepted
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-600"
                }`}
              >
                {accepted && <Check className="h-4 w-4" />}
              </div>

              <span className="text-sm font-medium text-slate-300">
                {t.consentCheckbox}
              </span>

            </motion.button>


            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-4 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </button>


              <button
                disabled={!accepted}
                onClick={onContinue}
                className={`group flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all ${
                  accepted
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] hover:scale-[1.02] hover:bg-cyan-300"
                    : "cursor-not-allowed bg-white/5 text-slate-600"
                }`}
              >

                {t.startInterview}

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />

              </button>

            </div>


            {/* Footer badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-slate-600">

              <span className="flex items-center gap-2">
                <LockKeyhole className="h-3.5 w-3.5" />
                {t.secure}
              </span>

              <span className="flex items-center gap-2">
                <Mic className="h-3.5 w-3.5" />
                {t.voice}
              </span>

              <span className="flex items-center gap-2">
                <HeartPulse className="h-3.5 w-3.5" />
                {t.multilingual}
              </span>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Consent;

