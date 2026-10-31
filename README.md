Uliong-AI

Evidence-driven threat intelligence for suspicious digital content.

Uliong-AI is an AI-assisted security analysis platform designed to help users investigate suspicious messages, URLs, images, and files.

It combines structured analysis workflows, AI-powered assessments, and security-oriented engineering principles to help surface potential threats, explain suspicious indicators, and guide informed decisions.

«Development status: Actively evolving. Uliong-AI is a developing security platform, not a certified security product. Some analysis capabilities remain incomplete or simulated.»

---

What Uliong-AI is designed to address

Digital threats often rely on deception, impersonation, urgency, and misplaced trust. Uliong-AI aims to make suspicious digital content easier to examine and understand.

Its intended analysis areas include:

- Phishing and credential harvesting
- Social engineering and impersonation
- Fraudulent payment and prize claims
- Suspicious URLs and account-verification requests
- Manipulative urgency and deceptive messaging
- Potentially malicious files and images

The goal is not simply to produce a verdict. It is to provide useful context around why content may be suspicious and what a user should consider doing next.

Platform capabilities

The current application includes:

Capability| Description
Authentication| User access through Supabase Auth
Dashboard| Overview of analysis activity and platform information
Scan centre| Interface for submitting text, URLs, images, and files
AI analysis| Provider-backed assessment through a server-side function
Analysis history| Access to stored analysis records
Settings| User preferences and AI provider selection

Some dashboard metrics and interface elements still rely on demonstration data. Their presence should not be interpreted as evidence of live threat detection.

How the system works

Uliong-AI follows a frontend-to-backend analysis workflow.

```text
USER SUBMISSION
|
v
FRONTEND SCAN WORKFLOW
|
v
AUTHENTICATED REQUEST
|
v
SUPABASE EDGE FUNCTION
|
v
TOKEN VERIFICATION
|
v
AI PROVIDER SELECTION
/           
v             v
OPENAI         GEMINI
\             /
v           v
RESPONSE VALIDATION
|
v
SUPABASE DATA LAYER
|
v
ANALYSIS PRESENTATION
```

The workflow is intended to:

1. Receive content submitted by an authenticated user.
2. Prepare the input for analysis.
3. Send an authenticated request to the Supabase Edge Function.
4. Verify the caller's access token.
5. Call the selected AI provider using a server-side credential.
6. Validate the provider's response and expected value ranges.
7. Access analysis records through the Supabase data layer.
8. Present the resulting assessment to the user.

Failed requests, timeouts, and malformed responses should be reported as failures rather than converted into fabricated successful verdicts.

Assessment model

An analysis may contain:

- Risk score
- Risk classification
- Identified threat indicators
- Explanation of suspicious signals
- Recommended next action
- Confidence level
- Available processing information

AI-generated assessments are probabilistic. They can be incorrect, incomplete, or uncertain. A low-risk result does not prove that content is safe, and a high-risk result is not proof of malicious intent.

Independent verification remains essential.

Technology stack

Layer| Technologies
Frontend| React 18, TypeScript
Build system| Vite
Styling| Tailwind CSS 4
Routing| React Router
State management| Zustand
Forms| React Hook Form
Validation| Zod
Data visualization| Recharts
Animation| Framer Motion
Backend services| Supabase
Authentication| Supabase Auth
Server-side execution| Supabase Edge Functions
AI integrations| OpenAI, Google Gemini
Edge runtime| Deno

Repository structure

```text
.
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
│   │   └── supabaseClient.ts
│   ├── pages/
│   ├── stores/
│   └── types/
├── supabase/
│   └── functions/
│       └── analyze-content/
│           └── index.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Getting started

Prerequisites

- Node.js compatible with the version of Vite specified in "package.json"
- npm
- A Supabase project
- An OpenAI API key or Google Gemini API key for provider-backed analysis

1. Clone the repository

```bash
git clone https://github.com/Josh-Fynly/uliong-ai.git
cd uliong-ai
```

2. Install dependencies

```bash
npm install
```

3. Configure frontend environment variables

Create a ".env.local" file in the project root:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Use your actual Supabase project values.

4. Start the development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

6. Preview the production build

```bash
npm run preview
```

Supabase and AI provider configuration

Deploy the Edge Function

```bash
supabase functions deploy analyze-content
```

Configure server-side secrets

Set the following secrets in the Supabase Edge Function environment:

Secret| Purpose
"OPENAI_API_KEY"| OpenAI API authentication
"GEMINI_API_KEY"| Google Gemini API authentication
"ALLOWED_ORIGINS"| Comma-separated list of permitted browser origins

The function also uses the Supabase-provided "SUPABASE_URL" and "SUPABASE_ANON_KEY" environment variables.

Never expose provider API keys in frontend code or commit credentials to version control.

Security engineering principles

Uliong-AI is being developed around the following principles:

1. Server-side credential handling

Provider credentials are kept in server-side environment secrets rather than exposed through frontend configuration.

2. Authentication boundaries

The analysis endpoint verifies the caller's bearer token before processing an authenticated request.

3. Untrusted input handling

Submitted content is treated as untrusted data, not as instructions that should override the analysis workflow.

4. Response validation

Provider responses are checked before the application accepts and presents them.

5. Explicit failure handling

Unavailable services, timeouts, and invalid responses should not produce fabricated successful assessments.

6. User data isolation

Analysis data access is designed around the authenticated Supabase user and database Row Level Security.

These controls are not a guarantee of application-wide security. Database policies, deployment configuration, origin restrictions, abuse prevention, logging, and access boundaries still require thorough verification.

Current limitations

Transparency about incomplete functionality is part of the project's engineering approach.

Area| Current status
Text analysis| AI-provider integration implemented
URL analysis| Scan workflow available; detection quality requires validation
Image OCR| Placeholder implementation; no real image recognition
TXT extraction| Text reading supported
PDF extraction| Simulated
DOCX extraction| Simulated
Dashboard metrics| Some demonstration data
Automated testing| Dedicated comprehensive test suite not currently declared
Dependency lockfile| No lockfile was present in the inspected repository tree

Do not treat simulated extraction, demonstration records, or AI-generated assessments as verified security detections.

Deployment

The frontend can be deployed to a static hosting provider that supports Vite.

Deployment setting| Value
Build command| "npm run build"
Build output| "dist"
Frontend configuration| "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"

The Supabase Edge Function must be deployed and configured separately. A successful frontend deployment does not establish that backend analysis is operational.

Engineering direction

Uliong-AI is being developed with a focus on:

- Evidence-driven threat assessment
- Reliable analysis workflows
- Secure backend integration
- Clear separation of frontend and server-side responsibilities
- Responsible use of AI in security-related decisions
- Continuous testing and verification

The long-term direction is to evolve beyond a basic scanning interface into a more capable security analysis platform.

Contributing

Contributions should be focused, reviewable, and consistent with the project's security principles.

Before submitting a change:

1. Understand the affected components and dependencies.
2. Identify relevant security assumptions and data boundaries.
3. Make a focused implementation change.
4. Run the available build and relevant checks.
5. Document new configuration requirements and known limitations.

Do not commit secrets, real user credentials, or private user data.

License

Uliong-AI is licensed under the Apache License, Version 2.0.

You may use, reproduce, modify, and distribute the project in accordance with the terms and conditions of the license.

See the "LICENSE" (LICENSE) file for the complete license text.

---

<p align="center">
  <strong>Uliong-AI</strong><br />
  Evidence before verdicts. Security through engineering.
</p>
