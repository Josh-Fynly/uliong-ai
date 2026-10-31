Uliong-AI

<p align="center">
  <strong>Evidence-driven threat intelligence for suspicious digital content.</strong>
  <br />
  An AI-assisted platform for investigating suspicious messages, links, and digital content.
  <br /><br />
  <a href="https://github.com/Josh-Fynly/uliong-ai">
    <img src="https://img.shields.io/badge/Repository-Uliong--AI-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge" alt="Apache 2.0 License" />
  <br /><br />
  <a href="#overview">Overview</a> ·
  <a href="#capabilities">Capabilities</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#technology">Technology</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#security">Security</a> ·
  <a href="#limitations">Limitations</a>
</p>---

Overview

Uliong-AI is an AI-assisted security analysis platform designed to help users investigate suspicious digital content and understand potential indicators of scams, phishing, and fraud.

Rather than returning a verdict without context, the platform is designed to structure an assessment around risk indicators, explanatory analysis, and recommended actions.

The engineering objective: make suspicious digital content easier to investigate while keeping analysis workflows explicit, traceable, and security-conscious.

«Project status: Under active development. Uliong-AI is an experimental security analysis platform, not a certified security product. Some capabilities are incomplete or simulated.»

---

Product Preview

<!-- Replace this section with genuine screenshots from the running application. --><p align="center">
  <em>Application screenshots will be added as the interface and end-to-end workflows are finalised.</em>
</p>---

Capabilities

Capability| Purpose| Current state
Text Analysis| Assess suspicious messages and text| AI integration implemented
URL Analysis| Assess suspicious links and URL submissions| AI-assisted workflow; no independent reputation engine
Threat Indicators| Return structured indicators and severity| Implemented in analysis response
Risk Assessment| Produce a score and risk classification| Implemented in analysis response
AI Explanation| Explain the assessment| Implemented in analysis response
Recommended Action| Suggest an appropriate next step| Implemented in analysis response
Image Inspection| Analyse submitted images| OCR not implemented
Document Inspection| Extract and assess document contents| PDF/DOCX extraction simulated
Analysis History| Retrieve and persist previous analyses| Data-access layer exists; workflow integration remains incomplete

---

How It Works

The analysis service separates browser-side application logic from AI provider communication.

flowchart TD
    A["User Submission"] --> B["Frontend Scan Workflow"]
    B --> C["Authenticated Request"]
    C --> D["Supabase Edge Function"]
    D --> E{"Bearer Token Verification"}

    E -->|Invalid| F["401 Unauthorized"]
    E -->|Valid| G["Request Validation"]

    G --> H["AI Provider Selection"]
    H --> I["OpenAI or Google Gemini"]
    I --> J["Response Parsing and Validation"]
    J --> K["Structured Analysis Result"]
    K --> L["Frontend Presentation"]

    style D fill:#172554,color:#fff,stroke:#3b82f6
    style E fill:#312e81,color:#fff,stroke:#818cf8
    style J fill:#164e63,color:#fff,stroke:#06b6d4
    style F fill:#7f1d1d,color:#fff,stroke:#ef4444

Analysis Response

The Edge Function returns a structured assessment containing:

Field| Description
"riskScore"| Numeric risk score from 0 to 100
"riskLevel"| "safe", "suspicious", or "high_risk"
"threatIndicators"| Identified indicators, severity, and descriptions
"aiExplanation"| Explanation of the assessment
"recommendedAction"| Suggested next step
"confidenceLevel"| Model-reported confidence value

The application maps scores to risk levels using configured thresholds. These are application-defined classifications, not independently validated security measurements.

AI-generated assessments are probabilistic. They do not independently establish that content is safe or malicious.

---

Architecture

Technology Stack

Layer| Technologies
Frontend| React 18, TypeScript
Build System| Vite
Styling| Tailwind CSS 4
Routing| React Router
State Management| Zustand
Forms| React Hook Form
Validation| Zod
Visualisation| Recharts
Animation| Framer Motion
Backend Services| Supabase
Authentication| Supabase Auth
Serverless Functions| Supabase Edge Functions
AI Providers| OpenAI, Google Gemini
Runtime| Deno

Project Structure

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

- Node.js compatible with the project's Vite version
- npm
- A Supabase project
- An OpenAI API key or Google Gemini API key for provider-backed analysis

1. Clone

git clone https://github.com/Josh-Fynly/uliong-ai.git
cd uliong-ai

2. Install

npm install

3. Configure Environment Variables

Create a ".env.local" file in the project root:

VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

Use your own Supabase project values. These variables configure the browser-side Supabase client; they are not AI provider credentials.

4. Run Locally

npm run dev

5. Build

npm run build

Preview the production build:

npm run preview

---

