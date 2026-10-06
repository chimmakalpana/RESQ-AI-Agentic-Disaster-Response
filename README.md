# RESQ-AI — Agentic AI Emergency Response & Disaster Coordination System

> **24-Hour Disaster Management + Agentic AI Hackathon MVP**  
> An autonomous multi-agent disaster coordination system that transforms raw ground incident reports into actionable emergency response plans, evacuation routing, and bilingual alerts.

---

## 1. Problem Statement

During sudden catastrophic disasters (cyclones, urban flooding, flash landslides, industrial fires), municipal response desks are overwhelmed by chaotic, fragmented calls. Emergency operators face three immediate bottlenecks:
1. **Classification latency:** Delay in identifying disaster severity, secondary risks (e.g. submerged electric grids, contaminated runoff), and confidence scores.
2. **Resource mismatch:** Ambulances, National Disaster Response Force (NDRF) motorized boats, and emergency medical trauma teams are staged inefficiently without clear prioritization of vulnerable groups (children, elderly, injured).
3. **Communication breakdown:** Critical evacuation orders are either delayed or published only in English, leaving vernacular populations uninformed during golden hours.

---

## 2. The RESQ-AI Solution

**RESQ-AI** is a sequential multi-agent AI system governed by a central Orchestrator / Commander Agent. Rather than separate disconnected chatbots, RESQ-AI acts as a cohesive tactical system:

```
Incident Report
      │
      ▼
[ 🚨 Disaster Detection Agent ]
      │ (disaster_type, severity, immediate_risks, confidence)
      ▼
[ 🗺️ Situation Analysis Agent ]
      │ (affected_perimeter, vulnerable_groups, priority_zones)
      ▼
[ 🏥 Resource Coordination Agent ]
      │ (shelters, hospitals, ALS ambulances, NDRF teams, food, water)
      ▼
[ 🚗 Evacuation Agent ]
      │ (recommended_shelter, suggested_route, hazard_areas_to_avoid)
      ▼
[ 📢 Communication Agent ]
      │ (English alert, Telugu alert, public instructions, authority brief)
      ▼
[ 🎯 Commander / Orchestrator ]
      │
      ▼
Emergency Command Dashboard
```

---

## 3. The 6 Multi-Agent Descriptions

| Agent | Responsibility | Core Output |
| :--- | :--- | :--- |
| **🚨 Disaster Detection Agent** | Parses report description and imagery metadata. Classifies hazard category and severity level (`Low`, `Medium`, `High`, `Critical`). | `disaster_type`, `severity`, `confidence`, `immediate_risks`, `key_facts` |
| **🗺️ Situation Analysis Agent** | Analyzes population exposure, prioritizes vulnerable groups (Elderly, Children, Injured, Persons with disabilities), and defines sector zones. | `affected_area`, `estimated_affected_population`, `vulnerable_groups`, `priority_zones`, `immediate_response_priorities` |
| **🏥 Resource Coordination Agent** | Matches available disaster relief assets from the demo catalog (`resources.json`) to emergency requirements based on incident severity. | Resource units tagged with capacity, availability, purpose, and priority |
| **🚗 Evacuation Agent** | Identifies the optimal high-elevation shelter, plots safe transit corridors, and flags flooded underpasses or blocked roads to avoid. | `recommended_shelter`, `evacuation_priority`, `suggested_route`, `areas_to_avoid`, `alternative_route` |
| **📢 Communication Agent** | Generates real-time Common Alerting Protocol (CAP) messages in **English** and **Telugu (తెలుగు)**, plus tactical public safety instructions. | `alert_english`, `alert_telugu`, `public_instructions`, `authority_summary`, `broadcast_channels` |
| **🎯 Commander / Orchestrator** | Coordinates execution DAG, verifies schema contracts between agents, aggregates priority actions, and compiles the final Unified Response Plan. | Full response plan & traceable execution timeline |

---

## 4. Technology Stack

- **Frontend:**
  - React 19 (Functional components, Hooks)
  - Vite 8
  - Tailwind CSS v4
  - Lucide React icons
  - Web Speech API (Native voice synthesis for bilingual audio alerts)
- **Backend Options:**
  - **Node.js Express + TSX Server (`server.ts`)**: Integrated full-stack runner hosting Vite middleware and the multi-agent pipeline on port 3000.
  - **Python FastAPI Backend (`backend/app/main.py`)**: Dedicated Python ASGI service using Pydantic schemas and uvicorn.
- **AI & LLM Orchestration:**
  - Google Gemini API (`@google/genai` with model `gemini-3.8-flash`) via `GEMINI_API_KEY`.
  - **Deterministic Demo Fallback Engine:** 100% resilient offline fallback mode if `GEMINI_API_KEY` is not provided or quota is exceeded.

---

## 5. Project Directory Structure

