
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Leaf,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import translations from "../data/translations";

const options = [
  {
    id: "clinical",
    icon: Stethoscope,
  },
  {
    id: "ayurveda",
    icon: Leaf,
  },
];

function ConsultationType({
  language,
  selectedType,
  onSelect,
  onContinue,
  onBack,
}) {
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">

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
            {t.consultationStep}
          </div>

        </header>


        {/* Main */}
        <main className="flex flex-1 items-center justify-center py-10">

          <div className="w-full max-w-4xl">

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Sparkles className="h-8 w-8 text-cyan-300" />
              </div>

              <p className="text-xs font-semibold tracking-[0.3em] text-cyan-400">
                {t.consultationLabel}
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.consultationTitle}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
                {t.consultationDescription}
              </p>

            </motion.div>


            {/* Options */}
            <div className="mt-12 grid gap-5 md:grid-cols-2">

              {options.map((option, index) => {

                const Icon = option.icon;
                const selected = selectedType === option.id;
                const isAyurveda = option.id === "ayurveda";

                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    onClick={() => onSelect(option.id)}
                    className={`relative overflow-hidden rounded-[2rem] border p-7 text-left transition-all duration-300 ${
                      selected
                        ? isAyurveda
                          ? "border-emerald-400/60 bg-emerald-400/[0.08] shadow-[0_0_45px_rgba(52,211,153,0.10)]"
                          : "border-cyan-400/60 bg-cyan-400/[0.08] shadow-[0_0_45px_rgba(34,211,238,0.10)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >

                    {/* Badge */}
                    {isAyurveda && (
                      <div className="absolute right-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-semibold tracking-[0.15em] text-emerald-300">
                        {t.recommended}
                      </div>
                    )}


                    {/* Icon */}
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                        selected
                          ? isAyurveda
                            ? "bg-emerald-400/15"
                            : "bg-cyan-400/15"
                          : "bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          selected
                            ? isAyurveda
                              ? "text-emerald-300"
                              : "text-cyan-300"
                            : "text-slate-500"
                        }`}
                      />
                    </div>


                    {/* Text */}
                    <div className="mt-7">

                      <p className="text-2xl font-semibold">
                        {isAyurveda
                          ? t.ayurvedaTitle
                          : t.clinicalTitle}
                      </p>

                      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                        {isAyurveda
                          ? t.ayurvedaDescription
                          : t.clinicalDescription}
                      </p>

                    </div>


                    {/* Status */}
                    <div
                      className={`mt-7 text-xs font-medium ${
                        selected
                          ? isAyurveda
                            ? "text-emerald-300"
                            : "text-cyan-300"
                          : "text-slate-600"
                      }`}
                    >
                      {selected
                        ? t.selected
                        : t.selectOption}
                    </div>

                  </motion.button>
                );
              })}

            </div>


            {/* Buttons */}
            <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-4 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </button>


              <button
                disabled={!selectedType}
                onClick={onContinue}
                className={`group flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all ${
                  selectedType
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] hover:scale-[1.02] hover:bg-cyan-300"
                    : "cursor-not-allowed bg-white/5 text-slate-600"
                }`}
              >
                {t.continue}

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default ConsultationType;

