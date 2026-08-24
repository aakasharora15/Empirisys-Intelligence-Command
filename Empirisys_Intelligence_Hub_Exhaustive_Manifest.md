# Empirisys Intelligence Hub: Exhaustive System Manifest

This document serves as the absolute, ground-truth reference for the Empirisys Intelligence Hub. It is designed to be ingested by developers, stakeholders, or AI systems (like Claude Code) to achieve a 100% complete understanding of the platform's architecture, UX/UI design system, specific page functionalities, AI logic, and data state as built by Antigravity.

---

## 1. Project Genesis, SOW & Client Meeting Insights
**The Original SOW:** As defined in the MBA Accelerator Project with Gus (CEO), Joe, Dawn, and Peter, the objective was to design a scalable Agentic AI platform that monitors the competitive landscape and generates strategic insights on demand to accelerate sales of Empirisys BOOST.

**The Real Problem (From Client Meetings):**
Through discussions with the Empirisys team, we identified the core challenge: Empirisys is selling into high-hazard environments where the target buyers (**Senior HSE & Operational Leaders**) face massive personal, and sometimes criminal, liability for site safety. 
When Empirisys pitches BOOST, they are fighting legacy "Systems of Record" (like eOBS, Enablon, DNV). These incumbents capture data but fail to prioritize actionable insights. Empirisys needed a weapon to instantly prove that BOOST is a "System of Intelligence" that prevents fatalities, rather than just logging them.

**Specific "Buy Triggers" Monitored:**
The platform's underlying logic is built to help sales teams spot opportunities when a prospect experiences:
1. **Critical Incidents:** A recent fatality or major HSE failure.
2. **Leadership Shakeups:** A newly appointed HSE Director auditing old systems.
3. **Regulatory Pressure:** Investor demands for evidence-based risk decisions.

**The Pivot (Trimming to the Lean Core):** 
Based on explicit feedback during development, we realized a competitor-analysis tool gets *worse* when bolted onto generic CRM/lead-gen modules. We executed a ruthless strategic trim. The platform now operates on a single architectural rule: *"Does this screen help Empirisys understand or beat a competitor?"* Anything that failed this test (like Target Account Radars or UK Tender pipelines) was permanently deleted to preserve a sharp, defensible identity for Gus and the executive team.

---

## 2. Technical Stack & Infrastructure
*   **Core Framework:** Next.js 14 utilizing the App Router (`/app` directory).
*   **Language:** Strict TypeScript.
*   **Styling:** Tailwind CSS with a highly customized `tailwind.config.ts`.
*   **Animations:** Framer Motion (`framer-motion`) handles all page transitions, micro-interactions, and the "illusion of scale" pulsing effects.
*   **Iconography:** Lucide React (`lucide-react`) for consistent, clean vector icons.
*   **AI Integration:** Next.js Route Handlers (`/app/api/...`) connecting to LLM APIs (Anthropic Claude / Groq) to power the natural language querying.

---

## 3. UI/UX Design System: The "Premium Dark" Aesthetic
The UI was meticulously crafted to avoid looking like a generic SaaS dashboard. It mimics a high-end, military-grade intelligence terminal.

*   **Color Palette:**
    *   Background: Deep rich black/green (`#0C110F`).
    *   Panels: Slightly lighter translucent panels (`#131A17` or `bg-panel/40`).
    *   Accent: The signature Empirisys Green (`#7AE03B`) used for glowing borders, active states, and primary buttons.
    *   Text: High-contrast white (`#FFFFFF`) for primary text, muted gray (`#828D89`) for secondary text to reduce eye strain.
*   **Glassmorphism:** Heavy use of `backdrop-blur-md` and `border border-white/5` to create floating, frosted-glass panels over a subtle radial gradient background.
*   **Typography:** Playfair Display for authoritative, elegant headings; Inter for highly legible, dense data tables and body text.
*   **Micro-Animations:** Every button and card uses Framer Motion's `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` to make the interface feel highly tactile and responsive.

---

## 4. Global Layout & Navigation (`/components/layout`)
The application is wrapped in `AppLayout.tsx`, which manages the global state and background effects.
*   **The Background:** A fixed, full-screen background with a subtle, glowing radial gradient positioned in the top-right corner to give depth to the dark mode.
*   **The Sidebar (`Sidebar.tsx`):** A fixed left-hand navigation menu. It uses an array of sectioned links. Active states are highlighted with the Empirisys Green text and a subtle left-border highlight.

**The Sidebar Sections:**
1.  **Command Center:** (Executive Dashboard, Strategic Frameworks)
2.  **Competitor Intelligence:** (Competitor Directory, Sales Battlecards, Pricing & Packaging, Tech Stack Vulnerabilities)
3.  **AI & Knowledge:** (Knowledge Assistant, Training Data)
4.  **Reporting & Exports:** (Board-Level Export, Settings)

---

## 5. Exhaustive Page-by-Page Feature Breakdown