Backend Configuration

The AI analysis endpoint is implemented as a Supabase Edge Function:

"supabase/functions/analyze-content/index.ts"

Deploy

After installing and configuring the Supabase CLI, authenticating, and linking your project:

supabase functions deploy analyze-content

Server-Side Secrets

Configure the following secrets in your Supabase project:

Secret| Purpose
"OPENAI_API_KEY"| OpenAI API authentication
"GEMINI_API_KEY"| Google Gemini API authentication
"ALLOWED_ORIGINS"| Comma-separated list of permitted browser origins

The function also reads the Supabase-provided "SUPABASE_URL" and "SUPABASE_ANON_KEY" environment variables.

Never expose AI provider credentials in frontend code or commit them to version control.

---

Security Engineering

Security is a core engineering concern throughout Uliong-AI's development.

Implemented Service-Side Controls

- Authentication verification: The Edge Function verifies bearer tokens through Supabase authentication.
- Request validation: Request structure, scan type, provider selection, and content length are checked.
- Server-side credentials: AI provider keys are read from server-side environment variables.
- Origin restrictions: Browser origins are checked against configured allowed origins, with local development origins supported.
- Timeout handling: Provider requests use a configured 30-second timeout.
- Response validation: Provider output is parsed and checked against expected fields and value ranges.
- Explicit errors: Invalid requests, missing provider credentials, provider failures, and malformed responses return explicit errors.

Data Access

The Supabase data-access layer:

- Requires an authenticated session before analysis-data operations.
- Does not accept caller-supplied user IDs for persistence.
- Validates analysis drafts and persisted records.
- Uses the authenticated session for database requests.
- Is designed to rely on database Row Level Security for authoritative ownership enforcement.

Deployment caveat: The inspected repository does not include a database migration establishing the required RLS policies. The actual database policies must be configured and verified in Supabase before relying on them as an enforced isolation boundary.

Prompt-Injection Considerations

Submitted content is framed as untrusted data in the AI analysis prompt. This is a defensive prompt-design measure, not a guarantee that prompt injection or model manipulation can be prevented.

---

Limitations

The project documents incomplete functionality rather than presenting planned capabilities as completed features.

Area| Current state
Text Analysis| OpenAI and Gemini provider integrations implemented
URL Intelligence| AI-assisted assessment; no independent URL reputation or threat-feed engine
Image OCR| Placeholder; no active OCR or image recognition
TXT Extraction| Text reading supported
PDF Extraction| Simulated
DOCX Extraction| Simulated
Dashboard Metrics| Includes demonstration data
Analysis Persistence| Data-access functions exist; Scan Centre integration requires correction
Automated Testing| No comprehensive test suite declared in package scripts
Database Migrations| No migration included in the inspected repository tree
Dependency Locking| No lockfile included in the inspected repository tree

The current Scan Centre also requires integration work before its complete analysis-to-history workflow can be considered operational.

«Important: AI-generated assessments, simulated extraction, and demonstration records must not be treated as verified security detections. Always independently verify suspicious content.»

---

Deployment

Frontend

The Vite application can be deployed to a compatible static hosting provider.

Setting| Value
Build command| "npm run build"
Output directory| "dist"
Environment variables| "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"

Backend

Deploy the Supabase Edge Function independently and configure its required secrets.

A successful frontend deployment does not guarantee that authentication, database access, or AI analysis is operational. Verify each service separately.

---

Development Roadmap

The following are development priorities, not claims of completed functionality:

- Complete the Scan Centre analysis and persistence integration.
- Add database migrations and verify Row Level Security policies.
- Implement real image OCR.
- Implement actual PDF and DOCX text extraction.
- Improve URL and domain intelligence with independent reputation sources.
- Add automated tests for critical analysis and security workflows.
- Replace demonstration dashboard metrics with verified persisted data.
- Improve observability, error reporting, and operational reliability.

---

Contributing

Contributions should be focused, reviewable, and consistent with the project's security principles.

1. Understand the affected components and dependencies.
2. Identify relevant security assumptions and data boundaries.
3. Implement focused changes.
4. Run the production build and relevant checks.
5. Document new configuration requirements and known limitations.

Never commit secrets, real user credentials, or private user data.

---

License

Uliong-AI is licensed under the Apache License, Version 2.0.

You may use, reproduce, modify, and distribute the project in accordance with the terms and conditions of the license.

See "LICENSE" (LICENSE) for the complete license text.

---

<p align="center">
  <strong>ULIONG-AI</strong>
  <br />
  Evidence before verdicts.
  <br />
  <sub>Security through engineering.</sub>
  <br /><br />
  <a href="https://github.com/Josh-Fynly">Josh Fynly</a>
  · Backend and Systems Engineering
</p>
