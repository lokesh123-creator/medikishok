import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Mic,
  Languages,
  BrainCircuit,
  Stethoscope,
  Activity,
  CircleCheck,
} from "lucide-react";

function Welcome({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      {/* Main cyan glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[150px]" />

      {/* Left teal glow */}
      <div className="pointer-events-none absolute bottom-[-250px] left-[-180px] h-[550px] w-[550px] rounded-full bg-teal-500/[0.07] blur-[140px]" />

      {/* Right blue glow */}
      <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-[140px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* =========================================================
          FLOATING PARTICLES
      ========================================================== */}

      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[12%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-300"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[8%] top-[65%] h-1 w-1 rounded-full bg-teal-300"
      />

      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute right-[15%] top-[22%] h-1.5 w-1.5 rounded-full bg-sky-300"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[9%] bottom-[25%] h-1 w-1 rounded-full bg-cyan-300"
      />

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-14">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >

          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08] shadow-[0_0_30px_rgba(34,211,238,0.08)]">

            <HeartPulse className="h-6 w-6 text-cyan-300" />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#050b14] bg-emerald-400" />

          </div>

          <div>
            <h1 className="text-[15px] font-bold tracking-[0.22em] sm:text-lg">
              MEDIKIOSK
            </h1>

            <p className="mt-0.5 text-[8px] tracking-[0.22em] text-slate-500 sm:text-[10px]">
              AI CLINICAL ASSISTANT
            </p>
          </div>

        </motion.div>


        {/* System status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-2.5 text-xs text-slate-400 sm:flex"
        >

          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          />

          System Online

        </motion.div>

      </header>


      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center px-5 py-8 sm:px-8 lg:px-14 lg:py-12">

        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">


          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-2xl"
          >

            {/* AI badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-[10px] font-medium tracking-[0.14em] text-cyan-300 sm:text-xs"
            >

              <Sparkles className="h-3.5 w-3.5" />

              AI-POWERED HEALTH INTERVIEW

              <span className="h-1 w-1 rounded-full bg-cyan-300/60" />

              VOICE FIRST

            </motion.div>


            {/* Main heading */}
            <h2 className="text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]">

              Tell us how

              <br />

              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                you're feeling.
              </span>

            </h2>


            {/* Supporting heading */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Speak naturally in your language. MediKiosk listens to your
              answers and organizes your health history for your doctor.
            </p>


            {/* =================================================
                LANGUAGE PREVIEW
            ================================================== */}

            <div className="mt-7 flex flex-wrap items-center gap-2">

              <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 backdrop-blur-xl">

                <Languages className="h-3.5 w-3.5 text-cyan-300" />

                <span>తెలుగు</span>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 backdrop-blur-xl">

                <span>हिन्दी</span>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 backdrop-blur-xl">

                <span>English</span>

              </div>

              <span className="ml-1 text-xs text-slate-600">
                + more languages
              </span>

            </div>


            {/* =================================================
                CTA
            ================================================== */}

            <motion.button
              onClick={onStart}
              whileHover={{
                scale: 1.025,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group mt-9 flex w-full max-w-[330px] items-center justify-between rounded-2xl border border-cyan-200/20 bg-cyan-300 px-5 py-4 text-left font-semibold text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.14)] transition-all duration-300 hover:bg-cyan-200 sm:px-6 sm:py-5"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950/10">

                  <Mic className="h-5 w-5" />

                </div>

                <div>

                  <p className="text-sm font-bold sm:text-base">
                    Start Health Interview
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-800/60 sm:text-xs">
                    Speak naturally • Takes a few minutes
                  </p>

                </div>

              </div>

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />

            </motion.button>


            {/* =================================================
                TRUST INDICATORS
            ================================================== */}

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 sm:text-sm">

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                Consent first

              </div>

              <div className="flex items-center gap-2">

                <CircleCheck className="h-4 w-4 text-cyan-400" />

                Voice enabled

              </div>

              <div className="flex items-center gap-2">

                <CircleCheck className="h-4 w-4 text-teal-400" />

                Multilingual

              </div>

            </div>

          </motion.section>


          {/* =====================================================
              RIGHT AI VISUAL
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative flex min-h-[420px] items-center justify-center lg:min-h-[560px]"
          >

            {/* Outer ambient glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[90px] sm:h-[390px] sm:w-[390px]"
            />


            {/* =================================================
                ROTATING OUTER RING
            ================================================== */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[330px] w-[330px] rounded-full border border-cyan-300/[0.10] sm:h-[430px] sm:w-[430px]"
            >

              {/* Orbiting dot */}
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />

              <div className="absolute bottom-[15%] right-[4%] h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_15px_rgba(94,234,212,0.8)]" />

            </motion.div>


            {/* Second rotating ring */}
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[270px] w-[270px] rounded-full border border-teal-300/[0.08] sm:h-[350px] sm:w-[350px]"
            >

              <div className="absolute left-[4%] top-[20%] h-2 w-2 rounded-full bg-sky-300/80 shadow-[0_0_14px_rgba(125,211,252,0.8)]" />

            </motion.div>


            {/* =================================================
                AI CORE
            ================================================== */}

            <motion.div
              animate={{
                scale: [1, 1.035, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-[245px] w-[245px] items-center justify-center rounded-full border border-cyan-200/15 bg-gradient-to-br from-cyan-400/[0.08] via-[#07111f] to-teal-400/[0.08] shadow-[inset_0_0_90px_rgba(34,211,238,0.07),0_0_80px_rgba(34,211,238,0.08)] sm:h-[320px] sm:w-[320px]"
            >

              {/* Pulse rings */}

              <motion.div
                animate={{
                  scale: [0.85, 1.2],
                  opacity: [0.35, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute h-36 w-36 rounded-full border border-cyan-300/30 sm:h-44 sm:w-44"
              />

              <motion.div
                animate={{
                  scale: [0.8, 1.35],
                  opacity: [0.25, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1.2,
                }}
                className="absolute h-36 w-36 rounded-full border border-teal-300/20 sm:h-44 sm:w-44"
              />


              {/* Inner core */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 35px rgba(34,211,238,0.12)",
                    "0 0 65px rgba(34,211,238,0.25)",
                    "0 0 35px rgba(34,211,238,0.12)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-200/25 bg-gradient-to-br from-cyan-300/15 to-teal-300/10 sm:h-36 sm:w-36"
              >

                <HeartPulse className="h-12 w-12 text-cyan-200 sm:h-14 sm:w-14" />

                {/* tiny center dot */}
                <motion.span
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_12px_white]"
                />

              </motion.div>

            </motion.div>


            {/* =================================================
                FLOATING AI STATUS CARD
            ================================================== */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[3%] left-1/2 w-[270px] -translate-x-1/2 rounded-2xl border border-white/[0.10] bg-[#08121f]/85 p-4 shadow-2xl backdrop-blur-2xl sm:w-[300px]"
            >

              <div className="flex items-center gap-3">

                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06]">

                  <motion.span
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                  />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <p className="text-xs font-semibold text-white sm:text-sm">
                      MediKiosk AI
                    </p>

                    <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2 py-0.5 text-[8px] text-emerald-300">
                      READY
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                    Listening • Understanding • Organizing
                  </p>

                </div>

              </div>

              {/* Mini waveform */}
              <div className="mt-4 flex h-5 items-center justify-center gap-1">

                {[12, 20, 9, 16, 24, 13, 21, 10, 18, 14, 22, 8].map(
                  (height, index) => (
                    <motion.span
                      key={index}
                      animate={{
                        height: [height / 2, height, height / 2],
                      }}
                      transition={{
                        duration: 0.8 + index * 0.04,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.05,
                      }}
                      className="w-1 rounded-full bg-cyan-300/50"
                    />
                  )
                )}

              </div>

            </motion.div>


            {/* =================================================
                SMALL FLOATING FEATURE CARDS
            ================================================== */}

            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[2%] top-[20%] hidden rounded-2xl border border-white/[0.08] bg-[#08121f]/70 p-3 backdrop-blur-xl sm:block"
            >

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/[0.07]">

                  <Mic className="h-4 w-4 text-cyan-300" />

                </div>

                <div>

                  <p className="text-[10px] font-medium text-white">
                    Voice Input
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Natural conversation
                  </p>

                </div>

              </div>

            </motion.div>


            <motion.div
              animate={{
                y: [0, 7, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute right-[1%] top-[25%] hidden rounded-2xl border border-white/[0.08] bg-[#08121f]/70 p-3 backdrop-blur-xl sm:block"
            >

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/[0.07]">

                  <BrainCircuit className="h-4 w-4 text-teal-300" />

                </div>

                <div>

                  <p className="text-[10px] font-medium text-white">
                    AI Processing
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Structured history
                  </p>

                </div>

              </div>

            </motion.div>


            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-[20%] left-[5%] hidden rounded-2xl border border-white/[0.08] bg-[#08121f]/70 p-3 backdrop-blur-xl sm:block"
            >

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/[0.07]">

                  <Stethoscope className="h-4 w-4 text-blue-300" />

                </div>

                <div>

                  <p className="text-[10px] font-medium text-white">
                    Doctor Ready
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Clear clinical summary
                  </p>

                </div>

              </div>

            </motion.div>

          </motion.section>

        </div>

      </main>


      {/* =========================================================
          BOTTOM MICRO FOOTER
      ========================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-[9px] tracking-[0.12em] text-slate-700 sm:text-[10px]"
      >

        <Activity className="h-3 w-3" />

        AI ASSISTED • DOCTOR VERIFIED

      </motion.div>

    </div>
  );
}

export default Welcome;