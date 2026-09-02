import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CircleStop,
  Clock3,
  FileText,
  HeartPulse,
  Languages,
  Mic,
  ShieldCheck,
  Sparkles,
  Volume2,
  Waves,
  Wifi,
  AlertTriangle,
} from "lucide-react";

import {
  transcribeAudio,
  generateNextQuestion,
  createConsultation,
  saveConsultationAnswer,
  textToSpeech,
} from "../services/api";

function Interview({
  language,
  consultationType,
  patientId,
  onBack,
}) {
  // --------------------------------------------------
  // Language
  // --------------------------------------------------

  const translations = {
    te: {
      languageName: "తెలుగు",
      back: "వెనక్కి",
      listening: "వింటున్నాను...",
      processing: "మీ సమాధానాన్ని అర్థం చేసుకుంటున్నాను...",
      speaking: "ప్రశ్న చెబుతున్నాను...",
      ready: "మీ సమాధానం చెప్పండి",
      answer: "మాట్లాడటానికి నొక్కండి",
      stop: "ఆపడానికి నొక్కండి",
      aiQuestion: "AI ప్రశ్న",
      playQuestion: "ప్రశ్న వినండి",
      extracted: "సేకరించిన సమాచారం",
      captured: "ఇప్పటివరకు సేకరించిన వివరాలు",
      chiefComplaint: "ప్రధాన సమస్య",
      duration: "వ్యవధి",
      symptoms: "లక్షణాలు",
      severity: "తీవ్రత",
      onset: "ప్రారంభం",
      appetite: "ఆకలి",
      bowelHabits: "మల విసర్జన",
      sleep: "నిద్ర",
      nextQuestion: "తదుపరి అడాప్టివ్ ప్రశ్న",
      aiPipeline: "AI Pipeline",
      speechCapture: "Speech Capture",
      sarvamSTT: "Sarvam STT",
      clinicalExtraction: "Clinical Extraction",
      questionEngine: "Question Engine",
      groqLLM: "Groq LLM",
      sarvamTTS: "Sarvam TTS",
      connected: "AI సేవలు కనెక్ట్ అయ్యాయి",
      starting: "ఇంటర్వ్యూ ప్రారంభమవుతోంది...",
      noAnswer:
        "స్పష్టమైన సమాధానం వినబడలేదు. మళ్లీ ప్రయత్నించండి.",
      micError:
        "మైక్రోఫోన్‌ను యాక్సెస్ చేయలేకపోయాము.",
      processingError:
        "సమాధానాన్ని ప్రాసెస్ చేయడంలో సమస్య వచ్చింది.",
      clinical: "Clinical History",
      ayurveda: "Ayurveda Case Taking",
      transcript: "మీ సమాధానం",
      noInformation: "ఇంకా సమాచారం లేదు",
      redFlag: "ముఖ్యమైన హెచ్చరిక",
    },

    hi: {
      languageName: "हिन्दी",
      back: "वापस",
      listening: "सुन रहा हूँ...",
      processing: "आपके उत्तर को समझ रहा हूँ...",
      speaking: "प्रश्न बोल रहा हूँ...",
      ready: "अपना उत्तर बताइए",
      answer: "बोलने के लिए दबाएँ",
      stop: "रोकने के लिए दबाएँ",
      aiQuestion: "AI प्रश्न",
      playQuestion: "प्रश्न सुनें",
      extracted: "एकत्रित जानकारी",
      captured: "अब तक एकत्रित विवरण",
      chiefComplaint: "मुख्य समस्या",
      duration: "अवधि",
      symptoms: "लक्षण",
      severity: "गंभीरता",
      onset: "शुरुआत",
      appetite: "भूख",
      bowelHabits: "मल त्याग",
      sleep: "नींद",
      nextQuestion: "अगला अनुकूली प्रश्न",
      aiPipeline: "AI Pipeline",
      speechCapture: "Speech Capture",
      sarvamSTT: "Sarvam STT",
      clinicalExtraction: "Clinical Extraction",
      questionEngine: "Question Engine",
      groqLLM: "Groq LLM",
      sarvamTTS: "Sarvam TTS",
      connected: "AI सेवाएँ कनेक्ट हैं",
      starting: "इंटरव्यू शुरू हो रहा है...",
      noAnswer:
        "स्पष्ट उत्तर नहीं मिला। कृपया फिर से प्रयास करें।",
      micError:
        "माइक्रोफ़ोन एक्सेस नहीं हो सका।",
      processingError:
        "उत्तर को प्रोसेस करने में समस्या हुई।",
      clinical: "Clinical History",
      ayurveda: "Ayurveda Case Taking",
      transcript: "आपका उत्तर",
      noInformation: "अभी कोई जानकारी नहीं",
      redFlag: "महत्वपूर्ण चेतावनी",
    },

    en: {
      languageName: "English",
      back: "Back",
      listening: "Listening...",
      processing: "Understanding your answer...",
      speaking: "Speaking question...",
      ready: "Tell me your answer",
      answer: "Tap to speak",
      stop: "Tap to stop",
      aiQuestion: "AI QUESTION",
      playQuestion: "Play question",
      extracted: "Extracted Information",
      captured: "Details captured so far",
      chiefComplaint: "Chief Complaint",
      duration: "Duration",
      symptoms: "Symptoms",
      severity: "Severity",
      onset: "Onset",
      appetite: "Appetite",
      bowelHabits: "Bowel Habits",
      sleep: "Sleep",
      nextQuestion: "NEXT ADAPTIVE QUESTION",
      aiPipeline: "AI Pipeline",
      speechCapture: "Speech Capture",
      sarvamSTT: "Sarvam STT",
      clinicalExtraction: "Clinical Extraction",
      questionEngine: "Question Engine",
      groqLLM: "Groq LLM",
      sarvamTTS: "Sarvam TTS",
      connected: "AI services connected",
      starting: "Starting interview...",
      noAnswer:
        "I couldn't hear a clear answer. Please try again.",
      micError:
        "Could not access the microphone.",
      processingError:
        "There was a problem processing your answer.",
      clinical: "Clinical History",
      ayurveda: "Ayurveda Case Taking",
      transcript: "Your Answer",
      noInformation: "No information yet",
      redFlag: "Important Alert",
    },
  };

  const d = translations[language] || translations.en;

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [status, setStatus] = useState("ready");

  const [question, setQuestion] = useState(
    language === "te"
      ? "మీకు ప్రస్తుతం ప్రధానంగా ఏ సమస్య ఉంది?"
      : language === "hi"
      ? "आपको अभी मुख्य रूप से क्या समस्या है?"
      : "What is the main problem you are experiencing?"
  );

  const [transcript, setTranscript] = useState("");

  const [nextQuestion, setNextQuestion] = useState("");

  const [showNextQuestion, setShowNextQuestion] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);

  // MongoDB consultation ID
  const [consultationId, setConsultationId] =
    useState(null);

  const [databaseSaving, setDatabaseSaving] =
    useState(false);

  // --------------------------------------------------
  // Create MongoDB consultation
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const initializeConsultation = async () => {
      if (!patientId) {
        setError(
          language === "te"
            ? "Patient ID అందుబాటులో లేదు."
            : language === "hi"
            ? "Patient ID उपलब्ध नहीं है।"
            : "Patient ID is missing."
        );
        return;
      }

      try {
        setError("");

        const result = await createConsultation({
          patientId,
          language,
          consultationType,
        });

        if (!cancelled && result?.consultation_id) {
          setConsultationId(
            result.consultation_id
          );

          console.log(
            "✅ MongoDB consultation created:",
            result.consultation_id
          );
        }
      } catch (err) {
        console.error(
          "Consultation creation error:",
          err
        );

        if (!cancelled) {
          setError(
            err?.message ||
              (language === "te"
                ? "ఇంటర్వ్యూ ప్రారంభించడంలో సమస్య వచ్చింది."
                : language === "hi"
                ? "इंटरव्यू शुरू करने में समस्या हुई।"
                : "There was a problem starting the interview.")
          );
        }
      }
    };

    initializeConsultation();

    return () => {
      cancelled = true;
    };
  }, [
    patientId,
    language,
    consultationType,
  ]);

  // --------------------------------------------------
  // Structured AI extracted information
  // --------------------------------------------------

  const [extracted, setExtracted] = useState({
    chiefComplaint: "—",
    duration: "—",
    symptoms: [],
    severity: null,
    onset: null,
    aggravatingFactors: [],
    relievingFactors: [],
    appetite: null,
    bowelHabits: null,
    sleep: null,
    redFlag: false,
  });

  // --------------------------------------------------
  // Refs
  // --------------------------------------------------

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  const streamRef = useRef(null);

  // --------------------------------------------------
  // TTS audio ref
  // --------------------------------------------------

  const audioRef = useRef(null);

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        if (
          mediaRecorderRef.current.state !==
          "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------
  // Status text
  // --------------------------------------------------

  const statusText = {
    ready: d.ready,
    listening: d.listening,
    thinking: d.processing,
    speaking: d.speaking,
  };

  // --------------------------------------------------
  // Sarvam TTS
  // --------------------------------------------------

  const speakText = async (text) => {
    if (!text?.trim()) {
      return;
    }

    try {
      setError("");
      setStatus("speaking");

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      const audioUrl = await textToSpeech(
        text,
        language
      );

      if (!audioUrl) {
        throw new Error(
          "No audio received from Sarvam TTS."
        );
      }

      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        setStatus("ready");

        URL.revokeObjectURL(audioUrl);

        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      audio.onerror = () => {
        console.error(
          "Sarvam TTS playback error"
        );

        setStatus("ready");

        URL.revokeObjectURL(audioUrl);

        if (audioRef.current === audio) {
          audioRef.current = null;
        }

        setError(
          language === "te"
            ? "ప్రశ్నను వినిపించడంలో సమస్య వచ్చింది."
            : language === "hi"
            ? "प्रश्न सुनाने में समस्या हुई।"
            : "There was a problem playing the question."
        );
      };

      await audio.play();
    } catch (err) {
      console.error(
        "Sarvam TTS error:",
        err
      );

      setStatus("ready");

      setError(
        language === "te"
          ? "ప్రశ్నను వినిపించడంలో సమస్య వచ్చింది."
          : language === "hi"
          ? "प्रश्न सुनाने में समस्या हुई।"
          : "There was a problem playing the question."
      );
    }
  };

  // --------------------------------------------------
  // Play current question
  // --------------------------------------------------

  const playQuestion = () => {
    speakText(question);
  };

  // --------------------------------------------------
  // Start recording
  // --------------------------------------------------

  const startListening = async () => {
    try {
      setError("");
      setTranscript("");
      setShowNextQuestion(false);

      // Make sure MongoDB consultation exists
      if (!consultationId) {
        setError(
          language === "te"
            ? "ఇంటర్వ్యూ సెషన్ ఇంకా ప్రారంభం కాలేదు. దయచేసి కొద్దిసేపటి తర్వాత ప్రయత్నించండి."
            : language === "hi"
            ? "इंटरव्यू सेशन अभी शुरू नहीं हुआ है। कृपया कुछ देर बाद प्रयास करें।"
            : "The interview session is not ready yet. Please try again in a moment."
        );
        return;
      }

      // Stop TTS before listening
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      audioChunksRef.current = [];

      let options = {};

      if (
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
      ) {
        options = {
          mimeType: "audio/webm;codecs=opus",
        };
      } else if (
        MediaRecorder.isTypeSupported("audio/webm")
      ) {
        options = {
          mimeType: "audio/webm",
        };
      }

      const recorder = new MediaRecorder(
        stream,
        options
      );

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = async () => {
        const mimeType =
          recorder.mimeType || "audio/webm";

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: mimeType,
          }
        );

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        streamRef.current = null;

        await processAnswer(audioBlob);
      };

      recorder.start();

      setIsListening(true);
      setStatus("listening");
    } catch (err) {
      console.error(
        "Microphone error:",
        err
      );

      setIsListening(false);
      setStatus("ready");
      setError(d.micError);
    }
  };

  // --------------------------------------------------
  // Stop recording
  // --------------------------------------------------

  const stopListening = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    setIsListening(false);
  };

  // --------------------------------------------------
  // Merge AI extracted information
  // --------------------------------------------------

  const mergeExtractedInformation = (
    aiExtracted
  ) => {
    if (!aiExtracted) {
      return;
    }

    setExtracted((previous) => ({
      chiefComplaint:
        aiExtracted.chief_complaint ||
        previous.chiefComplaint,

      duration:
        aiExtracted.duration ||
        previous.duration,

      symptoms:
        aiExtracted.symptoms?.length > 0
          ? aiExtracted.symptoms
          : previous.symptoms,

      severity:
        aiExtracted.severity ||
        previous.severity,

      onset:
        aiExtracted.onset ||
        previous.onset,

      aggravatingFactors:
        aiExtracted.aggravating_factors?.length >
        0
          ? aiExtracted.aggravating_factors
          : previous.aggravatingFactors,

      relievingFactors:
        aiExtracted.relieving_factors?.length >
        0
          ? aiExtracted.relieving_factors
          : previous.relievingFactors,

      appetite:
        aiExtracted.appetite ||
        previous.appetite,

      bowelHabits:
        aiExtracted.bowel_habits ||
        previous.bowelHabits,

      sleep:
        aiExtracted.sleep ||
        previous.sleep,

      redFlag:
        aiExtracted.red_flag ??
        previous.redFlag,
    }));
  };

  // --------------------------------------------------
  // Process voice answer
  // --------------------------------------------------

  const processAnswer = async (audioBlob) => {
    try {
      setError("");
      setStatus("thinking");

      // ----------------------------------------------
      // 1. Sarvam STT
      // ----------------------------------------------

      const sttResult =
        await transcribeAudio(
          audioBlob,
          language
        );

      const patientText =
        sttResult?.transcript?.trim() || "";

      if (!patientText) {
        setError(d.noAnswer);
        setStatus("ready");
        return;
      }

      setTranscript(patientText);

      // ----------------------------------------------
      // 2. Save current conversation in frontend
      // ----------------------------------------------

      const currentTurn = {
        question: question,
        answer: patientText,
      };

      const updatedHistory = [
        ...history,
        currentTurn,
      ];

      setHistory(updatedHistory);

      // ----------------------------------------------
      // 3. Send answer to Groq
      // ----------------------------------------------

      const aiResult =
        await generateNextQuestion({
          language,
          consultationType,
          answer: patientText,
          history: updatedHistory,
        });

      const generatedQuestion =
        aiResult?.next_question?.trim();

      if (!generatedQuestion) {
        throw new Error(
          "AI did not return a next question."
        );
      }

      // ----------------------------------------------
      // 4. Update structured AI extraction
      // ----------------------------------------------

      mergeExtractedInformation(
        aiResult?.extracted
      );

      // ----------------------------------------------
      // 5. Red flag
      // ----------------------------------------------

      if (
        aiResult?.red_flag === true
      ) {
        console.warn(
          "Potential red flag detected:",
          aiResult
        );
      }

      // ----------------------------------------------
      // 6. Save answer + AI extraction to MongoDB
      // ----------------------------------------------

      if (consultationId) {
        try {
          setDatabaseSaving(true);

          await saveConsultationAnswer({
            consultationId,
            question,
            answer: patientText,
            extracted:
              aiResult?.extracted || {},
            redFlag:
              aiResult?.red_flag === true,
          });

          console.log(
            "✅ Consultation answer saved to MongoDB"
          );
        } catch (dbError) {
          console.error(
            "MongoDB answer save error:",
            dbError
          );

          // Do not stop the interview if database
          // saving fails after AI processing succeeds.
          setError(
            language === "te"
              ? "సమాధానం AI ద్వారా ప్రాసెస్ అయింది, కానీ డేటాబేస్‌లో సేవ్ చేయడంలో సమస్య వచ్చింది."
              : language === "hi"
              ? "उत्तर AI द्वारा प्रोसेस हो गया, लेकिन डेटाबेस में सेव करने में समस्या हुई।"
              : "The answer was processed by AI, but there was a problem saving it to the database."
          );
        } finally {
          setDatabaseSaving(false);
        }
      }

      // ----------------------------------------------
      // 7. Display next question
      // ----------------------------------------------

      setNextQuestion(
        generatedQuestion
      );

      setQuestion(
        generatedQuestion
      );

      setShowNextQuestion(true);

      // ----------------------------------------------
      // 8. Speak using Sarvam TTS
      // ----------------------------------------------

      setTimeout(() => {
        speakText(generatedQuestion);
      }, 400);
    } catch (err) {
      console.error(
        "Interview processing error:",
        err
      );

      setError(
        err?.message ||
          d.processingError
      );

      setStatus("ready");
    }
  };

  // --------------------------------------------------
  // Consultation label
  // --------------------------------------------------

  const consultationLabel =
    consultationType === "ayurveda"
      ? d.ayurveda
      : d.clinical;

  // --------------------------------------------------
  // Helper: display arrays
  // --------------------------------------------------

  const renderArrayValue = (items) => {
    if (!items || items.length === 0) {
      return (
        <span className="text-slate-600">
          —
        </span>
      );
    }

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* Header */}

      <header className="border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">

            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>

              <div className="flex items-center gap-2">

                <HeartPulse className="h-5 w-5 text-cyan-400" />

                <h1 className="text-lg font-semibold">
                  MediKiosk
                </h1>

              </div>

              <p className="text-xs text-slate-500">
                AI Clinical History Assistant
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:flex">

              <Languages className="h-3.5 w-3.5 text-cyan-400" />

              {d.languageName}

            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-emerald-300 sm:flex">

              <Wifi className="h-3.5 w-3.5" />

              {d.connected}

            </div>

          </div>

        </div>

      </header>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Consultation badge */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
              AI PATIENT INTERVIEW
            </p>

            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              {consultationLabel}
            </h2>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-300">

            <ShieldCheck className="h-4 w-4" />

            AI-assisted history taking

          </div>

        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">

          {/* ================================================= */}
          {/* LEFT PANEL */}
          {/* ================================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            {/* Background glow */}

            <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.06] blur-3xl" />

            <div className="relative flex min-h-[650px] flex-col items-center">

              {/* Voice Orb */}

              <div className="relative mt-6 flex h-56 w-56 items-center justify-center">

                <motion.div
                  animate={
                    status === "listening"
                      ? {
                          scale: [1, 1.08, 1],
                          opacity: [
                            0.7,
                            1,
                            0.7,
                          ],
                        }
                      : status === "thinking"
                      ? {
                          rotate: 360,
                        }
                      : {
                          scale: [1, 1.03, 1],
                        }
                  }
                  transition={
                    status === "thinking"
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }
                      : {
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="relative flex h-48 w-48 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.12] via-slate-900 to-teal-400/[0.08]"
                >

                  <div className="absolute h-36 w-36 rounded-full border border-cyan-400/10" />

                  <div className="absolute h-28 w-28 rounded-full border border-teal-400/10" />

                  <motion.div
                    animate={
                      status === "listening"
                        ? {
                            scale: [
                              1,
                              1.15,
                              1,
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10"
                  >

                    {status === "thinking" ? (
                      <BrainCircuit className="h-10 w-10 animate-pulse text-cyan-300" />
                    ) : status === "speaking" ? (
                      <Volume2 className="h-10 w-10 animate-pulse text-cyan-300" />
                    ) : (
                      <Mic className="h-10 w-10 text-cyan-300" />
                    )}

                  </motion.div>

                </motion.div>

              </div>

              {/* Status */}

              <AnimatePresence mode="wait">

                <motion.div
                  key={status}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mt-2 text-center"
                >

                  <p className="text-lg font-medium">
                    {statusText[status]}
                  </p>

                  <p className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-600">

                    <Clock3 className="h-3 w-3" />

                    {consultationLabel}

                  </p>

                </motion.div>

              </AnimatePresence>

              {/* Error */}

              <AnimatePresence>

                {error && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="mt-5 flex max-w-xl items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                  >

                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>{error}</span>

                  </motion.div>

                )}

              </AnimatePresence>

              {/* Current question */}

              <motion.div
                layout
                className="mt-7 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center shadow-2xl backdrop-blur-xl"
              >

                <div className="mb-3 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-cyan-400">

                  <Sparkles className="h-3.5 w-3.5" />

                  {d.aiQuestion}

                </div>

                <p className="text-xl font-medium leading-8 text-slate-100 sm:text-2xl">
                  {question}
                </p>

                <button
                  onClick={playQuestion}
                  disabled={
                    status === "thinking" ||
                    status === "speaking"
                  }
                  className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <Volume2 className="h-4 w-4" />

                  {d.playQuestion}

                </button>

              </motion.div>

              {/* Transcript */}

              <AnimatePresence>

                {transcript && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 w-full max-w-2xl rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4"
                  >

                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-400">

                      <FileText className="h-3.5 w-3.5" />

                      {d.transcript}

                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {transcript}
                    </p>

                  </motion.div>

                )}

              </AnimatePresence>

              {/* Mic */}

              <div className="mt-7 flex flex-col items-center">

                <motion.button
                  whileTap={{
                    scale: 0.94,
                  }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  onClick={
                    isListening
                      ? stopListening
                      : startListening
                  }
                  disabled={
                    status === "thinking" ||
                    status === "speaking" ||
                    !consultationId
                  }
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                    isListening
                      ? "bg-red-500 shadow-[0_0_55px_rgba(239,68,68,0.3)]"
                      : "bg-cyan-400 shadow-[0_0_55px_rgba(34,211,238,0.25)]"
                  } ${
                    status === "thinking" ||
                    status === "speaking" ||
                    !consultationId
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >

                  {isListening ? (
                    <CircleStop className="h-8 w-8 text-white" />
                  ) : (
                    <Mic className="h-8 w-8 text-slate-950" />
                  )}

                </motion.button>

                <p className="mt-3 text-xs text-slate-500">

                  {isListening
                    ? d.stop
                    : databaseSaving
                    ? "Saving..."
                    : d.answer}

                </p>

              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* RIGHT PANEL */}
          {/* ================================================= */}

          <aside className="flex flex-col gap-4">

            {/* Extracted information */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">

                    <BrainCircuit className="h-4 w-4 text-cyan-300" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      {d.extracted}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      {d.captured}
                    </p>

                  </div>

                </div>

                <Check className="h-4 w-4 text-emerald-400" />

              </div>

              <div className="mt-5 space-y-3">

                {/* Chief complaint */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    {d.chiefComplaint}
                  </p>

                  <p className="mt-2 text-sm font-medium text-cyan-300">
                    {extracted.chiefComplaint}
                  </p>

                </div>

                {/* Duration */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    {d.duration}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {extracted.duration}
                  </p>

                </div>

                {/* Symptoms */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    {d.symptoms}
                  </p>

                  {renderArrayValue(
                    extracted.symptoms
                  )}

                </div>

                {/* Severity */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    {d.severity}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {extracted.severity ||
                      "—"}
                  </p>

                </div>

                {/* Onset */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    {d.onset}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {extracted.onset ||
                      "—"}
                  </p>

                </div>

                {/* Ayurveda information */}

                {consultationType ===
                  "ayurveda" && (
                  <>

                    {/* Appetite */}

                    <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                        {d.appetite}
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {extracted.appetite ||
                          "—"}
                      </p>

                    </div>

                    {/* Bowel habits */}

                    <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                        {d.bowelHabits}
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {extracted.bowelHabits ||
                          "—"}
                      </p>

                    </div>

                    {/* Sleep */}

                    <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                        {d.sleep}
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {extracted.sleep ||
                          "—"}
                      </p>

                    </div>

                  </>
                )}

                {/* Aggravating factors */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    Aggravating Factors
                  </p>

                  {renderArrayValue(
                    extracted.aggravatingFactors
                  )}

                </div>

                {/* Relieving factors */}

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    Relieving Factors
                  </p>

                  {renderArrayValue(
                    extracted.relievingFactors
                  )}

                </div>

              </div>

            </div>

            {/* Red Flag */}

            {history.length > 0 && (
              <div
                className={`rounded-3xl border p-5 ${
                  extracted.redFlag
                    ? "border-red-400/30 bg-red-400/5"
                    : "border-emerald-400/10 bg-emerald-400/[0.025]"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      extracted.redFlag
                        ? "bg-red-400/10"
                        : "bg-emerald-400/10"
                    }`}
                  >

                    <AlertTriangle
                      className={`h-4 w-4 ${
                        extracted.redFlag
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      {d.redFlag}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {extracted.redFlag
                        ? "Potentially important symptom detected. Doctor review recommended."
                        : "No potential red flag detected so far."}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Adaptive question */}

            <AnimatePresence>

              {showNextQuestion && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-5"
                >

                  <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-cyan-300">

                    <Sparkles className="h-3.5 w-3.5" />

                    {d.nextQuestion}

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {nextQuestion}
                  </p>

                  <button
                    onClick={() =>
                      speakText(nextQuestion)
                    }
                    disabled={
                      status === "speaking"
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Volume2 className="h-4 w-4" />

                    {d.playQuestion}

                  </button>

                </motion.div>

              )}

            </AnimatePresence>

            {/* AI Pipeline */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

              <div className="flex items-center gap-2">

                <Waves className="h-4 w-4 text-cyan-400" />

                <p className="text-sm font-semibold">
                  {d.aiPipeline}
                </p>

              </div>

              <div className="mt-5 space-y-4">

                {[
                  [
                    d.speechCapture,
                    true,
                  ],

                  [
                    d.sarvamSTT,
                    Boolean(transcript),
                  ],

                  [
                    d.clinicalExtraction,
                    Boolean(transcript),
                  ],

                  [
                    d.questionEngine,
                    Boolean(nextQuestion),
                  ],

                  [
                    d.groqLLM,
                    Boolean(nextQuestion),
                  ],

                  [
                    d.sarvamTTS,
                    status === "speaking",
                  ],
                ].map(
                  ([name, active]) => (

                    <div
                      key={name}
                      className="flex items-center gap-3"
                    >

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          active
                            ? "bg-emerald-400/10"
                            : "bg-white/5"
                        }`}
                      >

                        {active ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                        )}

                      </div>

                      <p
                        className={`text-xs ${
                          active
                            ? "text-slate-200"
                            : "text-slate-600"
                        }`}
                      >
                        {name}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Session information */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">

                  <ShieldCheck className="h-5 w-5 text-cyan-300" />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Secure AI Interview
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Information is collected for
                    clinical history preparation.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Interview;