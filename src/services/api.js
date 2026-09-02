const API_BASE_URL = "http://127.0.0.1:8000";


// =========================================================
// SARVAM SPEECH TO TEXT
// =========================================================

export async function transcribeAudio(
  audioBlob,
  language
) {
  const formData = new FormData();

  formData.append(
    "audio",
    audioBlob,
    "patient-answer.webm"
  );

  formData.append(
    "language",
    language
  );

  const response = await fetch(
    `${API_BASE_URL}/api/stt`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Speech recognition failed"
    );
  }

  return response.json();
}


// =========================================================
// GROQ + QUESTION ENGINE
// =========================================================

export async function generateNextQuestion({
  language,
  consultationType,
  answer,
  history,
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/interview`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        language,

        consultation_type:
          consultationType,

        answer,

        history,
      }),
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "AI interview failed"
    );
  }

  return response.json();
}


// =========================================================
// SARVAM TEXT TO SPEECH
// =========================================================

export async function textToSpeech(
  text,
  language
) {
  const formData =
    new FormData();

  formData.append(
    "text",
    text
  );

  formData.append(
    "language",
    language
  );

  const response = await fetch(
    `${API_BASE_URL}/api/tts`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Text to speech failed"
    );
  }

  const audioBlob =
    await response.blob();

  return URL.createObjectURL(
    audioBlob
  );
}


// =========================================================
// UPLOAD MEDICAL REPORT
// =========================================================
// Patient uploads previous medical report.
// Backend:
// 1. Validates patient
// 2. Sends document to Sarvam Document AI
// 3. Performs OCR
// 4. Extracts medical information
// 5. Saves report in MongoDB
//
// Returns:
// {
//   success,
//   report_id,
//   patient_id,
//   filename,
//   ocr,
//   extracted_data
// }
// =========================================================

export async function uploadMedicalReport({
  patientId,
  file,
  language = "en",
}) {
  if (!patientId) {
    throw new Error(
      "Patient ID is missing"
    );
  }

  if (!file) {
    throw new Error(
      "Medical report file is missing"
    );
  }

  const formData =
    new FormData();

  formData.append(
    "patient_id",
    patientId
  );

  formData.append(
    "file",
    file
  );

  formData.append(
    "language",
    language
  );

  const response = await fetch(
    `${API_BASE_URL}/api/reports/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to upload medical report"
    );
  }

  return response.json();
}


// =========================================================
// CREATE CONSULTATION
// =========================================================
// previousReportIds is optional.
//
// If patient has previous reports:
// previousReportIds = ["id1", "id2"]
//
// If patient has NO previous reports:
// previousReportIds = []
// =========================================================
export async function createConsultation({
  patientId,
  language,
  consultationType,
  previousReportIds = [],
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/consultations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: patientId,
        language,
        consultation_type: consultationType,

        // Previous reports are optional.
        // No reports = []
        previous_report_ids: Array.isArray(previousReportIds)
          ? previousReportIds
          : [],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to create consultation."
    );
  }

  return data;
}
// =========================================================
// SAVE CONSULTATION ANSWER
// =========================================================

export async function saveConsultationAnswer({
  consultationId,
  question,
  answer,
  extracted,
  redFlag,
}) {
  if (!consultationId) {
    throw new Error(
      "Consultation ID is missing"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/consultations/${consultationId}/answer`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        question,

        answer,

        extracted,

        red_flag:
          redFlag,
      }),
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to save consultation answer"
    );
  }

  return response.json();
}


// =========================================================
// COMPLETE CONSULTATION
// =========================================================

export async function completeConsultation(
  consultationId
) {
  if (!consultationId) {
    throw new Error(
      "Consultation ID is missing"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/consultations/${consultationId}/complete`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to complete consultation"
    );
  }

  return response.json();
}


// =========================================================
// GET CONSULTATION
// =========================================================

export async function getConsultation(
  consultationId
) {
  if (!consultationId) {
    throw new Error(
      "Consultation ID is missing"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/consultations/${consultationId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to get consultation"
    );
  }

  return response.json();
}


// =========================================================
// CREATE PATIENT
// =========================================================

export async function createPatient({
  name,
  phone,
  email,
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/patients`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        name,
        phone,
        email,
      }),
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to create patient"
    );
  }

  return response.json();
}


// =========================================================
// PATIENT LOGIN
// =========================================================

export async function loginPatient({
  phone,
  email,
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/patients/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        phone,
        email,
      }),
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Patient login failed"
    );
  }

  return response.json();
}


// =========================================================
// GET PATIENT
// =========================================================

export async function getPatient(
  patientId
) {
  if (!patientId) {
    throw new Error(
      "Patient ID is missing"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/patients/${patientId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to get patient"
    );
  }

  return response.json();
}


// =========================================================
// GET COMPLETED CONSULTATIONS
// =========================================================

export async function getCompletedConsultations() {
  const response = await fetch(
    `${API_BASE_URL}/api/doctors/consultations/completed`
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to fetch completed consultations"
    );
  }

  return response.json();
}


// =========================================================
// GET ACTIVE CONSULTATIONS
// =========================================================

export async function getActiveConsultations() {
  const response = await fetch(
    `${API_BASE_URL}/api/doctors/consultations/active`
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to fetch active consultations"
    );
  }

  return response.json();
}


// =========================================================
// GET CONSULTATION DETAILS
// =========================================================

export async function getConsultationDetails(
  consultationId
) {
  if (!consultationId) {
    throw new Error(
      "Consultation ID is missing"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/doctors/consultations/${consultationId}`
  );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      error ||
        "Failed to fetch consultation"
    );
  }

  return response.json();
}