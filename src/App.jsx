
import { useState } from "react";

import Welcome from "./pages/Welcome";
import Language from "./pages/Language";
import ConsultationType from "./pages/ConsultationType";
import Consent from "./pages/Consent";
import Interview from "./pages/Interview";

function App() {
  const [screen, setScreen] = useState("welcome");

  const [language, setLanguage] = useState(null);

  const [consultationType, setConsultationType] = useState(null);

  // Welcome → Language
  const startFromWelcome = () => {
    setScreen("language");
  };

  // Language → Consultation Type
  const continueFromLanguage = () => {
    if (!language) return;
    setScreen("consultation");
  };

  // Consultation → Consent
  const continueFromConsultation = () => {
    if (!consultationType) return;
    setScreen("consent");
  };

  // Back to Language
  const backToLanguage = () => {
    setScreen("language");
  };

  // Back to Consultation
  const backToConsultation = () => {
    setScreen("consultation");
  };

  // Consent → Interview
  const startInterview = () => {
    setScreen("interview");
  };

  return (
    <div className="min-h-screen bg-[#07111f]">

      {/* 1. Welcome */}
      {screen === "welcome" && (
        <Welcome
          onStart={startFromWelcome}
        />
      )}

      {/* 2. Language */}
      {screen === "language" && (
        <Language
          selectedLanguage={language}
          onSelect={setLanguage}
          onContinue={continueFromLanguage}
        />
      )}

      {/* 3. Consultation Type */}
      {screen === "consultation" && (
        <ConsultationType
          language={language}
          selectedType={consultationType}
          onSelect={setConsultationType}
          onContinue={continueFromConsultation}
          onBack={backToLanguage}
        />
      )}

      {/* 4. Consent */}
      {screen === "consent" && (
        <Consent
          language={language}
          onBack={backToConsultation}
          onContinue={startInterview}
        />
      )}

      {/* 5. AI Interview */}
      {screen === "interview" && (
        <Interview
          language={language}
          consultationType={consultationType}
          patientId="6a972fd09388152b35caf92c"
          onBack={backToConsultation}
        />
      )}

    </div>
  );
}

export default App;

