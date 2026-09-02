
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CircleStop,
  FileText,
  HeartPulse,
  Languages,
  LockKeyhole,
  Mic,
  ShieldCheck,
  Sparkles,
  Volume2,
  Waves,
  Wifi,
  AlertTriangle,
  Activity,
} from "lucide-react";

import {
  transcribeAudio,
  generateNextQuestion,
  saveConsultationAnswer,
  textToSpeech,
  completeConsultation,
} from "../services/api";

export default function Interview({
  language,
  consultationType,
  patientId,
  consultationId,
  previousReportIds = [],
  onBack,
  onComplete,
}) {
  // ============================================================
  // TRANSLATIONS
  // ============================================================

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
      agni: "అగ్ని / జీర్ణశక్తి",
      bowelHabits: "మల విసర్జన",
      koshtha: "కోష్ఠం",
      sleep: "నిద్ర",
      nidra: "నిద్ర / Nidra",
      ahara: "ఆహారం / Ahara",
      vihara: "జీవనశైలి / Vihara",
      prakriti: "ప్రకృతి / Prakriti",
      vikriti: "వికృతి / Vikriti",
      dashavidha: "దశవిధ పరీక్ష",

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

      noRedFlag:
        "ఇప్పటివరకు ఎలాంటి ముఖ్యమైన హెచ్చరిక గుర్తించబడలేదు.",

      redFlagDetected:
        "ముఖ్యమైన లక్షణం గుర్తించబడింది. డాక్టర్ సమీక్ష అవసరం.",

      saving: "సేవ్ చేస్తోంది...",

      completedTitle: "ఇంటర్వ్యూ పూర్తయింది",

      completedMessage:
        "అవసరమైన వివరాలు సేకరించబడ్డాయి. డాక్టర్ సమీక్ష కోసం చరిత్ర సిద్ధంగా ఉంది.",
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
      agni: "अग्नि / पाचन",
      bowelHabits: "मल त्याग",
      koshtha: "कोष्ठ",
      sleep: "नींद",
      nidra: "नींद / Nidra",
      ahara: "आहार / Ahara",
      vihara: "जीवनशैली / Vihara",
      prakriti: "प्रकृति / Prakriti",
      vikriti: "विकृति / Vikriti",
      dashavidha: "दशविध परीक्षा",

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

      noRedFlag:
        "अभी तक कोई महत्वपूर्ण चेतावनी नहीं मिली।",

      redFlagDetected:
        "महत्वपूर्ण लक्षण मिला। डॉक्टर की समीक्षा आवश्यक है।",

      saving: "सेव हो रहा है...",

      completedTitle: "इंटरव्यू पूरा हुआ",

      completedMessage:
        "आवश्यक जानकारी एकत्र कर ली गई है। डॉक्टर की समीक्षा के लिए इतिहास तैयार है।",
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
      agni: "Agni / Digestion",
      bowelHabits: "Bowel Habits",
      koshtha: "Koshtha",
      sleep: "Sleep",
      nidra: "Nidra / Sleep",
      ahara: "Ahara / Diet",
      vihara: "Vihara / Lifestyle",
      prakriti: "Prakriti",
      vikriti: "Vikriti",
      dashavidha: "Dashavidha Pariksha",

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

      noRedFlag:
        "No potential red flag detected so far.",

      redFlagDetected:
        "Potentially important symptom detected. Doctor review recommended.",

      saving: "Saving...",

      completedTitle: "Interview completed",

      completedMessage:
        "The required history has been collected and is ready for doctor review.",
    },
  };

  const d = translations[language] || translations.en;

  // ============================================================
  // INITIAL QUESTION
  // ============================================================

  const initialQuestion =
    language === "te"
      ? "మీకు ప్రస్తుతం ప్రధానంగా ఏ సమస్య ఉంది?"
      : language === "hi"
      ? "आपको अभी मुख्य रूप से क्या समस्या है?"
      : "What is the main problem you are experiencing?";

  // ============================================================
  // STATE
  // ============================================================

  const [status, setStatus] = useState("ready");

  const [question, setQuestion] =
    useState(initialQuestion);

  const [transcript, setTranscript] =
    useState("");

  const [nextQuestion, setNextQuestion] =
    useState("");

  const [nextCategory, setNextCategory] =
    useState("");

  const [showNextQuestion, setShowNextQuestion] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [error, setError] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [databaseSaving, setDatabaseSaving] =
    useState(false);

  const [interviewCompleted, setInterviewCompleted] =
    useState(false);

  const [isCompleting, setIsCompleting] =
    useState(false);

  // ============================================================
  // EXTRACTION
  // ============================================================

  const [extracted, setExtracted] =
    useState({
      chiefComplaint: "—",
      duration: "—",

      symptoms: [],

      severity: null,
      onset: null,

      aggravatingFactors: [],
      relievingFactors: [],

      appetite: null,
      agni: null,
      bowelHabits: null,
      koshtha: null,
      sleep: null,
      nidra: null,
      ahara: null,
      vihara: null,
      prakriti: null,
      vikriti: null,

      dashavidhaPariksha: {},

      redFlag: false,
    });

  // ============================================================
  // REFS
  // ============================================================

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const streamRef =
    useRef(null);

  const audioRef =
    useRef(null);

  // ============================================================
  // CONSULTATION VALIDATION
  // ============================================================

  useEffect(() => {
    if (!consultationId) {
      setError(
        language === "te"
          ? "ఇంటర్వ్యూ సెషన్ అందుబాటులో లేదు. దయచేసి మళ్లీ ప్రయత్నించండి."
          : language === "hi"
          ? "इंटरव्यू सेशन उपलब्ध नहीं है। कृपया फिर से प्रयास करें।"
          : "Interview session is not available. Please try again."
      );

      return;
    }

    setError("");

    console.log(
      "======================================"
    );

    console.log(
      "🩺 INTERVIEW SESSION"
    );

    console.log(
      "Consultation ID:",
      consultationId
    );

    console.log(
      "Patient ID:",
      patientId
    );

    console.log(
      "Language:",
      language
    );

    console.log(
      "Consultation Type:",
      consultationType
    );

    console.log(
      "Previous Report IDs:",
      previousReportIds
    );

    console.log(
      "======================================"
    );
  }, [
    consultationId,
    patientId,
    language,
    consultationType,
    previousReportIds,
  ]);

  // ============================================================
  // CLEANUP
  // ============================================================

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
          .forEach((track) =>
            track.stop()
          );
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        if (audioRef.current.src) {
          URL.revokeObjectURL(
            audioRef.current.src
          );
        }

        audioRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // STATUS
  // ============================================================

  const statusText = {
    ready: d.ready,
    listening: d.listening,
    thinking: d.processing,
    speaking: d.speaking,
  };

  // ============================================================
  // STOP CURRENT AUDIO
  // ============================================================

  const stopCurrentAudio = () => {
    if (!audioRef.current) {
      return;
    }

    const currentAudio =
      audioRef.current;

    currentAudio.pause();
    currentAudio.currentTime = 0;

    if (currentAudio.src) {
      URL.revokeObjectURL(
        currentAudio.src
      );
    }

    audioRef.current = null;
  };

  // ============================================================
  // SPEAK
  // ============================================================

  const speakText = async (text) => {
    if (
      !text?.trim() ||
      interviewCompleted
    ) {
      return;
    }

    try {
      setError("");
      setStatus("speaking");

      stopCurrentAudio();

      const audioUrl =
        await textToSpeech(
          text,
          language
        );

      if (!audioUrl) {
        throw new Error(
          "No audio received from Sarvam TTS."
        );
      }

      const audio =
        new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        setStatus("ready");

        URL.revokeObjectURL(
          audioUrl
        );

        if (
          audioRef.current === audio
        ) {
          audioRef.current = null;
        }
      };

      audio.onerror = () => {
        console.error(
          "Sarvam TTS playback error"
        );

        setStatus("ready");

        URL.revokeObjectURL(
          audioUrl
        );

        if (
          audioRef.current === audio
        ) {
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

  // ============================================================
  // PLAY QUESTION
  // ============================================================

  const playQuestion = () => {
    if (
      status === "thinking" ||
      status === "speaking" ||
      interviewCompleted
    ) {
      return;
    }

    speakText(question);
  };

  // ============================================================
  // START LISTENING
  // ============================================================

  const startListening =
    async () => {
      try {
        setError("");
        setTranscript("");
        setShowNextQuestion(false);

        if (
          interviewCompleted ||
          isCompleting
        ) {
          return;
        }

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

        // ======================================================
        // STOP TTS
        // ======================================================

        stopCurrentAudio();

        // ======================================================
        // MICROPHONE CHECK
        // ======================================================

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "Microphone is not supported by this browser."
          );
        }

        // ======================================================
        // GET MICROPHONE
        // ======================================================

        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

        streamRef.current =
          stream;

        audioChunksRef.current =
          [];

        // ======================================================
        // RECORDER FORMAT
        // ======================================================

        let options = {};

        if (
          MediaRecorder.isTypeSupported(
            "audio/webm;codecs=opus"
          )
        ) {
          options = {
            mimeType:
              "audio/webm;codecs=opus",
          };
        } else if (
          MediaRecorder.isTypeSupported(
            "audio/webm"
          )
        ) {
          options = {
            mimeType:
              "audio/webm",
          };
        }

        // ======================================================
        // MEDIA RECORDER
        // ======================================================

        const recorder =
          new MediaRecorder(
            stream,
            options
          );

        mediaRecorderRef.current =
          recorder;

        recorder.ondataavailable =
          (event) => {
            if (
              event.data &&
              event.data.size > 0
            ) {
              audioChunksRef.current.push(
                event.data
              );
            }
          };

        // ======================================================
        // RECORDER STOP
        // ======================================================

        recorder.onstop =
          async () => {
            try {
              const mimeType =
                recorder.mimeType ||
                "audio/webm";

              const audioBlob =
                new Blob(
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

              if (
                streamRef.current ===
                stream
              ) {
                streamRef.current =
                  null;
              }

              if (
                mediaRecorderRef.current ===
                recorder
              ) {
                mediaRecorderRef.current =
                  null;
              }

              if (
                audioBlob.size === 0
              ) {
                throw new Error(
                  d.noAnswer
                );
              }

              await processAnswer(
                audioBlob
              );
            } catch (err) {
              console.error(
                "Recorder processing error:",
                err
              );

              setIsListening(false);
              setStatus("ready");

              setError(
                err?.message ||
                  d.processingError
              );
            }
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

        setError(
          d.micError
        );
      }
    };

  // ============================================================
  // STOP LISTENING
  // ============================================================

  const stopListening = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state !==
      "inactive"
    ) {
      recorder.stop();
    }

    setIsListening(false);
  };

  // ============================================================
  // VALUE HELPERS
  // ============================================================

  const hasValue = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return false;
    }

    if (
      typeof value === "string" &&
      !value.trim()
    ) {
      return false;
    }

    if (
      Array.isArray(value) &&
      value.length === 0
    ) {
      return false;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return false;
    }

    return true;
  };

  const mergeArrays = (
    previous,
    incoming
  ) => {
    const previousArray =
      Array.isArray(previous)
        ? previous
        : [];

    const incomingArray =
      Array.isArray(incoming)
        ? incoming
        : [];

    return [
      ...new Set([
        ...previousArray,
        ...incomingArray,
      ]),
    ];
  };

  // ============================================================
  // MERGE EXTRACTION
  // ============================================================

  const mergeExtractedInformation = (
    aiExtracted,
    aiRedFlag = false
  ) => {
    if (!aiExtracted) {
      return;
    }

    setExtracted((previous) => ({
      chiefComplaint:
        hasValue(
          aiExtracted.chief_complaint
        )
          ? aiExtracted.chief_complaint
          : previous.chiefComplaint,

      duration:
        hasValue(
          aiExtracted.duration
        )
          ? aiExtracted.duration
          : previous.duration,

      symptoms:
        mergeArrays(
          previous.symptoms,
          aiExtracted.symptoms
        ),

      severity:
        hasValue(
          aiExtracted.severity
        )
          ? aiExtracted.severity
          : previous.severity,

      onset:
        hasValue(
          aiExtracted.onset
        )
          ? aiExtracted.onset
          : previous.onset,

      aggravatingFactors:
        mergeArrays(
          previous.aggravatingFactors,
          aiExtracted.aggravating_factors
        ),

      relievingFactors:
        mergeArrays(
          previous.relievingFactors,
          aiExtracted.relieving_factors
        ),

      appetite:
        hasValue(
          aiExtracted.appetite
        )
          ? aiExtracted.appetite
          : previous.appetite,

      agni:
        hasValue(
          aiExtracted.agni
        )
          ? aiExtracted.agni
          : previous.agni,

      bowelHabits:
        hasValue(
          aiExtracted.bowel_habits
        )
          ? aiExtracted.bowel_habits
          : previous.bowelHabits,

      koshtha:
        hasValue(
          aiExtracted.koshtha
        )
          ? aiExtracted.koshtha
          : previous.koshtha,

      sleep:
        hasValue(
          aiExtracted.sleep
        )
          ? aiExtracted.sleep
          : previous.sleep,

      nidra:
        hasValue(
          aiExtracted.nidra
        )
          ? aiExtracted.nidra
          : previous.nidra,

      ahara:
        hasValue(
          aiExtracted.ahara
        )
          ? aiExtracted.ahara
          : previous.ahara,

      vihara:
        hasValue(
          aiExtracted.vihara
        )
          ? aiExtracted.vihara
          : previous.vihara,

      prakriti:
        hasValue(
          aiExtracted.prakriti
        )
          ? aiExtracted.prakriti
          : previous.prakriti,

      vikriti:
        hasValue(
          aiExtracted.vikriti
        )
          ? aiExtracted.vikriti
          : previous.vikriti,

      dashavidhaPariksha:
        hasValue(
          aiExtracted.dashavidha_pariksha
        )
          ? {
              ...previous.dashavidhaPariksha,
              ...aiExtracted.dashavidha_pariksha,
            }
          : previous.dashavidhaPariksha,

      redFlag:
        aiRedFlag === true ||
        previous.redFlag === true,
    }));
  };

  // ============================================================
  // PROCESS ANSWER
  // ============================================================

  const processAnswer = async (
    audioBlob
  ) => {
    try {
      setError("");
      setStatus("thinking");

      // ========================================================
      // STT
      // ========================================================

      const sttResult =
        await transcribeAudio(
          audioBlob,
          language
        );

      const patientText =
        sttResult?.transcript?.trim() ||
        "";

      if (!patientText) {
        setError(
          d.noAnswer
        );

        setStatus("ready");

        return;
      }

      setTranscript(
        patientText
      );

      console.log(
        "🎤 Patient:",
        patientText
      );

      // ========================================================
      // CURRENT TURN
      // ========================================================

      const currentTurn = {
        question,
        answer: patientText,
      };

      const updatedHistory = [
        ...history,
        currentTurn,
      ];

      // ========================================================
      // AI QUESTION ENGINE
      // ========================================================

      const aiResult =
        await generateNextQuestion({
          language,
          consultationType,
          answer: patientText,
          history: updatedHistory,
        });

      console.log(
        "🤖 AI result:",
        aiResult
      );

      const aiRedFlag =
        aiResult?.red_flag === true;

      mergeExtractedInformation(
        aiResult?.extracted,
        aiRedFlag
      );

      // ========================================================
      // HISTORY
      // ========================================================

      const completedTurn = {
        question,

        answer: patientText,

        extracted:
          aiResult?.extracted || {},

        category:
          aiResult?.category || "",

        red_flag:
          aiRedFlag,
      };

      const completedHistory = [
        ...history,
        completedTurn,
      ];

      setHistory(
        completedHistory
      );

      // ========================================================
      // DATABASE
      // ========================================================

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
              aiRedFlag,
          });
        } catch (dbError) {
          console.error(
            "MongoDB answer save error:",
            dbError
          );

          setError(
            language === "te"
              ? "సమాధానం AI ద్వారా ప్రాసెస్ అయింది, కానీ డేటాబేస్‌లో సేవ్ చేయడంలో సమస్య వచ్చింది."
              : language === "hi"
              ? "उत्तर AI द्वारा प्रोसेस हो गया, लेकिन डेटाबेस में सेव करने में समस्या हुई।"
              : "The answer was processed by AI, but there was a problem saving it to the database."
          );

          // We continue the interview even if
          // database saving has a temporary issue.
        } finally {
          setDatabaseSaving(false);
        }
      }

      // ========================================================
      // COMPLETION
      // ========================================================

      if (
        aiResult?.completed === true ||
        aiResult?.category === "completed"
      ) {
        if (
          !consultationId
        ) {
          throw new Error(
            language === "te"
              ? "Consultation ID లేదు. ఇంటర్వ్యూను పూర్తి చేయలేము."
              : language === "hi"
              ? "Consultation ID उपलब्ध नहीं है। इंटरव्यू पूरा नहीं किया जा सकता।"
              : "Consultation ID is missing. The interview cannot be completed."
          );
        }

        if (isCompleting) {
          return;
        }

        try {
          setIsCompleting(true);

          setStatus("thinking");

          console.log(
            "======================================"
          );

          console.log(
            "🏁 COMPLETING CONSULTATION"
          );

          console.log(
            "Consultation ID:",
            consultationId
          );

          console.log(
            "Previous Report IDs:",
            previousReportIds
          );

          console.log(
            "======================================"
          );

          // IMPORTANT:
          // This completes the SAME consultation
          // created inside PreviousReports.jsx.
          await completeConsultation(
            consultationId
          );

          console.log(
            "✅ Consultation completed:",
            consultationId
          );

          setInterviewCompleted(
            true
          );

          setNextQuestion("");

          setNextCategory(
            "completed"
          );

          setShowNextQuestion(
            false
          );

          setStatus("ready");

          // Stop any remaining audio.
          stopCurrentAudio();

          // Stop microphone if still active.
          if (
            streamRef.current
          ) {
            streamRef.current
              .getTracks()
              .forEach((track) =>
                track.stop()
              );

            streamRef.current =
              null;
          }

          setIsListening(false);

          // ====================================================
          // IMPORTANT:
          // Tell App.jsx that interview is complete.
          //
          // App.jsx will then:
          //
          // setScreen("clinical-summary")
          //
          // ====================================================

          if (onComplete) {
            onComplete(
              consultationId
            );
          }
        } catch (completionError) {
          console.error(
            "Completion error:",
            completionError
          );

          setStatus("ready");

          setError(
            completionError?.message ||
              d.processingError
          );
        } finally {
          setIsCompleting(false);
        }

        return;
      }

      // ========================================================
      // NEXT QUESTION
      // ========================================================

      const generatedQuestion =
        aiResult?.next_question?.trim();

      if (!generatedQuestion) {
        throw new Error(
          "AI did not return a next question."
        );
      }

      setNextQuestion(
        generatedQuestion
      );

      setNextCategory(
        aiResult?.category || ""
      );

      setQuestion(
        generatedQuestion
      );

      setShowNextQuestion(
        true
      );

      // ========================================================
      // TTS
      // ========================================================

      setTimeout(() => {
        speakText(
          generatedQuestion
        );
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

  // ============================================================
  // LABEL
  // ============================================================

  const consultationLabel =
    consultationType === "ayurveda"
      ? d.ayurveda
      : d.clinical;

  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  const renderArrayValue = (
    items
  ) => {
    if (
      !items ||
      items.length === 0
    ) {
      return (
        <span className="text-slate-700">
          —
        </span>
      );
    }

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map(
          (item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-1.5 text-[11px] text-cyan-300"
            >
              {item}
            </span>
          )
        )}
      </div>
    );
  };

  const renderObjectValue = (
    object
  ) => {
    if (
      !object ||
      typeof object !== "object" ||
      Object.keys(object).length === 0
    ) {
      return (
        <span className="text-slate-700">
          —
        </span>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        {Object.entries(object).map(
          ([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2"
            >
              <span className="text-[11px] text-slate-500">
                {key}
              </span>

              <span className="max-w-[60%] text-right text-[11px] text-slate-200">
                {typeof value ===
                "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </span>
            </div>
          )
        )}
      </div>
    );
  };

  // ============================================================
  // INFORMATION CARD
  // ============================================================

  const InformationCard = ({
    label,
    value,
    amber = false,
  }) => (
    <div
      className={`rounded-2xl border p-4 transition ${
        amber
          ? "border-amber-400/[0.08] bg-amber-400/[0.02]"
          : "border-white/[0.06] bg-white/[0.025]"
      }`}
    >
      <p
        className={`text-[9px] uppercase tracking-[0.18em] ${
          amber
            ? "text-amber-500/50"
            : "text-slate-600"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-200">
        {hasValue(value)
          ? value
          : "—"}
      </p>
    </div>
  );

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute left-[35%] top-[-250px] h-[650px] w-[900px] rounded-full bg-cyan-500/[0.055] blur-[170px]" />

      <div className="pointer-events-none absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-emerald-500/[0.045] blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-250px] left-[-250px] h-[550px] w-[550px] rounded-full bg-blue-500/[0.035] blur-[150px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050b14]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              disabled={isCompleting}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-400 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">
                <HeartPulse className="h-5 w-5 text-cyan-400" />
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-[0.16em]">
                    MEDIKIOSK
                  </h1>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-2 py-0.5 text-[8px] tracking-[0.12em] text-cyan-400">
                    AI
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] tracking-[0.18em] text-slate-600">
                  CLINICAL HISTORY ASSISTANT
                </p>
              </div>
            </div>
          </div>

          {/* CENTER */}

          <div className="hidden items-center gap-2 lg:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              AI PATIENT INTERVIEW
            </span>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2">
              <Languages className="h-3.5 w-3.5 text-cyan-400" />

              <span className="hidden text-[10px] text-slate-400 sm:block">
                {d.languageName}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.025] px-3 py-2">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />

              <span className="hidden text-[10px] text-emerald-400 sm:block">
                {d.connected}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="relative z-10 mx-auto max-w-[1450px] px-5 py-6 lg:px-8 lg:py-8">

        {/* TOP INFO */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                ACTIVE CONSULTATION
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {consultationLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

            <span className="text-[10px] text-slate-500">
              AI assisted • Doctor verified
            </span>
          </div>

        </div>

        {/* PREVIOUS REPORT STATUS */}

        {previousReportIds.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/[0.07]">
              <FileText className="h-4 w-4 text-cyan-300" />
            </div>

            <div>
              <p className="text-xs font-semibold text-cyan-300">
                Previous medical reports linked
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                {previousReportIds.length} report
                {previousReportIds.length !== 1
                  ? "s"
                  : ""}{" "}
                available for the final doctor summary.
              </p>
            </div>
          </motion.div>
        )}

        {/* LAYOUT */}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_390px]">

          {/* MAIN INTERVIEW PANEL */}

          <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.018] shadow-2xl">

            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-[100px]" />

            <div className="relative flex min-h-[760px] flex-col items-center px-5 py-8 sm:px-8 lg:px-12">

              {/* INTERVIEW STATUS */}

              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2">

                <motion.div
                  animate={{
                    opacity:
                      status === "listening"
                        ? [0.4, 1, 0.4]
                        : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "listening"
                      ? "bg-red-400"
                      : status === "thinking"
                      ? "bg-amber-400"
                      : status === "speaking"
                      ? "bg-cyan-400"
                      : "bg-emerald-400"
                  }`}
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {status === "listening"
                    ? "LISTENING"
                    : status === "thinking"
                    ? "PROCESSING"
                    : status === "speaking"
                    ? "AI SPEAKING"
                    : "READY"}
                </span>
              </div>

              {/* VOICE ORB */}

              <div className="relative mt-8 flex h-60 w-60 items-center justify-center">

                <motion.div
                  animate={
                    status === "listening"
                      ? {
                          scale: [1, 1.15, 1],
                          opacity: [
                            0.15,
                            0.35,
                            0.15,
                          ],
                        }
                      : {
                          scale: [1, 1.04, 1],
                          opacity: [
                            0.12,
                            0.2,
                            0.12,
                          ],
                        }
                  }
                  transition={{
                    duration:
                      status === "listening"
                        ? 1.2
                        : 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-60 w-60 rounded-full border border-cyan-400/20"
                />

                <motion.div
                  animate={
                    status === "listening"
                      ? {
                          scale: [1, 1.18, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="absolute h-48 w-48 rounded-full border border-cyan-400/10"
                />

                {/* CORE */}

                <motion.div
                  animate={
                    status === "thinking"
                      ? {
                          rotate: 360,
                        }
                      : status === "listening"
                      ? {
                          scale: [1, 1.08, 1],
                        }
                      : {
                          scale: [1, 1.025, 1],
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
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.12] via-[#081522] to-teal-400/[0.06] shadow-[0_0_80px_rgba(34,211,238,0.08)]"
                >
                  <div className="absolute inset-4 rounded-full border border-cyan-400/[0.08]" />

                  <div className="absolute inset-8 rounded-full border border-cyan-400/[0.07]" />

                  <motion.div
                    animate={
                      status === "listening"
                        ? {
                            boxShadow: [
                              "0 0 20px rgba(34,211,238,0.08)",
                              "0 0 55px rgba(34,211,238,0.22)",
                              "0 0 20px rgba(34,211,238,0.08)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                    }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/[0.07]"
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

              {/* STATUS TEXT */}

              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className="mt-1 text-center"
                >
                  <p className="text-lg font-medium text-white">
                    {statusText[status]}
                  </p>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-600">
                    {consultationLabel}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* COMPLETED */}

              <AnimatePresence>
                {interviewCompleted && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="mt-6 w-full max-w-2xl rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.045] p-6 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <Check className="h-6 w-6 text-emerald-400" />
                    </div>

                    <p className="mt-4 text-base font-semibold text-emerald-300">
                      {d.completedTitle}
                    </p>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                      {d.completedMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ERROR */}

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    className="mt-5 flex w-full max-w-2xl items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.035] px-4 py-3"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                    <span className="text-xs leading-5 text-red-300">
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QUESTION */}

              {!interviewCompleted && (
                <motion.div
                  layout
                  className="mt-7 w-full max-w-3xl"
                >
                  <div className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.025] p-6 text-center sm:p-8">

                    <div className="absolute left-1/2 top-0 h-20 w-40 -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-3xl" />

                    <div className="relative">

                      <div className="flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        {d.aiQuestion}
                      </div>

                      <p className="mx-auto mt-5 max-w-2xl text-xl font-medium leading-8 text-slate-100 sm:text-2xl lg:text-[27px]">
                        {question}
                      </p>

                      <button
                        onClick={playQuestion}
                        disabled={
                          status === "thinking" ||
                          status === "speaking" ||
                          interviewCompleted
                        }
                        className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-2.5 text-xs text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Volume2 className="h-4 w-4" />

                        {d.playQuestion}
                      </button>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* TRANSCRIPT */}

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
                    className="mt-4 w-full max-w-3xl rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                        <FileText className="h-3.5 w-3.5" />

                        {d.transcript}
                      </div>

                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {transcript}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MICROPHONE */}

              <div className="mt-8 flex flex-col items-center">

                <div className="relative">

                  {isListening && (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.35],
                          opacity: [0.4, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-full bg-red-400"
                      />

                      <motion.div
                        animate={{
                          scale: [1, 1.5],
                          opacity: [0.25, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.35,
                        }}
                        className="absolute inset-0 rounded-full bg-red-400"
                      />
                    </>
                  )}

                  <motion.button
                    whileTap={{
                      scale: 0.92,
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
                      !consultationId ||
                      interviewCompleted ||
                      isCompleting
                    }
                    className={`relative flex h-[82px] w-[82px] items-center justify-center rounded-full transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 shadow-[0_0_60px_rgba(239,68,68,0.3)]"
                        : "bg-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.22)]"
                    } ${
                      status === "thinking" ||
                      status === "speaking" ||
                      !consultationId ||
                      interviewCompleted ||
                      isCompleting
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    {isListening ? (
                      <CircleStop className="h-8 w-8 text-white" />
                    ) : (
                      <Mic className="h-8 w-8 text-slate-950" />
                    )}
                  </motion.button>

                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  {isListening
                    ? d.stop
                    : databaseSaving
                    ? d.saving
                    : isCompleting
                    ? d.processing
                    : d.answer}
                </p>

                {!isListening &&
                  !databaseSaving &&
                  !interviewCompleted &&
                  !isCompleting && (
                    <div className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-slate-700">
                      <Mic className="h-3 w-3" />
                      Voice input enabled
                    </div>
                  )}
              </div>

            </div>
          </section>

          {/* RIGHT SIDEBAR */}

          <aside className="flex flex-col gap-4">

            {/* EXTRACTION */}

            <div className="rounded-[1.8rem] border border-white/[0.07] bg-white/[0.018] p-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05]">
                    <BrainCircuit className="h-4 w-4 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {d.extracted}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      {d.captured}
                    </p>
                  </div>

                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/[0.06]">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                </div>

              </div>

              <div className="mt-5 space-y-3">

                <InformationCard
                  label={d.chiefComplaint}
                  value={extracted.chiefComplaint}
                />

                <InformationCard
                  label={d.duration}
                  value={extracted.duration}
                />

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                    {d.symptoms}
                  </p>

                  {renderArrayValue(
                    extracted.symptoms
                  )}

                </div>

                <InformationCard
                  label={d.severity}
                  value={extracted.severity}
                />

                <InformationCard
                  label={d.onset}
                  value={extracted.onset}
                />

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                    Aggravating Factors
                  </p>

                  {renderArrayValue(
                    extracted.aggravatingFactors
                  )}

                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                    Relieving Factors
                  </p>

                  {renderArrayValue(
                    extracted.relievingFactors
                  )}

                </div>

                {/* AYURVEDA */}

                {consultationType ===
                  "ayurveda" && (
                  <>
                    <div className="flex items-center gap-2 pt-3">
                      <LeafIcon />

                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                        Ayurvedic History
                      </p>
                    </div>

                    <InformationCard
                      label={d.appetite}
                      value={extracted.appetite}
                      amber
                    />

                    <InformationCard
                      label={d.agni}
                      value={extracted.agni}
                      amber
                    />

                    <InformationCard
                      label={d.bowelHabits}
                      value={extracted.bowelHabits}
                      amber
                    />

                    <InformationCard
                      label={d.koshtha}
                      value={extracted.koshtha}
                      amber
                    />

                    <InformationCard
                      label={d.sleep}
                      value={extracted.sleep}
                      amber
                    />

                    <InformationCard
                      label={d.nidra}
                      value={extracted.nidra}
                      amber
                    />

                    <InformationCard
                      label={d.ahara}
                      value={extracted.ahara}
                      amber
                    />

                    <InformationCard
                      label={d.vihara}
                      value={extracted.vihara}
                      amber
                    />

                    <InformationCard
                      label={d.prakriti}
                      value={extracted.prakriti}
                      amber
                    />

                    <InformationCard
                      label={d.vikriti}
                      value={extracted.vikriti}
                      amber
                    />

                    <div className="rounded-2xl border border-amber-400/[0.08] bg-amber-400/[0.02] p-4">

                      <p className="text-[9px] uppercase tracking-[0.18em] text-amber-500/50">
                        {d.dashavidha}
                      </p>

                      {renderObjectValue(
                        extracted.dashavidhaPariksha
                      )}

                    </div>
                  </>
                )}

              </div>
            </div>

            {/* RED FLAG */}

            {history.length > 0 && (
              <motion.div
                layout
                className={`rounded-[1.7rem] border p-5 ${
                  extracted.redFlag
                    ? "border-red-400/25 bg-red-400/[0.045]"
                    : "border-emerald-400/10 bg-emerald-400/[0.025]"
                }`}
              >
                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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

                  <div className="flex-1">

                    <p className="text-sm font-semibold">
                      {d.redFlag}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {extracted.redFlag
                        ? d.redFlagDetected
                        : d.noRedFlag}
                    </p>

                  </div>

                </div>
              </motion.div>
            )}

            {/* NEXT QUESTION */}

            <AnimatePresence>
              {showNextQuestion &&
                nextQuestion &&
                !interviewCompleted && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="rounded-[1.7rem] border border-cyan-400/15 bg-cyan-400/[0.035] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">

                        <Sparkles className="h-3.5 w-3.5" />

                        {d.nextQuestion}

                      </div>

                      {nextCategory && (
                        <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2 py-1 text-[8px] text-cyan-300">
                          {nextCategory}
                        </span>
                      )}

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {nextQuestion}
                    </p>

                    <button
                      onClick={() =>
                        speakText(
                          nextQuestion
                        )
                      }
                      disabled={
                        status === "speaking" ||
                        interviewCompleted ||
                        isCompleting
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Volume2 className="h-4 w-4" />

                      {d.playQuestion}
                    </button>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* AI PIPELINE */}

            <div className="rounded-[1.7rem] border border-white/[0.07] bg-white/[0.018] p-5">

              <div className="flex items-center gap-2">

                <Waves className="h-4 w-4 text-cyan-400" />

                <p className="text-sm font-semibold">
                  {d.aiPipeline}
                </p>

              </div>

              <div className="mt-5 space-y-3">

                {[
                  [
                    d.speechCapture,
                    Boolean(transcript),
                  ],

                  [
                    d.sarvamSTT,
                    Boolean(transcript),
                  ],

                  [
                    d.clinicalExtraction,
                    Boolean(history.length),
                  ],

                  [
                    d.questionEngine,
                    Boolean(nextQuestion) ||
                      interviewCompleted,
                  ],

                  [
                    d.groqLLM,
                    Boolean(history.length),
                  ],

                  [
                    d.sarvamTTS,
                    status === "speaking",
                  ],
                ].map(
                  (
                    [name, active],
                    index
                  ) => (
                    <div
                      key={name}
                      className="relative flex items-center gap-3"
                    >

                      {index < 5 && (
                        <div className="absolute left-[11px] top-6 h-3 w-px bg-white/[0.05]" />
                      )}

                      <div
                        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          active
                            ? "bg-emerald-400/[0.08]"
                            : "bg-white/[0.035]"
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

            {/* SECURITY */}

            <div className="rounded-[1.7rem] border border-white/[0.07] bg-white/[0.018] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.06]">

                  <LockKeyhole className="h-4 w-4 text-emerald-400" />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Secure AI Interview
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-600">
                    Information is collected for clinical history preparation.
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

// ================================================================
// SMALL AYURVEDA ICON
// ================================================================

function LeafIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/[0.06]">
      <span className="text-sm">
        🌿
      </span>
    </div>
  );
}

