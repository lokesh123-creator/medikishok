const API_BASE_URL = "http://127.0.0.1:8000";

export async function transcribeAudio(audioBlob, language) {
  const formData = new FormData();

  formData.append("audio", audioBlob, "patient-answer.webm");
  formData.append("language", language);

  const response = await fetch(`${API_BASE_URL}/api/stt`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Speech recognition failed");
  }

  return response.json();
}

export async function generateNextQuestion({
  language,
  consultationType,
  answer,
  history,
}) {
  const response = await fetch(`${API_BASE_URL}/api/interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      consultation_type: consultationType,
      answer,
      history,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "AI interview failed");
  }

  return response.json();
}

export async function textToSpeech(text, language) {
  const formData = new FormData();

  formData.append("text", text);
  formData.append("language", language);

  const response = await fetch(`${API_BASE_URL}/api/tts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Text to speech failed");
  }

  const audioBlob = await response.blob();

  return URL.createObjectURL(audioBlob);
}

export async function createConsultation({
  patientId,
  language,
  consultationType,
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
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      error || "Failed to create consultation"
    );
  }

  return response.json();
}

export async function saveConsultationAnswer({
  consultationId,
  question,
  answer,
  extracted,
  redFlag,
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/consultations/${consultationId}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        answer,
        extracted,
        red_flag: redFlag,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      error || "Failed to save consultation answer"
    );
  }

  return response.json();
}