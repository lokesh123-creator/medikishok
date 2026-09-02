import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  X,
  Loader2,
  ShieldCheck,
  FileUp,
} from "lucide-react";

import {
  uploadMedicalReport,
  createConsultation,
} from "../services/api";

export default function PreviousReports({
  patientId,
  language,
  consultationType,
  onComplete,
  onBack,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [hasReports, setHasReports] = useState(null);

  const [reports, setReports] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [creatingConsultation, setCreatingConsultation] =
    useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // HANDLE FILE SELECTION
  // =========================================================

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setError("");

    // Maximum 5 reports
    if (reports.length + files.length > 5) {
      setError(
        "You can upload a maximum of 5 reports."
      );

      event.target.value = "";
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    // Validate all files first
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `${file.name} is not a supported file. Please upload PDF, JPG or PNG.`
        );

        event.target.value = "";
        return;
      }

      // 10 MB limit
      if (file.size > 10 * 1024 * 1024) {
        setError(
          `${file.name} is larger than 10 MB.`
        );

        event.target.value = "";
        return;
      }
    }

    // =======================================================
    // UPLOAD REPORTS
    // =======================================================

    setUploading(true);

    try {
      for (const file of files) {
        const result = await uploadMedicalReport({
          patientId,
          file,
          language,
        });

        console.log(
          "Medical report uploaded:",
          result
        );

        setReports((previous) => [
          ...previous,
          {
            id: result.report_id,

            filename:
              result.filename || file.name,

            extractedData:
              result.extracted_data || null,

            ocr:
              result.ocr || null,
          },
        ]);
      }
    } catch (err) {
      console.error(
        "Report upload error:",
        err
      );

      setError(
        err.message ||
          "Failed to upload report."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };


  // =========================================================
  // REMOVE REPORT
  // =========================================================

  const removeReport = (reportId) => {
    setReports((previous) =>
      previous.filter(
        (report) => report.id !== reportId
      )
    );

    setError("");
  };


  // =========================================================
  // CREATE CONSULTATION
  // =========================================================

  const handleContinue = async () => {
    setError("");

    // Validate report selection
    if (hasReports === null) {
      setError(
        "Please select whether you have previous medical reports."
      );

      return;
    }

    // If YES, at least one report is required
    if (
      hasReports === true &&
      reports.length === 0
    ) {
      setError(
        "Please upload at least one previous report."
      );

      return;
    }

    // Protect against duplicate requests
    if (creatingConsultation) {
      return;
    }

    // Collect report IDs
    const previousReportIds = reports.map(
      (report) => report.id
    );

    setCreatingConsultation(true);

    try {
      console.log(
        "======================================"
      );

      console.log(
        "Creating consultation..."
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

      // =====================================================
      // CREATE CONSULTATION
      // =====================================================

      const result = await createConsultation({
        patientId,
        language,
        consultationType,
        previousReportIds,
      });

      console.log(
        "Consultation created:",
        result
      );

      // =====================================================
      // GET CONSULTATION ID
      // =====================================================

      const consultationId =
        result.consultation_id;

      if (!consultationId) {
        throw new Error(
          "Consultation ID was not returned by the server."
        );
      }

      console.log(
        "Consultation ID:",
        consultationId
      );

      // =====================================================
      // SEND DATA TO APP
      // =====================================================

      if (onComplete) {
        onComplete({
          consultationId,
          previousReportIds,
        });
      }
    } catch (err) {
      console.error(
        "Create consultation error:",
        err
      );

      setError(
        err.message ||
          "Failed to create consultation."
      );
    } finally {
      setCreatingConsultation(false);
    }
  };


  // =========================================================
  // PATIENT PROTECTION
  // =========================================================

  if (!patientId) {
    return (
      <div className="min-h-screen bg-[#050b14] text-white flex items-center justify-center p-6">
        <div className="text-center">

          <h2 className="text-xl font-semibold mb-2">
            Patient session not found
          </h2>

          <p className="text-slate-400 mb-6">
            Please start the consultation again.
          </p>

          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050b14] text-white relative overflow-hidden">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px]" />

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 border-b border-white/5">

        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={onBack}
            disabled={creatingConsultation}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition disabled:opacity-50"
          >

            <ArrowLeft size={18} />

            Back

          </button>


          <div className="text-xs tracking-[0.25em] text-cyan-400">
            STEP 05 / 06
          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mb-5">

            <FileText
              size={26}
              className="text-cyan-400"
            />

          </div>


          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">

            Do you have previous

            <span className="text-cyan-400">
              {" "}medical reports?
            </span>

          </h1>


          <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">

            You can upload previous prescriptions,
            lab reports, scans, or medical documents.
            This information can help the doctor understand
            your medical history.

          </p>

        </div>


        {/* ===================================================
            REPORT SELECTION
        =================================================== */}

        <div className="grid md:grid-cols-2 gap-5">

          {/* =================================================
              NO REPORTS
          ================================================= */}

          <button
            type="button"
            disabled={
              uploading ||
              creatingConsultation
            }
            onClick={() => {

              setHasReports(false);

              setReports([]);

              setError("");

            }}
            className={`
              text-left p-6 rounded-2xl border transition-all

              ${
                hasReports === false
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }

              disabled:opacity-50
            `}
          >

            <div className="flex items-start justify-between">

              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">

                <X
                  size={22}
                  className="text-slate-300"
                />

              </div>


              {hasReports === false && (
                <CheckCircle2
                  size={22}
                  className="text-cyan-400"
                />
              )}

            </div>


            <h2 className="mt-5 text-lg font-semibold">
              No previous reports
            </h2>


            <p className="mt-2 text-sm text-slate-400 leading-relaxed">

              I don't have any previous medical
              reports. Continue with the AI interview.

            </p>

          </button>


          {/* =================================================
              HAS REPORTS
          ================================================= */}

          <button
            type="button"
            disabled={
              uploading ||
              creatingConsultation
            }
            onClick={() => {

              setHasReports(true);

              setError("");

            }}
            className={`
              text-left p-6 rounded-2xl border transition-all

              ${
                hasReports === true
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }

              disabled:opacity-50
            `}
          >

            <div className="flex items-start justify-between">

              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">

                <FileUp
                  size={22}
                  className="text-cyan-400"
                />

              </div>


              {hasReports === true && (
                <CheckCircle2
                  size={22}
                  className="text-cyan-400"
                />
              )}

            </div>


            <h2 className="mt-5 text-lg font-semibold">
              Yes, I have reports
            </h2>


            <p className="mt-2 text-sm text-slate-400 leading-relaxed">

              Upload previous medical documents
              for AI-assisted extraction.

            </p>

          </button>

        </div>


        {/* ===================================================
            UPLOAD SECTION
        =================================================== */}

        {hasReports === true && (

          <div className="mt-8">

            {/* =================================================
                UPLOAD BOX
            ================================================= */}

            <label
              className={`
                block border-2 border-dashed rounded-2xl p-10
                text-center transition

                ${
                  uploading
                    ? "border-cyan-400/30 bg-cyan-400/5 cursor-wait"
                    : "border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.02] cursor-pointer"
                }
              `}
            >

              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFiles}
                disabled={
                  uploading ||
                  creatingConsultation
                }
                className="hidden"
              />


              {uploading ? (
                <>

                  <Loader2
                    size={34}
                    className="mx-auto text-cyan-400 animate-spin"
                  />

                  <p className="mt-4 font-medium">
                    Processing your report...
                  </p>

                  <p className="mt-2 text-sm text-slate-500">

                    OCR and medical information
                    extraction are in progress.

                  </p>

                </>
              ) : (
                <>

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-400/10 flex items-center justify-center">

                    <Upload
                      size={25}
                      className="text-cyan-400"
                    />

                  </div>


                  <p className="mt-5 font-medium">
                    Upload medical reports
                  </p>


                  <p className="mt-2 text-sm text-slate-500">

                    PDF, JPG or PNG · Maximum 10 MB each

                  </p>

                </>
              )}

            </label>


            {/* =================================================
                UPLOADED REPORTS
            ================================================= */}

            {reports.length > 0 && (

              <div className="mt-6 space-y-3">

                <p className="text-sm text-slate-400">

                  Uploaded reports ({reports.length})

                </p>


                {reports.map((report) => (

                  <div
                    key={report.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]"
                  >

                    <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">

                      <FileText
                        size={19}
                        className="text-cyan-400"
                      />

                    </div>


                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium truncate">

                        {report.filename}

                      </p>


                      <div className="flex items-center gap-2 mt-1">

                        <CheckCircle2
                          size={13}
                          className="text-emerald-400"
                        />

                        <span className="text-xs text-slate-500">

                          Processed successfully

                        </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      disabled={
                        uploading ||
                        creatingConsultation
                      }
                      onClick={() =>
                        removeReport(report.id)
                      }
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white disabled:opacity-50"
                    >

                      <X size={17} />

                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="mt-5 p-4 rounded-xl border border-red-400/20 bg-red-400/5 text-red-300 text-sm">

            {error}

          </div>

        )}


        {/* ===================================================
            PRIVACY
        =================================================== */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">

          <ShieldCheck
            size={15}
            className="text-cyan-400"
          />

          Your medical information is processed
          for this consultation.

        </div>


        {/* ===================================================
            CONTINUE
        =================================================== */}

        <div className="mt-10 flex justify-end">

          <button
            type="button"
            onClick={handleContinue}
            disabled={
              uploading ||
              creatingConsultation
            }
            className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {creatingConsultation ? (
              <>

                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Starting consultation...

              </>
            ) : (
              <>

                Continue

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />

              </>
            )}

          </button>

        </div>

      </main>

    </div>
  );
}