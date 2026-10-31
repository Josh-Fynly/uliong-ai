Uliong-AI

"TypeScript" (https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
"React" (https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
"Supabase" (https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
"License" (https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)

«Evidence-driven threat intelligence for suspicious digital content.»

Uliong-AI is an AI-assisted security analysis platform designed to help users investigate suspicious messages, URLs, images, and files.

The project combines a structured analysis interface, server-side AI provider integrations, input validation, and security-oriented engineering principles to help surface potential threats, explain suspicious indicators, and guide informed decisions.

«Development Status: Actively evolving. Uliong-AI is an experimental security analysis platform, not a certified security product. Some analysis and file-processing capabilities remain incomplete, simulated, or awaiting integration.»

---

Core Capabilities

Uliong-AI is designed to investigate digital content associated with:

- Phishing and Credential Harvesting: Examining deceptive login requests and attempts to collect sensitive information.
- Social Engineering and Impersonation: Identifying suspicious urgency, deceptive authority claims, and impersonation patterns.
- Fraudulent Claims: Assessing suspicious payment requests, fake prize notifications, and deceptive financial claims.
- Suspicious URLs: Analysing submitted links and account-verification requests as text-based evidence.
- File and Image Inspection: Providing an interface for submitting images and documents, with actual extraction capabilities still under development.

The objective is not simply to produce a verdict. It is to provide context about suspicious indicators, explain the assessment, and suggest appropriate next steps.

---

Platform Overview

The current repository contains the following application components:

Component| Implementation Status
Landing Page| Implemented
Authentication| Supabase Auth integration
Dashboard| Implemented; includes demonstration data
Scan Centre| Interface and analysis workflow present; integration issues remain
AI Analysis Service| OpenAI and Gemini Edge Function integration
Analysis History| Supabase data-access functions and history interface present; end-to-end persistence requires integration
Settings| Settings interface and provider-selection state
Image OCR| Simulated placeholder
TXT Extraction| Implemented
PDF / DOCX Extraction| Simulated

The presence of an interface or supporting service does not necessarily mean its complete end-to-end functionality is operational.

---

Architecture and Workflow

Uliong-AI separates browser-side application logic from AI provider communication.

The intended analysis architecture is:

flowchart TD
    A[User Submission] --> B[Frontend Scan Workflow]
    B --> C[Authenticated Request]
    C --> D[Supabase Edge Function]
    D --> E{Bearer Token Verification}
    E -->|Invalid| F[401 Unauthorized]
    E -->|Valid| G[Request Validation]
    G --> H[AI Provider Selection]
    H --> I[OpenAI or Google Gemini]
    I --> J[Response Validation]
    J --> K[Analysis Result]
    K --> L[Frontend Presentation]

The Edge Function currently implements:

1. HTTP request-method handling.
2. Configurable browser-origin restrictions.
3. Bearer-token verification using Supabase authentication.
4. Request-body and scan-type validation.
5. Content-length restrictions.
6. Server-side AI provider selection.
7. OpenAI and Google Gemini API requests.
8. Provider request timeouts.
9. Structured response parsing and validation.
10. Explicit error responses for failed or malformed provider requests.

Important: The Edge Function returns an analysis result. Persisting that result as a user's historical analysis is a separate operation handled by the frontend data-access layer. The complete Scan Centre-to-persistence integration still requires work.

---

Assessment Model

The AI analysis response is structured around:

Field| Description
Risk Score| Numeric assessment from 0 to 100
Risk Level| Safe, suspicious, or high risk
Threat Indicators| Identified indicators and their severity
AI Explanation| Contextual explanation of the assessment
Recommended Action| Suggested next step
Confidence Level| Model-reported confidence in the assessment

The risk classification currently uses these score ranges:

Risk Score| Classification
0–30| Safe
31–60| Suspicious
61–100| High Risk

These classifications are application-defined thresholds, not independently validated security measurements.

AI-generated assessments are probabilistic. They may be incorrect, incomplete, or uncertain. A low-risk result does not establish that content is safe, and a high-risk result does not independently prove malicious intent.

Independent verification remains essential.

---

Technology Stack

Layer| Technologies
Frontend| React 18, TypeScript
Build System| Vite
Styling| Tailwind CSS 4
Routing| React Router
State Management| Zustand
Forms| React Hook Form
Validation| Zod
Data Visualization| Recharts
Animation| Framer Motion
Backend Services| Supabase
Authentication| Supabase Auth
Server-side Execution| Supabase Edge Functions
AI Integrations| OpenAI, Google Gemini
Edge Runtime| Deno

---

Repository Structure

uliong-ai/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   │   ├── aiService.ts
│   │   ├── analysesApi.ts
│   │   ├── analysisStatus.ts
│   │   ├── constants.ts
│   │   ├── ocrService.ts
│   │   ├── supabaseClient.ts
│   │   └── utils.ts
│   ├── pages/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── functions/
│       └── analyze-content/
│           └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE
└── README.md

---

Getting Started

Prerequisites

- Node.js compatible with the project's Vite version.
- npm.
- A Supabase project.
- An OpenAI API key or Google Gemini API key for provider-backed analysis.

1. Clone the Repository

git clone https://github.com/Josh-Fynly/uliong-ai.git
cd uliong-ai

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a ".env.local" file in the project root:

VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

Replace the placeholders with your actual Supabase project values.

These variables configure the browser-side Supabase client. They are not substitutes for server-side AI provider credentials.

4. Start the Development Server

npm run dev

5. Build for Production

npm run build

6. Preview the Production Build

npm run preview

---

Backend and AI Configuration

AI provider communication is implemented in the Supabase Edge Function:

"supabase/functions/analyze-content/index.ts"

Deploy the Edge Function

Install and configure the Supabase CLI, authenticate, link your project, and deploy:

supabase functions deploy analyze-content

Configure Server-Side Secrets

Configure the following secrets in the Supabase project:

Secret| Purpose
"OPENAI_API_KEY"| Authenticates requests to OpenAI
"GEMINI_API_KEY"| Authenticates requests to Google Gemini
"ALLOWED_ORIGINS"| Comma-separated list of permitted browser origins

The Edge Function also reads the Supabase-provided "SUPABASE_URL" and "SUPABASE_ANON_KEY" environment variables.

Never expose AI provider credentials in frontend code, browser storage, or committed configuration files.

---

Security Engineering Principles

Uliong-AI is being developed around the following engineering principles:

1. Server-Side Credential Handling

AI provider requests are made from the Supabase Edge Function. Provider credentials are read from server-side environment variables rather than supplied by the browser.

2. Authentication Verification

The analysis endpoint extracts the bearer token and verifies it through Supabase authentication before processing the request.

3. Input Validation

The Edge Function validates the request structure, scan type, provider selection, and maximum content length before initiating provider requests.

4. Untrusted Content Handling

Submitted content is explicitly framed as untrusted data in the AI analysis prompt. This is a prompt-level safeguard, not a guarantee against prompt injection.

5. Structured Response Validation

Provider responses are parsed and checked for required fields, valid risk-score ranges, confidence values, and threat-indicator structures before being returned.

6. Explicit Failure Handling

Provider errors, timeouts, unavailable credentials, and malformed responses produce explicit failures rather than fabricated successful assessments.

7. Data Access Boundaries

The Supabase data-access module requires an authenticated session and does not accept caller-supplied user IDs for persistence operations. It is designed to rely on database Row Level Security for authoritative record ownership.

The repository does not currently include a database migration that demonstrates the deployed RLS policies. Their actual configuration must be verified in the Supabase project.

These controls represent implemented components and design principles. They do not establish that the entire application is secure or production-ready.

---

Current Limitations and Transparency

Engineering transparency requires documenting incomplete functionality.

Area| Current Status
Text Analysis| OpenAI and Gemini provider integrations implemented
URL Analysis| URL scan mode exists; input is assessed through the AI analysis workflow rather than an independent URL reputation engine
Image OCR| Simulated placeholder; no real image recognition or OCR
TXT Extraction| Actual text-file reading supported
PDF Extraction| Simulated; real document extraction not implemented
DOCX Extraction| Simulated; real document extraction not implemented
Dashboard Metrics| Includes demonstration data
Analysis Persistence| Supabase data-access functions exist; Scan Centre integration requires correction
Automated Testing| No comprehensive test suite currently declared in package scripts
Database Migrations| No migration included in the inspected repository tree
Dependency Lockfile| No lockfile included in the inspected repository tree

The current Scan Centre also requires integration work before its analysis workflow can be considered fully operational.

Do not interpret simulated extraction, demonstration records, or AI-generated assessments as verified security detections.

---

Deployment

Frontend

The frontend can be deployed to a static hosting provider that supports Vite applications, such as Vercel or Netlify.

Setting| Value
Build Command| "npm run build"
Output Directory| "dist"
Environment Variables| "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"

Backend

The Supabase Edge Function must be deployed and configured independently.

A successful frontend deployment does not establish that authentication, database access, or AI analysis is operational. Those services require their own configuration and verification.

---

Engineering Direction

The project's development direction includes:

- Evidence-driven threat assessment.
- More reliable analysis and persistence workflows.
- Improved URL and domain intelligence.
- Actual image OCR and document extraction.
- Stronger validation and security testing.
- Verified database access controls.
- Clear separation of frontend and server-side responsibilities.
- Responsible use of AI in security-related decisions.

The long-term objective is to evolve Uliong-AI beyond a basic scanning interface into a more capable security analysis platform.

---

Contributing

Contributions should be focused, reviewable, and consistent with the project's security principles.

Before submitting a change:

1. Understand the affected components and dependencies.
2. Identify relevant security assumptions and data boundaries.
3. Implement a focused change.
4. Run the production build and relevant checks.
5. Document new configuration requirements and known limitations.

Never commit secrets, real user credentials, or private user data.

---

License

Uliong-AI is licensed under the Apache License, Version 2.0.

You may use, reproduce, modify, and distribute the project in accordance with the terms and conditions of the license.

See the "LICENSE" (LICENSE) file for the complete license text.

---

<p align="center">
  <strong>Uliong-AI</strong><br />
  Evidence before verdicts. Security through engineering.<br />
  <sub>Built by <a href="https://github.com/Josh-Fynly">Josh Fynly</a> — Backend and Systems Engineer</sub>
</p>
