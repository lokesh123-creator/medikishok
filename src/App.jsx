import { useState } from "react";

import Welcome from "./pages/Welcome";
import PatientAuth from "./pages/PatientAuth";
import Language from "./pages/Language";
import ConsultationType from "./pages/ConsultationType";
import Consent from "./pages/Consent";
import PreviousReports from "./pages/PreviousReports";
import Interview from "./pages/Interview";
import DoctorDashboard from "./pages/DoctorDashboard";
import ClinicalSummary from "./pages/ClinicalSummary";

function App() {
  // ==================================================
  // SCREEN
  // ==================================================

  const [screen, setScreen] = useState("welcome");

  // ==================================================
  // PATIENT
  // ==================================================

  const [patient, setPatient] = useState(null);

  // ==================================================
  // CONSULTATION
  // ==================================================

  const [language, setLanguage] = useState(null);

  const [consultationType, setConsultationType] =
    useState(null);

  // ==================================================
  // CONSULTATION ID
  // ==================================================

  /*
   * This ID is created ONLY ONCE in PreviousReports.
   *
   * It is then passed to Interview.
   *
   * Interview must NOT create another consultation.
   */

  const [consultationId, setConsultationId] =
    useState(null);

  // ==================================================
  // PREVIOUS MEDICAL REPORTS
  // ==================================================

  /*
   * MongoDB IDs of uploaded medical reports.
   *
   * Example:
   *
   * [
   *   "68b123...",
   *   "68b456..."
   * ]
   */

  const [previousReportIds, setPreviousReportIds] =
    useState([]);

  // ==================================================
  // DOCTOR
  // ==================================================

  /*
   * Consultation selected by doctor
   * from DoctorDashboard.
   */

  const [selectedConsultationId, setSelectedConsultationId] =
    useState(null);

  // ==================================================
  // PATIENT FLOW
  // ==================================================

  // --------------------------------------------------
  // Welcome → Patient Authentication
  // --------------------------------------------------

  const startFromWelcome = () => {
    console.log("➡️ Opening patient authentication");

    setScreen("patient");
  };

  // --------------------------------------------------
  // Patient Authentication → Language
  // --------------------------------------------------

  const handlePatientSuccess = (patientData) => {
    console.log(
      "✅ Patient authenticated:",
      patientData
    );

    // Save patient
    setPatient(patientData);

    // Reset previous consultation data
    setLanguage(null);

    setConsultationType(null);

    setConsultationId(null);

    setPreviousReportIds([]);

    // Continue
    setScreen("language");
  };

  // --------------------------------------------------
  // Language → Consultation Type
  // --------------------------------------------------

  const continueFromLanguage = () => {
    if (!language) {
      console.warn(
        "⚠️ Please select a language"
      );

      return;
    }

    console.log(
      "🌐 Selected language:",
      language
    );

    setScreen("consultation");
  };

  // --------------------------------------------------
  // Consultation Type → Consent
  // --------------------------------------------------

  const continueFromConsultation = () => {
    if (!consultationType) {
      console.warn(
        "⚠️ Please select consultation type"
      );

      return;
    }

    console.log(
      "🩺 Consultation type:",
      consultationType
    );

    setScreen("consent");
  };

  // --------------------------------------------------
  // Consent → Previous Reports
  // --------------------------------------------------

  const startPreviousReports = () => {
    if (!patient?._id) {
      console.error(
        "❌ Patient ID is missing"
      );

      return;
    }

    if (!language) {
      console.error(
        "❌ Language is missing"
      );

      return;
    }

    if (!consultationType) {
      console.error(
        "❌ Consultation type is missing"
      );

      return;
    }

    console.log(
      "➡️ Opening previous reports"
    );

    setScreen("previous-reports");
  };

  // ==================================================
  // PREVIOUS REPORTS FLOW
  // ==================================================

  /*
   * PreviousReports does:
   *
   * 1. Upload reports
   * 2. Get report IDs
   * 3. Create consultation
   * 4. Return consultationId + report IDs
   *
   * Then App moves to Interview.
   */

  const handlePreviousReportsComplete = ({
    consultationId: newConsultationId,
    previousReportIds: reportIds = [],
  }) => {
    console.log(
      "======================================"
    );

    console.log(
      "✅ CONSULTATION CREATED"
    );

    console.log(
      "Consultation ID:",
      newConsultationId
    );

    console.log(
      "Previous Report IDs:",
      reportIds
    );

    console.log(
      "======================================"
    );

    // Save consultation ID
    setConsultationId(
      newConsultationId
    );

    // Save previous report IDs
    setPreviousReportIds(
      reportIds
    );

    // Move to AI Interview
    setScreen("interview");
  };

  // ==================================================
  // INTERVIEW FLOW
  // ==================================================

  /*
   * Interview receives:
   *
   * patientId
   * language
   * consultationType
   * consultationId
   * previousReportIds
   *
   * IMPORTANT:
   *
   * Interview does NOT create a new consultation.
   */

  const backFromInterview = () => {
    console.log(
      "⬅️ Returning to previous reports"
    );

    setScreen("previous-reports");
  };


  const handleInterviewComplete = (completedConsultationId) => {
  console.log("======================================");
  console.log("✅ INTERVIEW COMPLETED");
  console.log("Consultation ID:", completedConsultationId);
  console.log("======================================");

  setConsultationId(completedConsultationId);
  setSelectedConsultationId(completedConsultationId);

  setScreen("clinical-summary");
};

  // ==================================================
  // DOCTOR FLOW
  // ==================================================

  // --------------------------------------------------
  // Open Doctor Dashboard
  // --------------------------------------------------

  const openDoctorDashboard = () => {
    console.log(
      "🩺 Opening doctor dashboard"
    );

    setScreen("doctor");
  };

  // --------------------------------------------------
  // Doctor Dashboard → Clinical Summary
  // --------------------------------------------------

  const openConsultation = (id) => {
    console.log(
      "🩺 Opening consultation:",
      id
    );

    setSelectedConsultationId(id);

    setScreen("clinical-summary");
  };

  // --------------------------------------------------
  // Clinical Summary → Doctor Dashboard
  // --------------------------------------------------

  const backToDoctorDashboard = () => {
    console.log(
      "⬅️ Returning to doctor dashboard"
    );

    setSelectedConsultationId(null);

    setScreen("doctor");
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-[#07111f]">

      {/* =================================================
          1. WELCOME
      ================================================= */}

      {screen === "welcome" && (
        <>
          <Welcome
            onStart={startFromWelcome}
          />

          {/* =============================================
              TEMPORARY DOCTOR BUTTON
          ============================================= */}

          <button
            onClick={openDoctorDashboard}
            className="
              fixed
              bottom-6
              right-6
              z-50
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-4
              py-3
              text-xs
              font-medium
              text-white
              backdrop-blur-xl
              transition
              hover:bg-white/20
            "
          >
            Doctor Dashboard
          </button>
        </>
      )}

      {/* =================================================
          2. PATIENT AUTHENTICATION
      ================================================= */}

      {screen === "patient" && (
        <PatientAuth
          onSuccess={handlePatientSuccess}
        />
      )}

      {/* =================================================
          3. LANGUAGE
      ================================================= */}

      {screen === "language" && (
        <Language
          selectedLanguage={language}
          onSelect={setLanguage}
          onContinue={continueFromLanguage}
        />
      )}

      {/* =================================================
          4. CONSULTATION TYPE
      ================================================= */}

      {screen === "consultation" && (
        <ConsultationType
          language={language}
          selectedType={consultationType}
          onSelect={setConsultationType}
          onContinue={continueFromConsultation}
          onBack={() => {
            setScreen("language");
          }}
        />
      )}

      {/* =================================================
          5. CONSENT
      ================================================= */}

      {screen === "consent" && (
        <Consent
          language={language}
          onBack={() => {
            setScreen("consultation");
          }}
          onContinue={startPreviousReports}
        />
      )}

      {/* =================================================
          6. PREVIOUS MEDICAL REPORTS
      ================================================= */}

      {screen === "previous-reports" && (
        <PreviousReports
          patientId={patient?._id}
          language={language}
          consultationType={consultationType}

          /*
           * PreviousReports will call:
           *
           * onComplete({
           *   consultationId,
           *   previousReportIds
           * })
           */

          onComplete={
            handlePreviousReportsComplete
          }

          onBack={() => {
            setScreen("consent");
          }}
        />
      )}

      {/* =================================================
          7. AI CLINICAL INTERVIEW
      ================================================= */}

      {screen === "interview" && (
        <Interview
          patientId={patient?._id}
          language={language}
          consultationType={consultationType}

          /*
           * IMPORTANT:
           *
           * This is the consultation created
           * by PreviousReports.
           *
           * Interview MUST NOT call
           * createConsultation() again.
           */

          consultationId={consultationId}

          /*
           * Previous medical reports already
           * attached to this consultation.
           */

          previousReportIds={
            previousReportIds
          }

          onBack={backFromInterview}
        />
      )}

      {/* =================================================
          8. DOCTOR DASHBOARD
      ================================================= */}

      {screen === "doctor" && (
        <DoctorDashboard
          onOpenConsultation={
            openConsultation
          }
        />
      )}

      {/* =================================================
          9. CLINICAL SUMMARY
      ================================================= */}

      {screen === "clinical-summary" && (
        <ClinicalSummary
          /*
           * Doctor flow uses selectedConsultationId.
           *
           * Patient flow can use consultationId.
           *
           * So we support both.
           */

          consultationId={
            selectedConsultationId ||
            consultationId
          }

          onBack={
            backToDoctorDashboard
          }
        />
      )}

    </div>
  );
}

export default App;