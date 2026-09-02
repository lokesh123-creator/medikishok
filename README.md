# 🏥 MediKiosk

### AI-Powered Clinical History Taking & Medical Document Intelligence Platform

> **Smart India Hackathon – SIH26047 | Patient Case-Taking Software**

MediKiosk is an **AI-powered patient-facing clinical history-taking platform** designed to reduce the burden on doctors in high-volume hospital OPDs.

The system allows patients to provide their medical history through **voice and guided interaction**, upload previous medical reports, automatically extract medical information using **OCR and AI**, and generate a **structured, physician-reviewable clinical summary** before the consultation begins.

---

## 🚨 Problem Statement

### The Clinical History-Taking Bottleneck

Government hospitals and AYUSH institutions handle a very large number of patients every day. Doctors often have only a few minutes per patient to:

* Understand the patient's chief complaint
* Take a detailed clinical history
* Review previous medical records
* Perform examination
* Formulate a diagnosis
* Counsel the patient
* Prescribe treatment

This creates several problems:

* Incomplete patient history
* Repeated questioning
* Missed medical information
* Difficult-to-read paper records
* Fragmented medical documents
* Limited consultation time
* Increased workload for doctors

AYUSH consultations have an additional challenge because Ayurvedic history taking requires detailed information such as:

* Prakriti
* Vikriti
* Agni
* Koshtha
* Ahara-Vihara
* Nidana
* Samprapti
* Dashavidha Pariksha parameters

MediKiosk addresses this problem by moving structured history collection **before the doctor consultation**.

---

# 💡 Our Solution

MediKiosk acts as an **AI Clinical History Assistant** between the patient and doctor.

Instead of the doctor spending valuable consultation time collecting the entire history manually:

```text
Patient
   ↓
MediKiosk
   ↓
Voice / Touch Interview
   ↓
AI Adaptive Questions
   ↓
Medical Document OCR
   ↓
Medical Information Extraction
   ↓
Clinical History Structuring
   ↓
AI Clinical Summary
   ↓
Doctor Review & Verification
```

The doctor receives a structured summary and can focus more on **clinical examination, reasoning, counselling and treatment**.

---

# ✨ Key Features

## 🗣️ 1. AI Conversational History Taking

Patients can communicate naturally with the system.

```text
Patient speaks
      ↓
Speech-to-Text
      ↓
Clinical Information Extraction
      ↓
Adaptive Question Engine
      ↓
Next Question
      ↓
Text-to-Speech
```

The system dynamically asks follow-up questions based on the patient's previous answers.

### Example

Patient:

> "I have chest pain."

The system can continue with questions related to:

* Onset
* Duration
* Location
* Character
* Severity
* Radiation
* Aggravating factors
* Relieving factors
* Associated symptoms

---

# 🎙️ 2. Voice + Touch Interaction

MediKiosk is designed for patients with different levels of literacy and digital experience.

Patients can interact using:

* 🎤 Voice
* 👆 Touch
* 🔘 Guided options
* 🔊 Audio prompts

This makes the system suitable for:

* Elderly patients
* First-time users
* Low-literacy users
* Rural patients
* Patients unfamiliar with digital applications

---

# 🌏 3. Multilingual Support

The platform is designed for Indian-language healthcare interactions.

The architecture supports:

```text
Patient Language
       ↓
Speech Recognition
       ↓
Clinical Understanding
       ↓
AI Question Generation
       ↓
Text-to-Speech
       ↓
Patient Language
```

The prototype supports configurable language handling including **English and Telugu**, with the architecture designed for additional Indian languages.

---

# 🧠 4. Adaptive Clinical Question Engine

MediKiosk does not simply ask a fixed list of questions.

The next question depends on:

* Chief complaint
* Previous answers
* Extracted clinical information
* Consultation type
* Clinical history state

