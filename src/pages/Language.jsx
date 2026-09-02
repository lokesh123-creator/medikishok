import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe2,
  Languages,
  Mic,
  Sparkles,
  Volume2,
  Lock,
} from "lucide-react";

const languages = [
  {
    code: "te",
    name: "తెలుగు",
    english: "Telugu",
    native: "తెలుగు",
    description: "తెలుగులో మాట్లాడండి",
  },
  {
    code: "hi",
    name: "हिन्दी",
    english: "Hindi",
    native: "हिन्दी",
    description: "हिन्दी में बात करें",
  },
  {
    code: "en",
    name: "English",
    english: "English",
    native: "English",
    description: "Speak in English",
  },
];

const upcomingLanguages = [
  "தமிழ்",
  "ಕನ್ನಡ",
  "മലയാളം",
  "मराठी",
  "বাংলা",
  "ગુજરાતી",
];

function Language({ selectedLanguage, onSelect, onContinue }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-teal-500/[0.05] blur-[140px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[140px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}

      <motion.div
        animate={{
          y: [0, -18, 0],
          opacity: [0.2, 0.7, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-cyan-300"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[12%] top-[28%] h-1 w-1 rounded-full bg-teal-300"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[18%] left-[15%] h-1 w-1 rounded-full bg-sky-300"
      />


      {/* =========================================================
          HEADER
      ========================================================== */}

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-14">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08]">

            <Languages className="h-6 w-6 text-cyan-300" />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#050b14] bg-emerald-400" />

          </div>

          <div>

            <p className="text-[15px] font-bold tracking-[0.22em] sm:text-lg">
              MEDIKIOSK
            </p>

            <p className="text-[8px] tracking-[0.22em] text-slate-600 sm:text-[10px]">
              AI CLINICAL ASSISTANT
            </p>

          </div>

        </div>


        {/* Step */}

        <div className="flex items-center gap-3">

          <div className="hidden text-xs text-slate-600 sm:block">
            LANGUAGE
          </div>

          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.06] sm:w-24">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-cyan-300"
            />

          </div>

          <div className="text-xs text-slate-500">
            <span className="font-semibold text-white">01</span>
            <span className="mx-1">/</span>
            04
          </div>

        </div>

      </header>


      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-8 sm:px-8">

        <div className="w-full max-w-5xl">


          {/* =====================================================
              HERO
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-center"
          >

            {/* Globe icon */}

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center"
            >

              <div className="absolute inset-0 rounded-2xl bg-cyan-400/[0.08] blur-xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07]">

                <Globe2 className="h-8 w-8 text-cyan-300" />

              </div>

            </motion.div>


            {/* Label */}

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-cyan-300 sm:text-xs">

              <Sparkles className="h-3.5 w-3.5" />

              YOUR COMFORT COMES FIRST

            </div>


            <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl">

              Which language would you

              <br />

              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                like to speak?
              </span>

            </h1>


            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">

              Choose the language you are most comfortable speaking.
              MediKiosk will use it throughout your voice interview.

            </p>

          </motion.div>


          {/* =====================================================
              LANGUAGE CARDS
          ====================================================== */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">

            {languages.map((language, index) => {

              const active = selectedLanguage === language.code;

              return (
                <motion.button
                  key={language.code}
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
                    duration: 0.55,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={() => onSelect(language.code)}
                  className={`group relative min-h-[230px] overflow-hidden rounded-[2rem] border p-6 text-left backdrop-blur-xl transition-all duration-300 sm:p-7 ${
                    active
                      ? "border-cyan-300/40 bg-cyan-300/[0.07] shadow-[0_0_45px_rgba(34,211,238,0.10)]"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-cyan-300/20 hover:bg-white/[0.045]"
                  }`}
                >

                  {/* Glow */}

                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-[60px] transition-all duration-500 ${
                      active
                        ? "bg-cyan-400/[0.14]"
                        : "bg-cyan-400/[0.04] group-hover:bg-cyan-400/[0.08]"
                    }`}
                  />


                  {/* Selected */}

                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                    >

                      <Check className="h-4 w-4" />

                    </motion.div>
                  )}


                  {/* Number */}

                  <div className="absolute right-6 top-7 text-[9px] font-medium tracking-[0.2em] text-slate-700">

                    0{index + 1}

                  </div>


                  {/* Icon */}

                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                      active
                        ? "border-cyan-300/20 bg-cyan-300/[0.10]"
                        : "border-white/[0.06] bg-white/[0.04] group-hover:border-cyan-300/15"
                    }`}
                  >

                    <Mic
                      className={`h-5 w-5 transition-colors ${
                        active
                          ? "text-cyan-200"
                          : "text-slate-500 group-hover:text-cyan-300"
                      }`}
                    />

                  </div>


                  {/* Language */}

                  <div className="relative mt-7">

                    <p className="text-3xl font-medium tracking-tight">
                      {language.name}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        active
                          ? "text-cyan-300/70"
                          : "text-slate-600"
                      }`}
                    >
                      {language.english}
                    </p>

                    <p className="mt-4 text-xs text-slate-600">
                      {language.description}
                    </p>

                  </div>


                  {/* Bottom */}

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">

                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-700">

                      <Volume2 className="h-3 w-3" />

                      Voice ready

                    </div>

                    {active && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.1em] text-cyan-300"
                      >

                        Selected

                      </motion.div>
                    )}

                  </div>

                </motion.button>
              );
            })}

          </div>


          {/* =====================================================
              UPCOMING LANGUAGES
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 backdrop-blur-xl"
          >

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">

                  <Languages className="h-4 w-4 text-slate-500" />

                </div>

                <div>

                  <p className="text-xs font-medium text-slate-400">
                    More languages coming soon
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-700">
                    We're working to make MediKiosk accessible to more patients.
                  </p>

                </div>

              </div>


              <div className="flex flex-wrap justify-center gap-2">

                {upcomingLanguages.map((language) => (
                  <span
                    key={language}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-slate-600"
                  >
                    {language}
                  </span>
                ))}

              </div>

            </div>

          </motion.div>


          {/* =====================================================
              CONTINUE
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-7 flex justify-center"
          >

            <motion.button
              whileHover={selectedLanguage ? { scale: 1.02 } : {}}
              whileTap={selectedLanguage ? { scale: 0.98 } : {}}
              disabled={!selectedLanguage}
              onClick={onContinue}
              className={`group flex min-w-[190px] items-center justify-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all duration-300 ${
                selectedLanguage
                  ? "bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:bg-cyan-200"
                  : "cursor-not-allowed border border-white/[0.05] bg-white/[0.03] text-slate-700"
              }`}
            >

              {selectedLanguage ? (
                <>
                  Continue

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  Select a language
                </>
              )}

            </motion.button>

          </motion.div>


          {/* Bottom message */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-700">

            <Lock className="h-3 w-3" />

            You can change your language before the interview begins.

          </div>

        </div>

      </main>


      {/* Footer */}

      <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[9px] tracking-[0.12em] text-slate-800 sm:flex">

        <HeartPulseIcon />

        AI ASSISTED • DOCTOR VERIFIED

      </div>

    </div>
  );
}


/* Small footer icon kept separate to keep the main component clean */

function HeartPulseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      <path d="M3 12h4l2-4 3 8 2-4h7" />
    </svg>
  );
}

export default Language;