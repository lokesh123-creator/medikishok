import { motion } from "framer-motion";
import {
ArrowLeft,
ArrowRight,
CheckCircle2,
ClipboardList,
HeartPulse,
Leaf,
ShieldCheck,
Sparkles,
Stethoscope,
} from "lucide-react";

import translations from "../data/translations";

const options = [
{
id: "clinical",
icon: Stethoscope,
accent: "cyan",
features: [
"Symptoms & medical history",
"Adaptive AI questions",
"Structured clinical summary",
],
},
{
id: "ayurveda",
icon: Leaf,
accent: "emerald",
features: [
"Ayurvedic case taking",
"Agni, Koshtha & lifestyle",
"Prakriti & health assessment",
],
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

return ( <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">

```
  {/* ================= BACKGROUND ================= */}

  <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[150px]" />

  <div className="pointer-events-none absolute bottom-[-250px] left-[-180px] h-[550px] w-[550px] rounded-full bg-blue-500/[0.05] blur-[150px]" />

  <div className="pointer-events-none absolute bottom-[-180px] right-[-150px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[150px]" />

  {/* Grid texture */}

  <div
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}
  />

  <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-6 lg:px-8">

    {/* ================= HEADER ================= */}

    <header className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08]">

          <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 blur-xl" />

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


      {/* Step */}

      <div className="flex items-center gap-3">

        <div className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/5 sm:block">

          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-cyan-400"
          />

        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-medium tracking-wide text-slate-400 sm:px-4 sm:text-xs">

          <span className="text-cyan-300">
            02
          </span>

          <span className="mx-1 text-slate-600">
            /
          </span>

          04

        </div>

      </div>

    </header>


    {/* ================= MAIN ================= */}

    <main className="flex flex-1 items-center justify-center py-10 sm:py-14">

      <div className="w-full max-w-5xl">


        {/* ================= HEADING ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center"
        >

          {/* Icon */}

          <div className="relative mx-auto mb-7 flex h-[74px] w-[74px] items-center justify-center">

            <div className="absolute inset-0 rounded-[1.7rem] border border-cyan-400/20 bg-cyan-400/[0.07] shadow-[0_0_50px_rgba(34,211,238,0.08)]" />

            <div className="absolute inset-2 rounded-2xl border border-cyan-300/10" />

            <Sparkles className="relative h-8 w-8 text-cyan-300" />

          </div>


          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400 sm:text-xs">
            {t.consultationLabel || "CONSULTATION TYPE"}
          </p>


          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">

            {t.consultationTitle}

          </h2>


          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">

            {t.consultationDescription}

          </p>

        </motion.div>


        {/* ================= OPTIONS ================= */}

        <div className="mt-10 grid gap-5 md:grid-cols-2 sm:mt-14">

          {options.map((option, index) => {

            const Icon = option.icon;

            const selected =
              selectedType === option.id;

            const isAyurveda =
              option.id === "ayurveda";


            return (

              <motion.button
                key={option.id}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15 + index * 0.1,
                  duration: 0.5,
                }}
                onClick={() =>
                  onSelect(option.id)
                }
                className={`group relative min-h-[350px] overflow-hidden rounded-[2rem] border p-7 text-left transition-all duration-300 sm:p-8 ${
                  selected
                    ? isAyurveda
                      ? "border-emerald-400/50 bg-emerald-400/[0.07] shadow-[0_20px_80px_rgba(16,185,129,0.08)]"
                      : "border-cyan-400/50 bg-cyan-400/[0.07] shadow-[0_20px_80px_rgba(34,211,238,0.08)]"
                    : "border-white/[0.08] bg-white/[0.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
                }`}
              >


                {/* Glow */}

                {selected && (

                  <div
                    className={`pointer-events-none absolute right-[-100px] top-[-100px] h-[240px] w-[240px] rounded-full blur-[90px] ${
                      isAyurveda
                        ? "bg-emerald-400/10"
                        : "bg-cyan-400/10"
                    }`}
                  />

                )}


                {/* Top Row */}

                <div className="relative flex items-start justify-between">

                  {/* Icon */}

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
                      selected
                        ? isAyurveda
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                        : "border-white/[0.06] bg-white/[0.04] text-slate-500"
                    }`}
                  >

                    <Icon className="h-8 w-8" />

                  </div>


                  {/* Badge */}

                  {isAyurveda ? (

                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-emerald-300">

                      {t.recommended || "RECOMMENDED"}

                    </div>

                  ) : (

                    <div className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-slate-500">

                      STANDARD

                    </div>

                  )}

                </div>


                {/* Text */}

                <div className="relative mt-8">

                  <div className="flex items-center gap-3">

                    <h3 className="text-2xl font-semibold">

                      {isAyurveda
                        ? t.ayurvedaTitle
                        : t.clinicalTitle}

                    </h3>


                    {selected && (

                      <CheckCircle2
                        className={`h-5 w-5 ${
                          isAyurveda
                            ? "text-emerald-400"
                            : "text-cyan-400"
                        }`}
                      />

                    )}

                  </div>


                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">

                    {isAyurveda
                      ? t.ayurvedaDescription
                      : t.clinicalDescription}

                  </p>

                </div>


                {/* Features */}

                <div className="relative mt-7 space-y-3">

                  {option.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3 text-xs text-slate-400"
                    >

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          selected
                            ? isAyurveda
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-cyan-400/10 text-cyan-400"
                            : "bg-white/[0.04] text-slate-600"
                        }`}
                      >

                        <CheckCircle2 className="h-3 w-3" />

                      </div>

                      {feature}

                    </div>

                  ))}

                </div>


                {/* Bottom */}

                <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8">

                  <div
                    className={`flex items-center gap-2 text-xs font-medium ${
                      selected
                        ? isAyurveda
                          ? "text-emerald-300"
                          : "text-cyan-300"
                        : "text-slate-600"
                    }`}
                  >

                    <ClipboardList className="h-4 w-4" />

                    {selected
                      ? "Selected"
                      : t.selectOption}

                  </div>


                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                      selected
                        ? isAyurveda
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                        : "border-white/[0.07] bg-white/[0.03] text-slate-600 group-hover:text-slate-300"
                    }`}
                  >

                    <ArrowRight className="h-4 w-4" />

                  </div>

                </div>

              </motion.button>

            );
          })}

        </div>


        {/* ================= ACTIONS ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
          }}
          className="mt-10 flex flex-col-reverse gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between"
        >

          {/* Back */}

          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >

            <ArrowLeft className="h-4 w-4" />

            {t.back}

          </button>


          {/* Continue */}

          <button
            disabled={!selectedType}
            onClick={onContinue}
            className={`group flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold transition-all ${
              selectedType
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.18)] hover:scale-[1.02] hover:bg-cyan-300"
                : "cursor-not-allowed border border-white/[0.05] bg-white/[0.04] text-slate-600"
            }`}
          >

            {t.continue}

            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

          </button>

        </motion.div>


        {/* Bottom Trust */}

        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-slate-600">

          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />

          Your information will be securely prepared for clinical review

        </div>

      </div>

    </main>

  </div>

</div>


);
}

export default ConsultationType;