```text
Chief Complaint
      ↓
Clinical History
      ↓
AI Question Engine
      ↓
Relevant Follow-up Question
      ↓
Patient Answer
      ↓
Updated Clinical State
      ↓
Next Question
```

This enables a more natural physician-like history-taking workflow.

---

# 🪷 5. AYUSH / Ayurveda History

For Ayurveda consultations, MediKiosk supports an extended history-taking workflow.

The system can capture information related to:

### Dashavidha Pariksha

* Prakriti
* Vikriti
* Sara
* Samhanana
* Pramana
* Satmya
* Sattva
* Ahara Shakti
* Vyayama Shakti
* Vaya

Additional Ayurvedic information includes:

* Ahara
* Vihara
* Agni
* Koshtha
* Nidana
* Samprapti

This allows the platform to support the requirements of AYUSH clinical environments.

---

# 🚨 6. Red Flag Detection

The system identifies potentially serious symptoms during the interview.

Examples include symptoms associated with:

* Acute chest pain
* Breathing difficulty
* Stroke-like symptoms
* Other potentially urgent conditions

When a potential red flag is detected, the system can indicate that the patient requires **priority clinical attention**.

> MediKiosk is a clinical decision-support and history-taking system. It does not independently diagnose or prescribe treatment.

---

# 📄 7. Previous Medical Report Digitization

Patients can upload previous medical documents such as:

* Laboratory reports
* Prescriptions
* Discharge summaries
* Medical documents
* Printed reports
* Images of reports

The prototype supports multiple uploaded reports.

```text
Medical Report
      ↓
Upload
      ↓
OCR
      ↓
Extract Medical Information
      ↓
Structure Data
      ↓
Store in MongoDB
      ↓
Link to Consultation
```

---

# 🔍 8. OCR + Medical Information Extraction

MediKiosk uses a document-AI pipeline to process medical reports.

The system extracts information such as:

### Patient Information

* Patient name
* Patient ID
* Age
* Sex

### Report Information

* Hospital
* Doctor
* Report date
* Test ID

### Investigation Information

* Test name
* Result
* Unit
* Reference range

For example:

```text
Hemoglobin
Result: 12
Unit: g/dL
Reference Range: 11.0 - 16.0
```

---

# 📚 9. Historical Medical Data

Previous reports are displayed separately from the current patient interview.

This allows the doctor to distinguish:

```text
CURRENT INTERVIEW
        +
HISTORICAL MEDICAL REPORTS
        ↓
AI CLINICAL SUMMARY
```

The system can use available historical report information together with the current consultation information when generating the summary.

---

# 🧾 10. Structured Clinical Summary

After the interview is completed, MediKiosk generates an AI-assisted clinical summary.

The summary can organize information into sections such as:

* Chief Complaint
* History of Present Illness
* Past Medical History
* Past Surgical History
* Drug History
* Allergy History
* Family History
* Personal History
* Review of Systems
* Previous Investigations
* Ayurvedic History
* Clinical Findings
* Missing Information

The doctor can review the generated information before using it clinically.

---

# 👨‍⚕️ 11. Doctor Dashboard

Doctors can view patient consultations through the Doctor Dashboard.

The dashboard provides access to:

* Active consultations
* Completed consultations
* Patient information
* Clinical history
* Previous medical reports
* Extracted medical information
* AI clinical summary

The doctor remains the final reviewer and decision-maker.

---

# 🔐 12. Consent & Privacy

MediKiosk follows a **consent-first design approach**.

The patient is informed before clinical information is collected.

The intended architecture includes:

```text
Patient
   ↓
Consent
   ↓
Voice / Medical Data
   ↓
Secure Backend
   ↓
Clinical Processing
   ↓
Doctor Review
```

