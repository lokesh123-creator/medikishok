import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

function Welcome({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">

      {/* Background glow */}
      <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[-100px] h-[450px] w-[450px] rounded-full bg-teal-500/10 blur-[120px]" />

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-14">

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

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          System Online
        </div>

      </header>


      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-300">
              <Sparkles className="h-4 w-4" />
              AI-POWERED PATIENT INTERVIEW
            </div>

            <h2 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">

              Your health.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-300 bg-clip-text text-transparent">
                Your language.
              </span>

              <br />

              Your voice.

            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              MediKiosk helps patients share their health history naturally
              through voice while AI organizes the information for clinicians.
            </p>


            {/* CTA */}
            <button
              onClick={onStart}
              className="group mt-9 flex items-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.2)] transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300"
            >

              Begin Health Interview

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

            </button>


            {/* Trust indicators */}
            <div className="mt-9 flex flex-wrap gap-5 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Consent First
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                Multilingual
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                Voice Enabled
              </div>

            </div>

          </motion.div>


          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex justify-center"
          >

            {/* Outer glow */}
            <div className="absolute h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />


            {/* AI orb */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-80 w-80 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-teal-400/10 shadow-[inset_0_0_80px_rgba(34,211,238,0.08)]"
            >

              {/* Rings */}
              <div className="absolute h-64 w-64 rounded-full border border-cyan-400/10" />
              <div className="absolute h-52 w-52 rounded-full border border-teal-400/10" />

              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.18)]">

                <HeartPulse className="h-14 w-14 text-cyan-300" />

              </div>

            </motion.div>


            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    AI Interview Ready
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Voice interaction enabled
                  </p>
                </div>

              </div>

            </motion.div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}

export default Welcome;