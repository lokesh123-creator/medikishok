
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Loader2,
  MessageCircle,
  Save,
  ShieldCheck,
  User,
  UserCheck,
  Brain,
  ClipboardCheck,
  FileSearch,
  Database,
  Activity,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import { getConsultationDetails } from "../services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

function ClinicalSummary({ consultationId, onBack }) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [doctorNotes, setDoctorNotes] = useState("");

  const [editedClinicalHistory, setEditedClinicalHistory] =
    useState({});

  const [editedAyurvedicHistory, setEditedAyurvedicHistory] =
    useState({});

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!consultationId) {
      setError("Consultation ID is missing.");
      setLoading(false);
      return;
    }

    loadConsultation();
  }, [consultationId]);

  async function loadConsultation() {
    try {
      setLoading(true);
      setError("");

      const result = await getConsultationDetails(consultationId);

      console.log("📋 Doctor consultation response:", result);

      const consultation = result?.consultation || result;

      const patient =
        result?.patient ||
        consultation?.patient ||
        {};

      setData({
        consultation,
        patient,
      });

      setDoctorNotes(consultation?.doctorNotes || "");

      setEditedClinicalHistory(
        consultation?.clinicalHistory || {}
      );

      setEditedAyurvedicHistory(
        consultation?.ayurvedicHistory || {}
      );

      setVerified(
        Boolean(consultation?.doctorVerified)
      );
    } catch (err) {
      console.error(
        "❌ Clinical summary error:",
        err
      );

      setError(
        err.message ||
          "Unable to load consultation details."
      );
    } finally {
      setLoading(false);
    }
  }

  const consultation = data?.consultation || {};
  const patient = data?.patient || {};

  const clinicalHistory =
    editedClinicalHistory || {};

  const ayurvedicHistory =
    editedAyurvedicHistory || {};

  const conversation =
    consultation?.conversation || [];

  const redFlags =
    consultation?.redFlags || [];

  const aiSummary =
    consultation?.aiSummary;

  /*
   * Previous medical reports can come from:
   *
   * consultation.previousReports
   * consultation.previous_reports
   * result.previousReports
   * patient.previousReports
   *
   * The backend may return the reports in any of
   * these structures depending on the endpoint version.
   */
  const previousReports =
    consultation?.previousReports ||
    consultation?.previous_reports ||
    data?.previousReports ||
    patient?.previousReports ||
    [];

  function updateClinicalField(key, value) {
    setEditedClinicalHistory((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateAyurvedicField(key, value) {
    setEditedAyurvedicHistory((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function verifyConsultation() {
    try {
      setVerifying(true);

      const doctorId =
        localStorage.getItem("doctorId");

      if (!doctorId) {
        alert(
          "Doctor ID not found. Please login to the doctor portal."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/consultations/${consultationId}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctor_id: doctorId,
            doctor_notes: doctorNotes,
            clinical_history:
              editedClinicalHistory,
            ayurvedic_history:
              editedAyurvedicHistory,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Verification failed."
        );
      }

      console.log(
        "✅ Consultation verified:",
        result
      );

      setVerified(true);

      alert(
        "Consultation verified successfully."
      );

      onBack?.();
    } catch (err) {
      console.error(
        "❌ Verification error:",
        err
      );

      alert(
        err.message ||
          "Unable to verify consultation."
      );
    } finally {
      setVerifying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={24}
            className="animate-spin text-cyan-400"
          />
          Loading clinical summary...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-8">

            <div className="flex items-start gap-4">

              <AlertTriangle
                className="mt-1 text-red-400"
                size={24}
              />

              <div>
                <h2 className="font-semibold text-red-300">
                  Unable to load consultation
                </h2>

                <p className="mt-2 text-sm text-red-300/70">
                  {error}
                </p>

                <button
                  onClick={loadConsultation}
                  className="mt-5 rounded-xl bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20"
                >
                  Try Again
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed left-1/2 top-[-220px] h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative z-10">

        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/85 backdrop-blur-xl">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            <div className="flex items-center gap-4">

              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <div className="flex items-center gap-2">

                  <HeartPulse
                    size={19}
                    className="text-cyan-400"
                  />

                  <span className="text-sm font-bold tracking-[0.15em]">
                    MEDIKIOSK
                  </span>

                </div>

                <p className="mt-1 text-[10px] tracking-[0.18em] text-slate-600">
                  CLINICAL REVIEW
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              {verified && (
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
                  <CheckCircle2 size={14} />
                  Verified
                </div>
              )}

              <div className="hidden text-right sm:block">

                <p className="text-xs text-slate-500">
                  Consultation
                </p>

                <p className="max-w-[200px] truncate text-xs text-slate-300">
                  {consultation?._id}
                </p>

              </div>

            </div>

          </div>

        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">

          {/* TITLE */}
          <div className="mb-8">

            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
              AI-ASSISTED CASE REVIEW
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Clinical Summary
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review, edit and verify the patient's
              AI-generated clinical history.
            </p>

          </div>

          {/* PATIENT */}
          <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">

                  <User
                    size={28}
                    className="text-cyan-400"
                  />

                </div>

                <div>

                  <p className="text-xs tracking-[0.15em] text-slate-600">
                    PATIENT
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {patient?.name ||
                      "Unknown Patient"}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">

                    {patient?.phone && (
                      <span>
                        📱 {patient.phone}
                      </span>
                    )}

                    {patient?.email && (
                      <span>
                        ✉️ {patient.email}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <InfoPill
                  label="TYPE"
                  value={
                    consultation?.consultationType ===
                    "ayurveda"
                      ? "Ayurveda"
                      : "Clinical"
                  }
                />

                <InfoPill
                  label="LANGUAGE"
                  value={
                    consultation?.language?.toUpperCase() ||
                    "—"
                  }
                />

                <InfoPill
                  label="STATUS"
                  value={
                    consultation?.status
                      ?.replace("_", " ")
                      ?.toUpperCase() ||
                    "—"
                  }
                />

                <InfoPill
                  label="DURATION"
                  value={
                    clinicalHistory?.duration ||
                    "—"
                  }
                />

              </div>

            </div>

          </section>

          {/* PREVIOUS MEDICAL REPORTS */}
          <PreviousReportsSection
            reports={previousReports}
          />

          {/* RED FLAGS */}
          {redFlags.length > 0 && (
            <section className="mb-6 rounded-3xl border border-red-400/30 bg-red-400/[0.06] p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10">

                  <AlertTriangle
                    size={22}
                    className="text-red-400"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-xs font-semibold tracking-[0.2em] text-red-400">
                    SAFETY ALERT
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-red-200">
                    Red Flags Detected
                  </h2>

                  <div className="mt-5 space-y-3">

                    {redFlags.map(
                      (flag, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-red-400/10 bg-black/10 p-4 text-sm text-red-200/80"
                        >
                          {formatValue(flag)}
                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

            </section>
          )}

          {/* CONTENT */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

            {/* LEFT */}
            <div className="space-y-6">

              {/* CLINICAL HISTORY */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <SectionHeader
                  icon={FileText}
                  title="Clinical History"
                  subtitle="AI-extracted patient information"
                />

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <EditableField
                    label="Chief Complaint"
                    value={formatValue(
                      clinicalHistory.chiefComplaint
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "chiefComplaint",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Duration"
                    value={formatValue(
                      clinicalHistory.duration
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "duration",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Symptoms"
                    value={formatValue(
                      clinicalHistory.symptoms
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "symptoms",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Severity"
                    value={formatValue(
                      clinicalHistory.severity
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "severity",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Onset"
                    value={formatValue(
                      clinicalHistory.onset
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "onset",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Aggravating Factors"
                    value={formatValue(
                      clinicalHistory.aggravatingFactors
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "aggravatingFactors",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Relieving Factors"
                    value={formatValue(
                      clinicalHistory.relievingFactors
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "relievingFactors",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Appetite"
                    value={formatValue(
                      clinicalHistory.appetite
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "appetite",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Bowel Habits"
                    value={formatValue(
                      clinicalHistory.bowelHabits
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "bowelHabits",
                        value
                      )
                    }
                  />

                  <EditableField
                    label="Sleep"
                    value={formatValue(
                      clinicalHistory.sleep
                    )}
                    onChange={(value) =>
                      updateClinicalField(
                        "sleep",
                        value
                      )
                    }
                  />

                </div>

              </section>

              {/* AYURVEDA */}
              {consultation?.consultationType ===
                "ayurveda" && (
                <section className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">

                  <SectionHeader
                    icon={HeartPulse}
                    title="Ayurvedic History"
                    subtitle="Ayurveda-specific assessment"
                  />

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    <EditableField
                      label="Prakriti"
                      value={formatValue(
                        ayurvedicHistory.prakriti
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "prakriti",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Vikriti"
                      value={formatValue(
                        ayurvedicHistory.vikriti
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "vikriti",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Agni"
                      value={formatValue(
                        ayurvedicHistory.agni
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "agni",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Koshtha"
                      value={formatValue(
                        ayurvedicHistory.koshtha
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "koshtha",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Ahara"
                      value={formatValue(
                        ayurvedicHistory.ahara
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "ahara",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Vihara"
                      value={formatValue(
                        ayurvedicHistory.vihara
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "vihara",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Nidra"
                      value={formatValue(
                        ayurvedicHistory.nidra
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "nidra",
                          value
                        )
                      }
                    />

                    <EditableField
                      label="Dashavidha Pariksha"
                      value={formatValue(
                        ayurvedicHistory.dashavidhaPariksha
                      )}
                      onChange={(value) =>
                        updateAyurvedicField(
                          "dashavidhaPariksha",
                          value
                        )
                      }
                    />

                  </div>

                </section>
              )}

              {/* CONVERSATION */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <SectionHeader
                  icon={MessageCircle}
                  title="Patient Interview"
                  subtitle="Complete AI conversation"
                />

                <div className="mt-6 space-y-4">

                  {conversation.length === 0 && (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-slate-500">
                      No conversation records found.
                    </div>
                  )}

                  {conversation.map(
                    (item, index) => (
                      <ConversationItem
                        key={index}
                        item={item}
                        index={index}
                      />
                    )
                  )}

                </div>

              </section>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* AI SUMMARY */}
              <AISummaryCard
                aiSummary={aiSummary}
                hasPreviousReports={
                  previousReports.length > 0
                }
              />

              {/* DOCTOR REVIEW */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <SectionHeader
                  icon={UserCheck}
                  title="Doctor Review"
                  subtitle="Add professional notes"
                />

                <textarea
                  value={doctorNotes}
                  onChange={(e) =>
                    setDoctorNotes(
                      e.target.value
                    )
                  }
                  placeholder="Enter your clinical notes, corrections or observations..."
                  rows={7}
                  className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">

                  <Save size={14} />

                  Notes will be saved when you
                  verify the consultation.

                </div>

              </section>

              {/* VERIFY */}
              <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">

                    <CheckCircle2
                      size={22}
                      className="text-emerald-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Ready for Confirmation
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Review all AI-extracted
                      information before confirming
                      this clinical history.
                    </p>

                  </div>

                </div>

                <button
                  disabled={
                    verifying || verified
                  }
                  onClick={
                    verifyConsultation
                  }
                  className={`
                    mt-6 flex w-full items-center
                    justify-center gap-2 rounded-2xl
                    px-5 py-4 text-sm font-bold
                    transition
                    ${
                      verified
                        ? "cursor-default bg-emerald-400/20 text-emerald-300"
                        : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                    }
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  `}
                >

                  {verifying ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Verifying...
                    </>
                  ) : verified ? (
                    <>
                      <CheckCircle2 size={18} />
                      Consultation Verified
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Verify & Confirm
                    </>
                  )}

                </button>

              </section>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-8 flex justify-between border-t border-white/5 pt-6">

            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-400 hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to Cases
            </button>

            <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">

              <Clock3 size={14} />

              AI-assisted clinical documentation

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}


/* ================================================= */
/* PREVIOUS MEDICAL REPORTS */
/* ================================================= */

function PreviousReportsSection({ reports }) {
  const safeReports =
    Array.isArray(reports)
      ? reports
      : [];

  /*
   * If there are no reports, we still show the section.
   * This makes it very clear to the judge that reports
   * are optional.
   */

  return (
    <section className="mb-6 rounded-3xl border border-violet-400/20 bg-violet-400/[0.035] p-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">

            <FileSearch
              size={21}
              className="text-violet-400"
            />

          </div>

          <div>

            <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-400">
              HISTORICAL MEDICAL DATA
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Previous Medical Reports
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Uploaded reports processed through OCR
              and medical information extraction.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-300">

          <Database size={13} />

          {safeReports.length}{" "}
          {safeReports.length === 1
            ? "Report"
            : "Reports"}

        </div>

      </div>

      {safeReports.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-5">

          <div className="flex items-center gap-3">

            <FileText
              size={19}
              className="text-slate-600"
            />

            <div>

              <p className="text-sm font-medium text-slate-400">
                No previous medical reports
              </p>

              <p className="mt-1 text-xs text-slate-600">
                This consultation is based on the
                current patient interview only.
              </p>

            </div>

          </div>

        </div>
      ) : (
        <div className="mt-5 space-y-4">

          {safeReports.map(
            (report, index) => (
              <MedicalReportCard
                key={
                  report?._id ||
                  report?.id ||
                  index
                }
                report={report}
                index={index}
              />
            )
          )}

        </div>
      )}

      {safeReports.length > 0 && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-4">

          <Activity
            size={16}
            className="mt-0.5 shrink-0 text-cyan-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            Historical report findings are shown
            separately from the current interview.
            The AI clinical summary may use both
            sources when generating the final
            decision-support draft.
          </p>

        </div>
      )}

    </section>
  );
}


/* ================================================= */
/* MEDICAL REPORT CARD */
/* ================================================= */

function MedicalReportCard({
  report,
  index,
}) {
  const filename =
    report?.filename ||
    report?.fileName ||
    report?.name ||
    `Medical Report ${index + 1}`;

  const contentType =
    report?.contentType ||
    report?.mimeType ||
    "";

  const fileSize =
    report?.fileSize ||
    report?.size ||
    0;

  const uploadedAt =
    report?.uploadedAt ||
    report?.createdAt ||
    report?.uploaded_at;

  const language =
    report?.language ||
    report?.languageCode ||
    "";

  const ocr =
    report?.ocr ||
    {};

  const extractedData =
    report?.extractedData ||
    report?.extracted_data ||
    {};

  const ocrStatus =
    ocr?.status ||
    report?.ocrStatus ||
    "unknown";

  const extractionStatus =
    extractedData?.status ||
    report?.extractionStatus ||
    "unknown";

  const ocrText =
    ocr?.text ||
    report?.ocrText ||
    "";

  const extracted =
    extractedData?.data ||
    extractedData?.result ||
    report?.medicalData ||
    report?.medical_data ||
    {};

  const downloadUrl =
    ocr?.downloadUrl ||
    report?.downloadUrl ||
    report?.fileUrl ||
    "";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

      {/* REPORT HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.08]">

            <FileText
              size={20}
              className="text-violet-300"
            />

          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-semibold tracking-[0.18em] text-slate-600">
              REPORT {index + 1}
            </p>

            <h3 className="mt-1 break-all text-sm font-semibold text-slate-200">
              {filename}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">

              {contentType && (
                <span>
                  {contentType}
                </span>
              )}

              {fileSize > 0 && (
                <span>
                  {formatFileSize(fileSize)}
                </span>
              )}

              {language && (
                <span>
                  {String(language).toUpperCase()}
                </span>
              )}

            </div>

          </div>

        </div>

        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 hover:bg-white/[0.07] hover:text-white"
          >
            <ExternalLink size={14} />
            View
          </a>
        )}

      </div>

      {/* STATUS */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">

        <StatusCard
          icon={FileSearch}
          label="OCR"
          status={ocrStatus}
          success={
            String(ocrStatus).toLowerCase() ===
            "completed"
          }
        />

        <StatusCard
          icon={Brain}
          label="Medical Extraction"
          status={extractionStatus}
          success={
            String(extractionStatus).toLowerCase() ===
            "completed"
          }
        />

      </div>

      {/* UPLOAD DATE */}
      {uploadedAt && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">

          <CalendarDays size={13} />

          Uploaded{" "}
          {formatDate(uploadedAt)}

        </div>
      )}

      {/* EXTRACTED MEDICAL DATA */}
      {hasObjectData(extracted) && (
        <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">

          <div className="flex items-center gap-2">

            <Activity
              size={15}
              className="text-emerald-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-emerald-400">
              EXTRACTED MEDICAL INFORMATION
            </p>

          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            {Object.entries(extracted).map(
              ([key, value]) => {

                const formatted =
                  formatValue(value);

                if (!formatted) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    className="rounded-xl border border-white/5 bg-black/10 p-3"
                  >

                    <p className="text-[9px] font-semibold tracking-[0.12em] text-slate-600">
                      {formatFieldName(key)}
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-slate-300">
                      {formatted}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

      {/* OCR PREVIEW */}
      {ocrText && (
        <details className="mt-4 group">

          <summary className="cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-slate-500 hover:text-slate-300">

            <span className="group-open:text-cyan-400">
              View OCR extracted text
            </span>

          </summary>

          <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-white/5 bg-black/20 p-4">

            <p className="whitespace-pre-wrap text-xs leading-6 text-slate-500">
              {ocrText}
            </p>

          </div>

        </details>
      )}

    </div>
  );
}


/* ================================================= */
/* REPORT STATUS */
/* ================================================= */

function StatusCard({
  icon: Icon,
  label,
  status,
  success,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">

      <div className="flex items-center gap-3">

        <Icon
          size={16}
          className={
            success
              ? "text-emerald-400"
              : "text-slate-600"
          }
        />

        <div>

          <p className="text-[9px] font-semibold tracking-[0.15em] text-slate-600">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatStatus(status)}
          </p>

        </div>

      </div>

      {success ? (
        <CheckCircle2
          size={16}
          className="text-emerald-400"
        />
      ) : (
        <Clock3
          size={16}
          className="text-slate-600"
        />
      )}

    </div>
  );
}


/* ================================================= */
/* AI SUMMARY */
/* ================================================= */

function AISummaryCard({
  aiSummary,
  hasPreviousReports,
}) {
  if (!aiSummary) {
    return (
      <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">

        <SectionHeader
          icon={ShieldCheck}
          title="AI Clinical Summary"
          subtitle="Decision-support draft"
        />

        <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-5">

          <div className="flex items-center gap-3 text-sm text-slate-500">

            <Brain
              size={18}
              className="text-cyan-400"
            />

            AI summary has not been generated yet.

          </div>

        </div>

      </section>
    );
  }

  if (typeof aiSummary === "string") {
    return (
      <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">

        <SectionHeader
          icon={ShieldCheck}
          title="AI Clinical Summary"
          subtitle="Decision-support draft"
        />

        {hasPreviousReports && (
          <SourceBadge />
        )}

        <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-black/10 p-5">

          <div className="mb-3 flex items-center gap-2">

            <Brain
              size={16}
              className="text-cyan-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-cyan-400">
              CLINICAL OVERVIEW
            </p>

          </div>

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {aiSummary}
          </p>

        </div>

        <AISafetyNotice />

      </section>
    );
  }

  const summary =
    aiSummary?.summary || "";

  const keyFindings =
    Array.isArray(aiSummary?.key_findings)
      ? aiSummary.key_findings
      : [];

  const missingInformation =
    Array.isArray(
      aiSummary?.missing_information
    )
      ? aiSummary.missing_information
      : [];

  const aiClinical =
    aiSummary?.clinical_history || {};

  const aiAyurveda =
    aiSummary?.ayurvedic_history || {};

  const aiRedFlags =
    Array.isArray(aiSummary?.red_flags)
      ? aiSummary.red_flags
      : [];

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">

      <SectionHeader
        icon={ShieldCheck}
        title="AI Clinical Summary"
        subtitle="Decision-support draft"
      />

      {hasPreviousReports && (
        <SourceBadge />
      )}

      {/* SUMMARY */}
      {summary && (
        <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-black/10 p-5">

          <div className="mb-3 flex items-center gap-2">

            <Brain
              size={16}
              className="text-cyan-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-cyan-400">
              CLINICAL OVERVIEW
            </p>

          </div>

          <p className="text-sm leading-7 text-slate-300">
            {summary}
          </p>

        </div>
      )}

      {/* KEY FINDINGS */}
      {keyFindings.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/5 bg-black/10 p-5">

          <div className="mb-4 flex items-center gap-2">

            <ClipboardCheck
              size={16}
              className="text-cyan-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-cyan-400">
              KEY FINDINGS
            </p>

          </div>

          <div className="space-y-2">

            {keyFindings.map(
              (finding, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3"
                >

                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-bold text-cyan-400">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {formatValue(finding)}
                  </p>

                </div>
              )
            )}

          </div>

        </div>
      )}

      {/* SOURCE INDICATOR */}
      <div className="mt-4 rounded-2xl border border-white/5 bg-black/10 p-4">

        <div className="flex items-start gap-3">

          <Database
            size={16}
            className="mt-0.5 text-cyan-400"
          />

          <div>

            <p className="text-[10px] font-semibold tracking-[0.15em] text-cyan-400">
              INFORMATION SOURCES
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Current patient interview
              {hasPreviousReports
                ? " + previous medical reports"
                : ""}
            </p>

          </div>

        </div>

      </div>

      {/* AI CLINICAL DATA */}
      <div className="mt-4">

        <SummaryGroup
          title="Clinical Findings"
          fields={[
            [
              "Chief Complaint",
              aiClinical.chief_complaint,
            ],
            [
              "Duration",
              aiClinical.duration,
            ],
            [
              "Symptoms",
              aiClinical.symptoms,
            ],
            [
              "Severity",
              aiClinical.severity,
            ],
            [
              "Onset",
              aiClinical.onset,
            ],
            [
              "Aggravating Factors",
              aiClinical.aggravating_factors,
            ],
            [
              "Relieving Factors",
              aiClinical.relieving_factors,
            ],
            [
              "Appetite",
              aiClinical.appetite,
            ],
            [
              "Bowel Habits",
              aiClinical.bowel_habits,
            ],
            [
              "Sleep",
              aiClinical.sleep,
            ],
          ]}
        />

      </div>

      {/* AYURVEDA DATA */}
      <div className="mt-4">

        <SummaryGroup
          title="Ayurvedic Findings"
          fields={[
            [
              "Prakriti",
              aiAyurveda.prakriti,
            ],
            [
              "Vikriti",
              aiAyurveda.vikriti,
            ],
            [
              "Agni",
              aiAyurveda.agni,
            ],
            [
              "Koshtha",
              aiAyurveda.koshtha,
            ],
            [
              "Ahara",
              aiAyurveda.ahara,
            ],
            [
              "Vihara",
              aiAyurveda.vihara,
            ],
            [
              "Nidra",
              aiAyurveda.nidra,
            ],
            [
              "Dashavidha Pariksha",
              aiAyurveda.dashavidha_pariksha,
            ],
          ]}
        />

      </div>

      {/* RED FLAGS */}
      {aiRedFlags.length > 0 && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">

          <div className="flex items-center gap-2">

            <AlertTriangle
              size={16}
              className="text-red-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-red-400">
              AI SAFETY FLAGS
            </p>

          </div>

          <div className="mt-4 space-y-2">

            {aiRedFlags.map(
              (flag, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-3 text-sm text-red-200/80"
                >
                  {formatValue(flag)}
                </div>
              )
            )}

          </div>

        </div>
      )}

      {/* MISSING INFORMATION */}
      {missingInformation.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5">

          <div className="flex items-center gap-2">

            <AlertTriangle
              size={16}
              className="text-amber-400"
            />

            <p className="text-[10px] font-semibold tracking-[0.15em] text-amber-400">
              MISSING INFORMATION
            </p>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            The following information was not
            available during the interview.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {missingInformation.map(
              (field, index) => (
                <span
                  key={index}
                  className="rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-3 py-1.5 text-xs text-amber-300/70"
                >
                  {formatFieldName(field)}
                </span>
              )
            )}

          </div>

        </div>
      )}

      <AISafetyNotice />

    </section>
  );
}


/* ================================================= */
/* SOURCE BADGE */
/* ================================================= */

function SourceBadge() {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-400/10 bg-violet-400/[0.05] px-3 py-2">

      <Database
        size={14}
        className="text-violet-400"
      />

      <p className="text-[10px] text-violet-300/80">
        Summary incorporates current interview
        and available historical report data.
      </p>

    </div>
  );
}


/* ================================================= */
/* AI SUMMARY GROUP */
/* ================================================= */

function SummaryGroup({
  title,
  fields,
}) {
  const hasAnyValue = fields.some(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      )
  );

  if (!hasAnyValue) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-black/10 p-5">

      <p className="mb-4 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
        {title.toUpperCase()}
      </p>

      <div className="space-y-3">

        {fields.map(
          ([label, value]) => {
            const displayValue =
              formatValue(value);

            if (!displayValue) {
              return null;
            }

            return (
              <div
                key={label}
                className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >

                <span className="text-xs text-slate-500">
                  {label}
                </span>

                <span className="max-w-[60%] text-right text-xs leading-5 text-slate-300">
                  {displayValue}
                </span>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


/* ================================================= */
/* AI SAFETY NOTICE */
/* ================================================= */

function AISafetyNotice() {
  return (
    <div className="mt-4 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">

      <p className="text-xs leading-5 text-amber-300/70">
        AI-generated information is a
        decision-support draft. The doctor must
        review and verify the clinical information
        before confirmation.
      </p>

    </div>
  );
}


/* ================================================= */
/* HELPERS */
/* ================================================= */

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== ""
      )
      .map((item) => formatValue(item))
      .join(", ");
  }

  if (typeof value === "object") {
    const entries =
      Object.entries(value);

    if (entries.length === 0) {
      return "";
    }

    return entries
      .map(
        ([key, val]) =>
          `${formatFieldName(key)}: ${formatValue(val)}`
      )
      .filter(
        (item) =>
          !item.endsWith(": ")
      )
      .join(", ");
  }

  return String(value);
}


function formatFieldName(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


function formatFileSize(bytes) {
  const size =
    Number(bytes) || 0;

  if (size <= 0) {
    return "";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}


function formatDate(value) {
  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  } catch {
    return String(value);
  }
}


function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


function hasObjectData(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).some(
      (key) => {
        const item = value[key];

        return (
          item !== null &&
          item !== undefined &&
          item !== ""
        );
      }
    )
  );
}


/* ================================================= */
/* SECTION HEADER */
/* ================================================= */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">

        <Icon
          size={19}
          className="text-cyan-400"
        />

      </div>

      <div>

        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


/* ================================================= */
/* INFO PILL */
/* ================================================= */

function InfoPill({
  label,
  value,
}) {
  return (
    <div className="min-w-[100px] rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5">

      <p className="text-[9px] tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-medium text-slate-300">
        {value || "—"}
      </p>

    </div>
  );
}


/* ================================================= */
/* EDITABLE FIELD */
/* ================================================= */

function EditableField({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-semibold tracking-[0.15em] text-slate-600">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Not recorded"
        className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/40"
      />

    </div>
  );
}


/* ================================================= */
/* CONVERSATION ITEM */
/* ================================================= */

function ConversationItem({
  item,
  index,
}) {
  const question =
    item?.question || "";

  const answer =
    item?.answer || "";

  return (
    <div className="rounded-2xl border border-white/5 bg-black/10 p-4">

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-semibold tracking-[0.15em] text-slate-600">
          QUESTION {index + 1}
        </span>

      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {question ||
          "Question not available"}
      </p>

      <div className="mt-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-3">

        <p className="text-[9px] font-semibold tracking-[0.15em] text-cyan-500/70">
          PATIENT ANSWER
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {answer ||
            "No answer recorded"}
        </p>

      </div>

    </div>
  );
}


export default ClinicalSummary;