The platform is designed with privacy and secure handling of sensitive medical information as core requirements.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │     PATIENT      │
                         └────────┬─────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │    React Frontend   │
                       │      MediKiosk      │
                       └──────────┬──────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
            Voice Interview               Medical Reports
                   │                             │
                   ▼                             ▼
              Speech-to-Text                 Upload
                   │                             │
                   ▼                             ▼
          Adaptive Question Engine          OCR / AI
                   │                             │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     FastAPI     │
                         │     Backend     │
                         └────────┬────────┘
                                  │
                   ┌──────────────┼──────────────┐
                   │              │              │
                   ▼              ▼              ▼
              Consultation     Medical       AI Summary
                Data           Reports        Generation
                   │              │              │
                   └──────────────┼──────────────┘
                                  │
                                  ▼
                            ┌───────────┐
                            │ MongoDB   │
                            └─────┬─────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Doctor Dashboard│
                         └─────────────────┘
```

---

# 🔄 End-to-End Workflow

### Step 1 — Patient Identification

Patient enters the MediKiosk system and provides the required identification information.

### Step 2 — Language Selection

Patient selects their preferred language.

### Step 3 — Consultation Type

Patient selects the consultation type, such as:

* General
* Ayurveda

### Step 4 — Consent

The system explains the data collection process and obtains consent.

### Step 5 — Previous Reports

Patient chooses:

```text
Do you have previous medical reports?

       YES             NO
        │               │
        ▼               │
    Upload Reports      │
        │               │
        ▼               │
      OCR                │
        │               │
        ▼               │
Medical Extraction       │
        │               │
        └───────┬────────┘
                ▼
```

### Step 6 — AI Clinical Interview

The patient answers questions through voice/touch.

### Step 7 — Adaptive Questioning

The AI determines relevant follow-up questions based on the collected information.

### Step 8 — Red Flag Detection

Potential urgent symptoms are identified and highlighted.

### Step 9 — Clinical Summary

The system combines:

```text
Current Interview
       +
Previous Medical Reports
       ↓
AI Clinical Summary
```

### Step 10 — Doctor Review

The doctor reviews the generated information and makes the final clinical decision.

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Browser MediaRecorder API

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

## Database

* MongoDB
* MongoDB Atlas

## AI / Document Processing

* Speech-to-Text
* Text-to-Speech
* Large Language Model
* Sarvam Document AI
* OCR
* Medical information extraction
* Adaptive question engine

---

# 📁 Project Structure

```text
MediKiosk/
│
├── backend/
│   │
│   ├── config/
│   │   └── database.py
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── consultation.py
│   │   ├── doctor.py
│   │   └── ...
│   │
│   ├── services/
│   │   ├── question_engine.py
│   │   ├── sarvam_document.py
│   │   └── ...
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── src/
│   │
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── PatientAuth.jsx
│   │   ├── Language.jsx
│   │   ├── ConsultationType.jsx
│   │   ├── Consent.jsx
│   │   ├── PreviousReports.jsx
│   │   ├── Interview.jsx
│   │   ├── ClinicalSummary.jsx
│   │   └── DoctorDashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MediKiosk.git
cd MediKiosk
```

---

# 🎨 Frontend Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Open a new terminal:

```bash
cd backend
```

Create virtual environment:

### Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend will normally run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
MONGODB_URI=your_mongodb_connection_string

SARVAM_API_KEY=your_sarvam_api_key

LLM_API_KEY=your_llm_api_key
```

> Never commit `.env` or API keys to GitHub.

Add to `.gitignore`:

```gitignore
.env
venv/
node_modules/
__pycache__/
*.pyc
```

---

# 🗄️ Database

MediKiosk uses MongoDB for storing application data.

Important collections include:

```text
patients
doctors
consultations
medical_reports
```

Previous medical reports are linked to consultations using report IDs.

Example:

```text
Consultation
     │
     ├── patientId
     ├── language
     ├── consultationType
     └── previousReportIds
                │
                ├── Medical Report 1
                ├── Medical Report 2
                └── Medical Report 3
```

---

# 🤖 AI Processing Pipeline

## Patient Voice

