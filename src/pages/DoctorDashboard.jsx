import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Loader2,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import {
  getActiveConsultations,
  getCompletedConsultations,
} from "../services/api";

function DoctorDashboard({ onOpenConsultation }) {
  const [completed, setCompleted] = useState([]);
  const [active, setActive] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [completedResult, activeResult] = await Promise.all([
        getCompletedConsultations(),
        getActiveConsultations(),
      ]);

      setCompleted(completedResult?.consultations || []);
      setActive(activeResult?.consultations || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.message || "Unable to load doctor dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredCompleted = completed.filter((item) => {
    const patientName =
      item?.patient?.name?.toLowerCase() || "";

    const consultationType =
      item?.consultation?.consultationType?.toLowerCase() || "";

    const query = search.toLowerCase();

    return (
      patientName.includes(query) ||
      consultationType.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative z-10">

        {/* Header */}
        <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <HeartPulse className="h-6 w-6 text-cyan-400" />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-[0.16em]">
                  MEDIKIOSK
                </h1>

                <p className="text-[10px] tracking-[0.2em] text-slate-500">
                  DOCTOR PORTAL
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300 sm:block">
                AI System Online
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                👨‍⚕️
              </div>

            </div>

          </div>

        </header>


        {/* Main */}
        <main className="mx-auto max-w-7xl px-6 py-10">

          {/* Welcome */}
          <div className="mb-10">

            <p className="text-sm font-medium text-cyan-400">
              CLINICAL WORKSPACE
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Good morning, Doctor
            </h2>

            <p className="mt-3 text-slate-400">
              Review AI-assisted patient histories and verify
              clinical information.
            </p>

          </div>


          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-3">

            <StatCard
              icon={Users}
              title="Completed Cases"
              value={completed.length}
              description="Ready for review"
            />

            <StatCard
              icon={Activity}
              title="Active Cases"
              value={active.length}
              description="Currently in progress"
            />

            <StatCard
              icon={CheckCircle2}
              title="Total Cases"
              value={completed.length + active.length}
              description="Today's workspace"
            />

          </div>


          {/* Cases */}
          <section className="mt-10">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-2xl font-bold">
                  Patient Cases
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  AI-generated clinical histories
                </p>
              </div>

              <div className="flex gap-3">

                {/* Search */}
                <div className="relative">

                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patient..."
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-white/[0.04]
                      py-3 pl-11 pr-4
                      text-sm
                      outline-none
                      placeholder:text-slate-600
                      focus:border-cyan-400/40
                      sm:w-64
                    "
                  />

                </div>

                <button
                  onClick={loadDashboard}
                  className="
                    flex items-center justify-center
                    rounded-xl border border-white/10
                    bg-white/[0.04]
                    px-4
                    text-slate-400
                    transition
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  <RefreshCw size={18} />
                </button>

              </div>

            </div>


            {/* Loading */}
            {loading && (
              <div className="mt-8 flex min-h-[250px] items-center justify-center">

                <div className="flex items-center gap-3 text-slate-400">

                  <Loader2 className="animate-spin" size={22} />

                  Loading patient cases...

                </div>

              </div>
            )}


            {/* Error */}
            {!loading && error && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">

                <div className="flex items-start gap-4">

                  <AlertTriangle className="mt-1 text-red-400" />

                  <div>

                    <h4 className="font-semibold text-red-300">
                      Unable to load cases
                    </h4>

                    <p className="mt-1 text-sm text-red-300/70">
                      {error}
                    </p>

                    <button
                      onClick={loadDashboard}
                      className="mt-4 rounded-xl bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20"
                    >
                      Try again
                    </button>

                  </div>

                </div>

              </div>
            )}


            {/* Empty */}
            {!loading &&
              !error &&
              filteredCompleted.length === 0 && (

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-14 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    <Users className="text-slate-500" />
                  </div>

                  <h4 className="mt-5 text-lg font-semibold">
                    No completed cases
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Completed patient consultations will appear here.
                  </p>

                </div>
              )}


            {/* Case list */}
            {!loading &&
              !error &&
              filteredCompleted.length > 0 && (

                <div className="mt-6 space-y-4">

                  {filteredCompleted.map((item) => {

                    const consultation = item.consultation;
                    const patient = item.patient;

                    const history =
                      consultation?.clinicalHistory || {};

                    const hasRedFlags =
                      consultation?.redFlags?.length > 0;

                    return (
                      <div
                        key={consultation._id}
                        className="
                          group
                          rounded-3xl
                          border border-white/10
                          bg-white/[0.03]
                          p-5
                          transition-all
                          hover:border-cyan-400/20
                          hover:bg-white/[0.05]
                        "
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          {/* Patient */}
                          <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                              👤
                            </div>

                            <div>

                              <h4 className="text-lg font-semibold">
                                {patient?.name || "Unknown Patient"}
                              </h4>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                                <span>
                                  {consultation?.consultationType === "ayurveda"
                                    ? "🌿 Ayurveda"
                                    : "🩺 Clinical"}
                                </span>

                                <span>•</span>

                                <span>
                                  {consultation?.language?.toUpperCase()}
                                </span>

                              </div>

                            </div>

                          </div>


                          {/* Complaint */}
                          <div className="min-w-0 lg:flex-1 lg:px-8">

                            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
                              CHIEF COMPLAINT
                            </p>

                            <p className="mt-1 truncate text-sm text-slate-300">
                              {history?.chiefComplaint || "Not recorded"}
                            </p>

                          </div>


                          {/* Duration */}
                          <div className="flex items-center gap-2 text-sm text-slate-400">

                            <Clock3 size={16} />

                            {history?.duration || "—"}

                          </div>


                          {/* Red flag */}
                          {hasRedFlags && (
                            <div className="flex items-center gap-2 rounded-full bg-red-400/10 px-3 py-2 text-xs text-red-300">

                              <AlertTriangle size={14} />

                              Red Flag

                            </div>
                          )}


                          {/* Review */}
                          <button
                            onClick={() =>
                              onOpenConsultation?.(consultation._id)
                            }
                            className="
                              flex items-center justify-center
                              gap-2 rounded-xl
                              bg-cyan-400
                              px-5 py-3
                              text-sm font-semibold
                              text-slate-950
                              transition
                              hover:bg-cyan-300
                            "
                          >

                            Review

                            <ArrowRight size={17} />

                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

          </section>

        </main>

      </div>
    </div>
  );
}


function StatCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-4xl font-bold">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {description}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
          <Icon className="text-cyan-400" size={21} />
        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;