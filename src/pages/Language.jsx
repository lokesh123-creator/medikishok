
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe2,
  Languages,
  Mic,
} from "lucide-react";

const languages = [
  {
    code: "te",
    name: "తెలుగు",
    english: "Telugu",
    native: "తెలుగు",
  },
  {
    code: "hi",
    name: "हिन्दी",
    english: "Hindi",
    native: "हिन्दी",
  },
  {
    code: "en",
    name: "English",
    english: "English",
    native: "English",
  },
];

function Language({ selectedLanguage, onSelect, onContinue }) {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Languages className="h-6 w-6 text-cyan-400" />
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

          <div className="text-sm text-slate-500">
            Step <span className="text-white">01</span> / 04
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-3xl">

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
            >
              <Globe2 className="h-8 w-8 text-cyan-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                Let's get started
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Choose your language
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
                Select the language you are most comfortable speaking.
                MediKiosk will use your choice throughout the voice interview.
              </p>
            </motion.div>

            {/* Language cards */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {languages.map((language, index) => {
                const active = selectedLanguage === language.code;

                return (
                  <motion.button
                    key={language.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    onClick={() => onSelect(language.code)}
                    className={`relative min-h-40 rounded-3xl border p-6 text-left transition-all duration-300 ${
                      active
                        ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.10)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* Selected */}
                    {active && (
                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                      <Mic
                        className={`h-5 w-5 ${
                          active ? "text-cyan-300" : "text-slate-500"
                        }`}
                      />
                    </div>

                    <p className="text-2xl font-medium">
                      {language.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {language.english}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <button
                disabled={!selectedLanguage}
                onClick={onContinue}
                className={`group flex items-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all ${
                  selectedLanguage
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] hover:scale-[1.02] hover:bg-cyan-300"
                    : "cursor-not-allowed bg-white/5 text-slate-600"
                }`}
              >
                Continue

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            <p className="mt-6 text-center text-xs text-slate-600">
              You can change your language before starting the interview.
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Language;