```text
├── .env.example
├── README.md
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── server.ts                       # Full-stack Node/Express multi-agent server & Vite middleware
├── index.html
│
├── backend/
│   ├── requirements.txt            # Python dependencies (FastAPI, uvicorn, pydantic)
│   └── app/
│       ├── main.py                 # FastAPI application & REST endpoints
│       ├── schemas/
│       │   └── emergency.py        # Pydantic request/response models
│       ├── services/
│       │   └── llm_service.py      # LLM invocation & fallback router
│       ├── agents/
│       │   ├── detection_agent.py
│       │   ├── situation_agent.py
│       │   ├── resource_agent.py
│       │   ├── evacuation_agent.py
│       │   ├── communication_agent.py
│       │   └── orchestrator.py
│       └── data/
│           └── resources.json      # Shared demo resources catalog (Shelters, NDRF, Hospitals, etc.)
│
└── src/
    ├── main.tsx
    ├── App.tsx                     # Main application & screen state manager
    ├── index.css
    ├── types/
    │   └── index.ts                # TypeScript interfaces
    ├── services/
    │   └── api.ts                  # REST API client & preset scenarios
    ├── components/
    │   ├── Header.tsx              # Command bar with live multi-agent status
    │   ├── NavigationTabs.tsx      # Tab router for all 7 screens
    │   ├── SeverityBadge.tsx       # Severity indicator (Low, Med, High, Critical)
    │   └── Footer.tsx              # Emergency hotlines & architecture disclosure
    └── pages/
        ├── LandingPage.tsx         # Screen 1: Hero, pipeline overview, quick demo
        ├── EmergencyReportPage.tsx # Screen 2: Incident intake form with preset chips
        ├── AgentActivityPage.tsx   # Screen 3: Sequential agent trace & raw JSON inspector
        ├── CommandDashboardPage.tsx# Screen 4: Executive command dashboard & plan export
        ├── ResourcesPage.tsx       # Screen 5: Filterable catalog of matched demo assets
        ├── EvacuationPage.tsx      # Screen 6: Simulated GIS vector map & route bypass
        └── CommunicationPage.tsx   # Screen 7: Bilingual alerts (EN/TE), TTS voice alert & sharing
```

---

## 6. How to Run the Project

### Option A: Running Full-Stack Dev Server (Default for AI Studio)

The Express server in `server.ts` handles the API endpoints (`/api/emergency/analyze`, `/api/resources`, `/api/health`) and mounts Vite on port 3000:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (Optional: if not set, fallback demo mode runs automatically)
cp .env.example .env
# Edit .env and supply GEMINI_API_KEY (optional)

# 3. Start full-stack server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Option B: Running the Python FastAPI Backend Separately

If you want to run the dedicated Python FastAPI service:

```bash
# 1. Navigate to backend directory and install requirements
cd backend
pip install -r requirements.txt

# 2. Run the FastAPI server via uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI Swagger Documentation will be available at: `http://localhost:8000/docs`

---

## 7. Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | API key for Gemini 3.8 Flash model. If omitted, deterministic demo fallback mode executes automatically. |
| `AI_API_KEY` | Optional | Alias for `GEMINI_API_KEY`. |
| `PORT` | Optional | Server port (Default: `3000`). |

---

## 8. API Endpoints

### `POST /api/emergency/analyze`
Submits an emergency report and runs the sequential multi-agent pipeline.

**Request Body:**
```json
{
  "disaster_type": "Flood",
  "location": "Gajuwaka, Visakhapatnam",
  "description": "Heavy flooding has affected a residential area. Several people are stranded and elderly people and children may need immediate assistance.",
  "affected_people": 200,
  "vulnerable_groups": ["Children", "Elderly", "Injured"]
}
```

**Response:**
Returns complete `EmergencyPlanResponse` including `detection`, `situation`, `resources`, `evacuation`, `communication`, `priority_actions`, and `agent_trace`.

### `GET /api/resources`
Returns the simulated catalog of emergency shelters, hospitals, ambulances, rescue units, food, and water hubs.

### `GET /api/health`
Health check endpoint reporting orchestrator mode and registered agent names.

---

## 9. Hackathon Demo Scenario

To reproduce the primary test scenario:
1. Open the **Report Emergency** screen or click **"Run Demo Scenario"** on the header.
2. Select **Disaster Type:** `Flood`
3. Enter **Location:** `Gajuwaka, Visakhapatnam`
4. Enter **Description:** *"Heavy flooding has affected a residential area. Several people are stranded and elderly people and children may need immediate assistance."*
5. Set **Affected People:** `200`
6. Select **Vulnerable Groups:** `Children`, `Elderly`, `Injured`
7. Click **ANALYZE EMERGENCY**.
8. Observe **Screen 3 (Agent Activity)** executing the 6 agents with live status badges.
9. Review **Screen 4 (Command Dashboard)**: Severity evaluated as `High` / `Critical`.
10. Check **Screen 6 (Evacuation)** for the simulated bypass route avoiding the submerged railway underpass.
11. Check **Screen 7 (Communication)**: Listen to the voice alert in English and review the verified Telugu text (*"అత్యవసర హెచ్చరిక..."*).

---

## 10. Limitations

- **Simulated Resource & Routing Data:** All shelters, ambulances, and route coordinates are demo assets labeled with `"is_demo": true` and are not connected to live GPS trackers.
- **Offline Fallback:** When no LLM key is configured, deterministic logic matches rules based on NLP keywords, ensuring zero downtime for live judging.

---

## 11. Future Scope

1. **IoT Sensor & Drone Feed Ingestion:** Integrating real-time water-level telemetry from dam reservoirs and thermal drone cameras.
2. **Citizen WhatsApp/Telegram Bot:** Ingestion of citizen distress photos via Twilio or WhatsApp Cloud API directly into the Intake queue.
3. **Decentralized Offline Mesh Sync:** P2P BLE mesh protocol to relay evacuation coordinates between citizen handsets when cell towers collapse.
