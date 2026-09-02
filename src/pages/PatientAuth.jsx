import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound,
  LogIn,
  UserPlus,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Mic,
  HeartPulse,
  CircleCheck,
  ChevronLeft,
} from "lucide-react";

import { createPatient, loginPatient } from "../services/api";

function PatientAuth({ onSuccess, onBack }) {
  const [mode, setMode] = useState("choose");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setError("Please enter your phone number or email");
      return;
    }

    try {
      setLoading(true);

      const result = await createPatient({
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
      });

      if (result.success) {
        onSuccess(result.patient);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!phone.trim() && !email.trim()) {
      setError("Please enter your phone number or email");
      return;
    }

    try {
      setLoading(true);

      const result = await loginPatient({
        phone: phone.trim() || null,
        email: email.trim() || null,
      });

      if (result.success) {
        onSuccess(result.patient);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (mode !== "choose") {
      setMode("choose");
      setError("");
      return;
    }

    if (onBack) {
      onBack();
    }
  };

  /* ============================================================
     CHOOSE MODE
  ============================================================ */

  if (mode === "choose") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

        {/* Background */}
        <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-250px] left-[-180px] h-[500px] w-[500px] rounded-full bg-teal-500/[0.06] blur-[140px]" />

        <div className="pointer-events-none absolute right-[-200px] top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[140px]" />

        {/* Grid */}
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
          className="absolute left-[10%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan-300"
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
          className="absolute right-[12%] top-[30%] h-1 w-1 rounded-full bg-teal-300"
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
          }}
          className="absolute bottom-[20%] left-[18%] h-1 w-1 rounded-full bg-sky-300"
        />


        {/* ======================================================
            HEADER
        ======================================================= */}

        <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-14">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08]">

              <HeartPulse className="h-6 w-6 text-cyan-300" />

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


          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-2 text-xs text-slate-400 sm:flex">

            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            />

            System Online

          </div>

        </header>


        {/* ======================================================
            MAIN
        ======================================================= */}

        <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-8 sm:px-8">

          <div className="w-full max-w-5xl">

            {/* Top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-[10px] font-medium tracking-[0.14em] text-cyan-300 sm:text-xs">

                <Sparkles className="h-3.5 w-3.5" />

                LET'S GET STARTED

              </div>


              <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">

                How would you like

                <br />

                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                  to continue?
                </span>

              </h1>


              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Choose an option below. You can speak naturally with
                MediKiosk during your health interview.
              </p>

            </motion.div>


            {/* ==================================================
                CHOICES
            =================================================== */}

            <div className="grid gap-5 md:grid-cols-2">


              {/* NEW PATIENT */}

              <motion.button
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                whileHover={{
                  y: -5,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={() => setMode("register")}
                className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.035] p-7 text-left backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.045] sm:p-9"
              >

                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-[70px] transition-all duration-500 group-hover:bg-cyan-400/[0.16]" />

                {/* Number */}
                <div className="absolute right-7 top-7 text-[10px] font-medium tracking-[0.2em] text-slate-700">
                  01
                </div>


                {/* Icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.07] text-cyan-300 transition-transform duration-300 group-hover:scale-105">

                  <UserPlus className="h-8 w-8" />

                </div>


                <div className="relative mt-8">

                  <p className="text-xs font-medium tracking-[0.12em] text-cyan-300/70">
                    FIRST VISIT
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold">
                    New Patient
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                    Create your profile and begin your health interview.
                  </p>

                </div>


                {/* Bottom */}
                <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between sm:bottom-9 sm:left-9 sm:right-9">

                  <div className="flex items-center gap-2 text-xs text-slate-600">

                    <Mic className="h-3.5 w-3.5 text-cyan-400/70" />

                    Voice supported

                  </div>


                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-300 text-slate-950 transition-transform duration-300 group-hover:translate-x-1">

                    <ArrowRight className="h-5 w-5" />

                  </div>

                </div>

              </motion.button>


              {/* EXISTING PATIENT */}

              <motion.button
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                whileHover={{
                  y: -5,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={() => setMode("login")}
                className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.035] p-7 text-left backdrop-blur-xl transition-all duration-300 hover:border-violet-300/30 hover:bg-violet-300/[0.045] sm:p-9"
              >

                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-400/[0.07] blur-[70px] transition-all duration-500 group-hover:bg-violet-400/[0.14]" />


                <div className="absolute right-7 top-7 text-[10px] font-medium tracking-[0.2em] text-slate-700">
                  02
                </div>


                {/* Icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-300/[0.07] text-violet-300 transition-transform duration-300 group-hover:scale-105">

                  <LogIn className="h-8 w-8" />

                </div>


                <div className="relative mt-8">

                  <p className="text-xs font-medium tracking-[0.12em] text-violet-300/70">
                    RETURNING VISITOR
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold">
                    Existing Patient
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                    Continue with your existing MediKiosk profile.
                  </p>

                </div>


                {/* Bottom */}
                <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between sm:bottom-9 sm:left-9 sm:right-9">

                  <div className="flex items-center gap-2 text-xs text-slate-600">

                    <ShieldCheck className="h-3.5 w-3.5 text-violet-400/70" />

                    Secure access

                  </div>


                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-300 text-slate-950 transition-transform duration-300 group-hover:translate-x-1">

                    <ArrowRight className="h-5 w-5" />

                  </div>

                </div>

              </motion.button>

            </div>


            {/* Bottom information */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-600"
            >

              <div className="flex items-center gap-2">

                <CircleCheck className="h-3.5 w-3.5 text-emerald-400/70" />

                Consent first

              </div>

              <div className="flex items-center gap-2">

                <CircleCheck className="h-3.5 w-3.5 text-cyan-400/70" />

                Voice enabled

              </div>

              <div className="flex items-center gap-2">

                <CircleCheck className="h-3.5 w-3.5 text-teal-400/70" />

                Multilingual

              </div>

            </motion.div>

          </div>

        </main>


        {/* Footer */}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[9px] tracking-[0.12em] text-slate-700 sm:text-[10px]">

          <HeartPulse className="h-3 w-3" />

          AI ASSISTED • DOCTOR VERIFIED

        </div>

      </div>
    );
  }


  /* ============================================================
     REGISTER / LOGIN
  ============================================================ */

  const isRegister = mode === "register";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* Background */}

      <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-teal-500/[0.06] blur-[130px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />


      {/* Header */}

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-14">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07]">

            <HeartPulse className="h-5 w-5 text-cyan-300" />

          </div>

          <div>

            <p className="text-sm font-bold tracking-[0.2em]">
              MEDIKIOSK
            </p>

            <p className="text-[8px] tracking-[0.18em] text-slate-600">
              PATIENT ACCESS
            </p>

          </div>

        </div>


        <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">

          <ShieldCheck className="h-4 w-4 text-emerald-400/70" />

          Secure session

        </div>

      </header>


      {/* Main */}

      <main className="relative z-10 flex min-h-[calc(100vh-85px)] items-center justify-center px-5 py-8">

        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">


          {/* LEFT INFO */}

          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="hidden lg:block"
          >

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-2 text-[10px] tracking-[0.13em] text-cyan-300">

              <Sparkles className="h-3.5 w-3.5" />

              {isRegister ? "NEW PATIENT" : "WELCOME BACK"}

            </div>


            <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-[-0.04em]">

              {isRegister ? (
                <>
                  Let's create your
                  <br />
                  <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    health profile.
                  </span>
                </>
              ) : (
                <>
                  Welcome
                  <br />
                  <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                    back.
                  </span>
                </>
              )}

            </h1>


            <p className="mt-6 max-w-md text-base leading-7 text-slate-500">

              {isRegister
                ? "A few basic details are all we need. Your health interview will happen through simple conversation."
                : "Enter one of your registered details to continue your MediKiosk health interview."}

            </p>


            {/* Visual steps */}

            <div className="mt-9 space-y-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/[0.07]">

                  <UserRound className="h-4 w-4 text-cyan-300" />

                </div>

                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Patient profile
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Basic information
                  </p>

                </div>

              </div>


              <div className="ml-4 h-5 border-l border-dashed border-white/10" />


              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-300/[0.07]">

                  <Mic className="h-4 w-4 text-teal-300" />

                </div>

                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Voice interview
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Speak naturally
                  </p>

                </div>

              </div>


              <div className="ml-4 h-5 border-l border-dashed border-white/10" />


              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/[0.07]">

                  <ShieldCheck className="h-4 w-4 text-emerald-300" />

                </div>

                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Doctor review
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Structured history
                  </p>

                </div>

              </div>

            </div>

          </motion.div>


          {/* FORM */}

          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="mx-auto w-full max-w-xl"
          >

            {/* Back */}

            <button
              onClick={goBack}
              className="mb-5 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >

              <ChevronLeft className="h-4 w-4" />

              Back

            </button>


            <div className="rounded-[2rem] border border-white/[0.09] bg-white/[0.035] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

              {/* Form header */}

              <div className="flex items-center gap-4">

                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(34,211,238,0.03)",
                      "0 0 35px rgba(34,211,238,0.10)",
                      "0 0 20px rgba(34,211,238,0.03)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07]"
                >

                  {isRegister ? (
                    <UserPlus className="h-6 w-6 text-cyan-300" />
                  ) : (
                    <LogIn className="h-6 w-6 text-cyan-300" />
                  )}

                </motion.div>


                <div>

                  <p className="text-[10px] font-medium tracking-[0.15em] text-cyan-300/70">

                    {isRegister
                      ? "CREATE PROFILE"
                      : "PATIENT LOGIN"}

                  </p>

                  <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">

                    {isRegister
                      ? "Tell us about you"
                      : "Continue your journey"}

                  </h2>

                </div>

              </div>


              {/* Divider */}

              <div className="my-7 h-px bg-white/[0.06]" />


              {/* REGISTER NAME */}

              <AnimatePresence initial={false}>

                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="mb-5 overflow-hidden"
                  >

                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      Your name
                    </label>

                    <div className="relative">

                      <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-2xl border border-white/[0.08] bg-[#07111f]/80 py-4 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:bg-[#07111f]"
                      />

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>


              {/* PHONE */}

              <div className="mb-5">

                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Phone number
                </label>

                <div className="relative">

                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-white/[0.08] bg-[#07111f]/80 py-4 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:bg-[#07111f]"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="mb-6">

                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Email address
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/[0.08] bg-[#07111f]/80 py-4 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:bg-[#07111f]"
                  />

                </div>

              </div>


              {/* INFO */}

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-cyan-300/[0.08] bg-cyan-300/[0.025] p-4">

                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/70" />

                <p className="text-[11px] leading-5 text-slate-600">

                  {isRegister
                    ? "Use your phone number or email. You can provide either one or both."
                    : "Use the phone number or email associated with your MediKiosk profile."}

                </p>

              </div>


              {/* ERROR */}

              <AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-4 text-sm text-red-300"
                  >

                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]" />

                    {error}

                  </motion.div>
                )}

              </AnimatePresence>


              {/* SUBMIT */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={isRegister ? handleRegister : handleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-between rounded-2xl bg-cyan-300 px-5 py-4 font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.10)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/10">

                    {loading ? (
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 rounded-full border-2 border-slate-950/30 border-t-slate-950"
                      />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}

                  </div>

                  <div className="text-left">

                    <p className="text-sm font-bold">

                      {loading
                        ? "Please wait..."
                        : isRegister
                          ? "Create Patient Profile"
                          : "Continue"}

                    </p>

                    {!loading && (
                      <p className="text-[10px] font-medium text-slate-800/60">
                        {isRegister
                          ? "Next: choose your language"
                          : "Continue to your interview"}
                      </p>
                    )}

                  </div>

                </div>


                {!loading && (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                )}

              </motion.button>


              {/* TRUST */}

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] tracking-[0.08em] text-slate-700">

                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/60" />

                YOUR INFORMATION IS SECURELY STORED

              </div>

            </div>


            {/* Bottom note */}

            <div className="mt-5 text-center text-[10px] tracking-[0.08em] text-slate-700">

              YOU'LL BE ABLE TO ANSWER USING YOUR VOICE

            </div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}

export default PatientAuth;