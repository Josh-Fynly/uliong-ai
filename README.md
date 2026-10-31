Uliong-AI

Evidence-driven, AI-assisted threat analysis for suspicious digital content.

Uliong-AI is a web application designed to help users examine potentially malicious messages, URLs, images, and files. It combines a structured analysis workflow with AI-assisted assessment to identify suspicious signals, explain potential risks, and recommend practical next steps.

The project follows a security-first development approach: submitted content is treated as untrusted data, provider credentials are kept server-side, and analysis responses are validated before the application consumes them.

«Development status: Active development. This is not a certified security product. Some input-processing capabilities remain placeholders and are not production-ready.»

Core objectives

Uliong-AI is being developed to assist with identifying and understanding:

- Phishing and credential-harvesting attempts
- Impersonation and social engineering
- Fraudulent payment and prize claims
- Suspicious URLs and account-verification requests
- Manipulative urgency and other scam indicators

An assessment includes a risk score, risk classification, threat indicators, explanation, recommended action, confidence level, and available pipeline timing information.

AI-generated assessments are decision-support information, not proof that content is safe or malicious. Important requests should always be independently verified.

Application capabilities

The current application includes:

- Public landing page
- Authentication and application entry point
- Threat-analysis dashboard
- Scan centre for text, URL, image, and file inputs
- Analysis history
- User settings and provider selection
- Supabase-backed authentication and analysis services
- OpenAI and Google Gemini provider integration through a server-side Edge Function

Some interface elements and dashboard metrics still use demonstration data.

Architecture

The application follows a frontend-to-backend analysis flow:

1. Input: A user submits content for examination.
2. Preparation: The scan workflow prepares the content for analysis.
3. Authentication: The application invokes the Supabase Edge Function using the authenticated session.
4. Identity verification: The Edge Function verifies the caller's Supabase access token.
5. Provider execution: The function calls the selected AI provider using a server-side credential.
6. Validation: The provider response is checked against the expected structure and value constraints.
7. Persistence: Authenticated analysis records are accessed through the Supabase data layer.
8. Presentation: The application displays the assessment and available history.

The system is designed to report failures explicitly when services are unavailable, provider calls time out, or responses are malformed. It should not manufacture a successful threat verdict when analysis fails.

Technology stack

Layer| Technology
Frontend| React 18, TypeScript
Build tooling| Vite
Styling| Tailwind CSS 4
Routing| React Router
State management| Zustand
Forms| React Hook Form
Validation| Zod
Charts| Recharts
Animation| Framer Motion
Backend services| Supabase
Authentication| Supabase Auth
Server-side analysis| Supabase Edge Functions
AI providers| OpenAI, Google Gemini
Edge runtime| Deno

Project structure

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

Requirements

- Node.js compatible with the Vite version specified in "package.json"
- npm
- A Supabase project
- An OpenAI API key or Google Gemini API key for provider-backed analysis

Local development

Clone the repository after its rename:

```bash
git clone https://github.com/Josh-Fynly/uliong-ai.git
cd uliong-ai
npm install
```

Create ".env.local" in the project root:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The current package scripts provide development, build, and preview commands. A dedicated automated test suite and separate TypeScript type-check script are not currently declared.

Supabase and AI configuration

The frontend uses:

Variable| Purpose
"VITE_SUPABASE_URL"| Supabase project URL
"VITE_SUPABASE_ANON_KEY"| Public client key for Supabase

Deploy the analysis function:

```bash
supabase functions deploy analyze-content
```

Configure the following secrets in the Supabase Edge Function environment:

Secret| Purpose
"OPENAI_API_KEY"| OpenAI provider authentication
"GEMINI_API_KEY"| Google Gemini provider authentication
"ALLOWED_ORIGINS"| Comma-separated permitted browser origins

The function also uses the Supabase-provided "SUPABASE_URL" and "SUPABASE_ANON_KEY" environment variables.

Never commit actual credentials, access tokens, or production secrets.

Security principles

The current implementation includes several security-oriented controls:

- AI provider requests are routed through the Supabase Edge Function.
- Provider credentials are read from server-side secrets.
- The analysis endpoint verifies the caller's bearer token.
- Submitted content is explicitly treated as untrusted data in the AI prompt.
- Provider responses are validated before being accepted.
- Risk scores and confidence values are constrained to expected ranges.
- Provider requests have a timeout.
- Frontend analysis data access uses the authenticated Supabase user.
- Database access is designed to rely on Row Level Security.

These controls do not establish that the entire application is secure. Production readiness requires verification of deployed database policies, authentication boundaries, function configuration, origin restrictions, abuse controls, logging, and secret management.

Known limitations

The following limitations are important:

- Image OCR: The current OCR service generates placeholder text; it does not perform real image recognition.
- Document extraction: TXT files are read as text, but PDF and DOCX extraction is currently simulated.
- Automated testing: A complete automated test suite is not currently declared.
- Dependency reproducibility: No package lockfile was present in the inspected repository tree.
- Dashboard data: Sample records are used for demonstration and must not be mistaken for live threat detections.
- AI reliability: AI assessments can be incorrect, incomplete, or uncertain.

Do not use the application as the sole security control for financial transactions, identity verification, account recovery, or other high-impact decisions.

Deployment

The frontend can be deployed to a static hosting provider supporting Vite.

Setting| Value
Build command| "npm run build"
Output directory| "dist"
Frontend environment variables| "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"

The Supabase Edge Function must be deployed and configured separately. A successful frontend deployment does not prove that backend analysis is operational.

Engineering principles

1. Evidence before verdicts: Assessments should be grounded in identifiable signals.
2. Fail honestly: Failed analysis must never become a fabricated successful result.
3. Least privilege: Authentication and user isolation must be enforced at the backend and database boundaries.
4. Untrusted input by default: Submitted content is evidence, never an instruction source.
5. Human judgement: The system supports security decisions; it does not guarantee outcomes.
6. Continuous verification: Changes should be built, tested, reviewed, and measured before promotion.

Contributing

Uliong-AI is actively evolving.

Before submitting changes:

1. Inspect the affected implementation and its dependencies.
2. Identify security assumptions and data boundaries.
3. Make a focused, reviewable change.
4. Run the available build and relevant checks.
5. Document configuration requirements and known limitations.

Never commit secrets, real user credentials, or private user data.

License

See "LICENSE" (LICENSE).