### 5.1 Executive Dashboard (`/app/page.tsx`)
*   **Layout:** A CSS Grid "Bento Box" design.
*   **Components:** 
    *   Top metric cards showing total tracked competitors, recent threat alerts, and system health.
    *   A primary "Empirisys Threat Score" visualization.
    *   A radar chart layout comparing Empirisys's AI capabilities against the industry average.

### 5.2 Strategic Frameworks (`/app/frameworks/page.tsx`)
*   **Purpose:** Visualizing MBA-level academic models to prove strategic dominance.
*   **Components:**
    *   **Porter's Five Forces:** A breakdown of competitive rivalry, supplier power, buyer power, threat of substitution, and threat of new entry, contextualized for the HSE software market.
    *   **VRIO Matrix:** (Value, Rarity, Imitability, Organization) analysis proving that Empirisys's Contextual NLP is a sustained competitive advantage, whereas competitor features are mere competitive parity.

### 5.3 Competitor Directory & AI Query Console (`/app/competitors/page.tsx`)
*   **Layout:** A massive two-column layout. The left column holds the AI Query Console; the right column holds the Competitor Grid.
*   **The AI Query Console:** A chat interface where users can type specific questions (e.g., "How do I beat Sphera on price?"). It hits `/api/competitor/route.ts`. The prompt engineering strictly forces the AI to output tactical advice favoring Empirisys over "Systems of Record."
*   **The Competitor Grid:** Cards profiling Sphera, Intelex, DNV, Enablon, Generic AI, and Fenix. Hovering over a card reveals their specific threat level and market overlap.
*   **Emerging Threats Panel:** A scrolling list of new startups entering the space, giving the illusion of constant market scanning.

### 5.4 Sales Battlecards (`/app/competitors/battlecards/page.tsx`)
*   **Purpose:** Tactical kill-sheets for sales reps right before a pitch.
*   **Data Structure:** Powered by hardcoded arrays containing `weaknesses`, `competitorClaims` (what they say about Empirisys), and `ourCounter` (exactly what the sales rep should say back).
*   **UI:** Users select a competitor from a dropdown. The page dynamically populates with a clean, bulleted list of attack vectors.

### 5.5 Pricing & Packaging (`/app/competitors/pricing/page.tsx`)
*   **Purpose:** Proving Total Cost of Ownership (TCO) superiority.
*   **UI:** A dense data table comparing Base Platform Cost, Per-User Licensing, Implementation Fees, and Data Migration costs. Empirisys's row is highlighted with a glowing green border. A summary box at the bottom calculates the exact percentage saved by choosing Empirisys over a 3-year term.

### 5.6 Tech Stack Vulnerabilities (`/app/product/tech-stack/page.tsx`)
*   **Purpose:** Arming the product and sales engineering teams.
*   **UI:** Side-by-side architectural comparisons. It visually breaks down why incumbent "Monolithic SQL" architectures suffer from rigid templates and slow reporting, contrasting it with Empirisys's "Vector Database & LLM" architecture, which allows for contextual understanding and predictive analytics.


### 5.7 AI Infrastructure UI (Supporting Modules)
These pages exist to visually prove to stakeholders that massive AI processing is happening in the background:
*   **Knowledge Assistant (`/app/assistant/page.tsx`):** A full-page conversational UI for chatting with the Empirisys knowledge base.
*   **Training Data (`/app/training-data/page.tsx`):** An upload interface where users drag-and-drop competitor manuals to train the Vector DB.

---

## 6. The AI Engine: Logic & Prompt Engineering
The platform does not just use raw LLM output; it uses highly opinionated, governed prompt engineering.
*   **Endpoint (`/api/competitor/route.ts`):** 
    *   **The System Prompt:** The AI is instructed: *"You are the Empirisys Competitor Intelligence AI. CRITICAL STRATEGY: Treat Synergi Life, eOBS, and Enablon as 'Incumbent Systems of Record' that capture data but fail to provide decision support. If asked about internal DIY AI, argue that generic AI lacks safety-critical repeatability."*
    *   This ensures the AI never accidentally praises a competitor or hallucinates a generic response. It is a trained Empirisys loyalist.

---

## 7. Data State & The Bridge to Reality
Currently, the application is in an **"MVP Presentation State."**

**The Mock Data:** To guarantee a flawless presentation without relying on slow or unpredictable web scrapers, the deep tactical data (inside Battlecards, Strategic Frameworks, Pricing, and Tech Stack pages) consists of beautifully structured, hardcoded arrays in the TypeScript files. It was written by expert consultants to be 95% realistic to the HSE software market.

**The Bridge to Reality (The Google Form):**
To transition this codebase into a live, production-ready tool, Antigravity has designed a targeted Google Form currently circulating with the Empirisys sales leadership. 
*   **The Developer Handoff Step:** When the sales team submits their true, field-tested answers (e.g., the *actual* prices they see in RFPs, the *actual* reasons they lose to Sphera), a developer will simply replace the hardcoded mock arrays in the codebase with this verified data. 
*   This transforms the platform from a visually stunning prototype into the most accurate, battle-tested intelligence weapon in the company.

---
**End of Manifest.**