```text
Voice
 ↓
Speech-to-Text
 ↓
Clinical Text
 ↓
Information Extraction
 ↓
Question Engine
 ↓
Next Question
 ↓
Text-to-Speech
 ↓
Patient
```

## Medical Report

```text
PDF / Image
 ↓
Sarvam Document AI
 ↓
OCR
 ↓
Medical Information Extraction
 ↓
Structured Data
 ↓
MongoDB
```

## Final Summary

```text
Interview Data
       +
Historical Report Data
       ↓
Clinical Summary Generator
       ↓
Structured Clinical Summary
       ↓
Doctor Review
```

---

# 🩺 Example Clinical Summary

```text
Chief Complaint:
Fever for 3 days.

Associated Symptoms:
Cough, headache and gastrointestinal symptoms.

Current History:
Fever started in the morning.
Severity: 3/10.

Previous Investigation:
Historical CBC available from previous medical report.

Hemoglobin: 12 g/dL
RBC: 3.3 ×10⁶/uL
HCT: 36%
WBC: 6.7 ×10³/uL
PLT: 256 ×10³/uL
ESR: 2 mm/hr

Information Sources:
Current patient interview + previous medical reports
```

The generated summary is intended as a **draft for physician review**, not as an autonomous diagnosis.

---

# 🔒 Medical Safety

MediKiosk is designed as a **clinical history-taking and decision-support platform**.

It does **not** replace:

* Doctors
* Clinical examination
* Medical diagnosis
* Professional medical judgement
* Emergency medical services

AI-generated information must be reviewed and verified by a qualified healthcare professional.

---

# 🚀 Future Scope

The platform can be extended with:

* 🔗 ABDM / ABHA integration
* 🏥 Hospital Information System integration
* 📋 FHIR interoperability
* 🧾 Automated medical timeline
* ⚠️ Automated abnormal lab-value detection
* 👨‍⚕️ Doctor edit & confirmation workflow
* 🌐 More Indian languages
* 🎤 Improved noisy-environment speech recognition
* 🖨️ Kiosk hardware integration
* 🔐 Advanced healthcare security and audit logging
* 📊 Hospital analytics dashboard
* 📱 Patient digital health record integration

---

# 🎯 Impact

MediKiosk aims to:

### Reduce Doctor Workload

Doctors receive structured history before the consultation.

### Improve History Completeness

AI-guided questioning helps reduce missed history elements.

### Save Consultation Time

Previous reports are digitized and summarized before the doctor sees the patient.

### Improve Accessibility

Voice and touch interaction enables patients with different literacy levels to use the system.

### Support AYUSH Healthcare

The system can capture detailed Ayurvedic history requirements.

### Reduce Record Fragmentation

Physical reports can be converted into structured digital information.

---

# 🏆 Smart India Hackathon

**Problem Statement:** SIH26047

**Title:** Patient Case-Taking Software

**Organization:** Ministry of Ayush

**Department:** All India Institute of Ayurveda

**Theme:** Smart Automation

### Proposed Solution

**MediKiosk — AI Clinical History Software Platform**

The platform combines:

```text
AI
+
Voice
+
Clinical History
+
OCR
+
Medical Information Extraction
+
AYUSH History
+
Adaptive Questioning
+
Doctor Dashboard
```

to create a patient-centric clinical intake workflow.

---

# 👥 Team

### MediKiosk Team

Built for **Smart India Hackathon**.

> A software prototype focused on improving clinical history-taking efficiency in high-volume Indian hospital environments.

---

# 📜 Disclaimer

MediKiosk is a prototype developed for educational, research and hackathon purposes.

The system is not intended to provide autonomous medical diagnosis or treatment. All AI-generated clinical information should be reviewed and verified by qualified healthcare professionals before clinical use.

---

# ⭐ If You Like This Project

Give the repository a ⭐ and follow the project for future updates.

**MediKiosk — Let AI collect the history, so doctors can focus on the patient.**
