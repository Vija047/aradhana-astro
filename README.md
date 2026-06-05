# Aradhana - Celestial Spiritual Companion

Aradhana is a state-of-the-art AI-powered astrology and spiritual companion app. Using advanced LangGraph agent workflows, OpenAI models, vector embeddings, and real-time calculations, Aradhana calculates astronomical/astrological parameters, maps transit charts, and provides highly personalized cosmic guidance to users.

**Live Demo**: [https://aradhana-astro.vercel.app/](https://aradhana-astro.vercel.app/)

---

## Repository Architecture

The project is structured as a monorepo consisting of:

*   **`frontend/`**: A React + Vite single-page application crafted with a premium glassmorphic UI, animations, onboarding, real-time geolocation suggestions, birth chart calculations, and interactive chat.
*   **`backend/`**: An Express server orchestrating a LangGraph astrology agent workflow. It implements stateful reasoning, routing, geocoding, transit computations, and vector search.

---

## Features

### Frontend UI (React + Vite)
*   **Onboarding Flow**: Smooth, step-by-step interactive forms capturing birth date, time, and birthplace coordinates.
*   **Celestial Chat**: A gorgeous message UI utilizing glassmorphic aesthetics, typing micro-animations, and styled astro insights.
*   **Interactive Birth Chart**: Visual overlays mapping zodiac houses, planetary coordinates, and transits.
*   **Astro Visuals**: Beautiful custom UI elements that feel premium and modern.

### Backend Agent (Node.js + LangGraph)
*   **Stateful Agent Workflow**: Uses `@langchain/langgraph` to guide user queries from reasoning to tool execution or router nodes.
*   **Astro Tools**:
    *   `birthChart`: Calculates planetary positions based on birth coordinates and UTC offsets.
    *   `transits`: Computes current planetary transits compared against natal charts.
    *   `geocode`: Translates human-readable cities into precise latitudes/longitudes.
    *   `knowledgeLookup`: Leverages Pinecone vector database (RAG) to reference deep astrological texts.
*   **Persistence**: Uses MongoDB to save conversation state and histories across sessions.
*   **Evaluation Suite**: An automated evaluation framework in `backend/eval/` to test agent accuracy and response quality against a golden dataset.

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas instance)
*   [Pinecone Database Account](https://www.pinecone.io/) (For embedding storage)

---

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment variables. Create a `.env` file inside the `backend` folder and add the following:
    ```env
    # Express Server Port
    PORT=5000

    # OpenAI API Key (required for LLM & Embeddings)
    OPENAI_API_KEY=your-openai-api-key

    # MongoDB Connection URI (conversation persistence)
    MONGO_URI=mongodb://localhost:27017/astroagent

    # Pinecone Vector Database Config (for RAG knowledge lookup)
    PINECONE_API_KEY=your-pinecone-api-key
    PINECONE_INDEX_NAME=astro-db
    ```
4.  Run the server:
    *   **Development mode** (with live reload):
        ```bash
        npm run dev
        ```
    *   **Production mode**:
        ```bash
        npm start
        ```
    *   **Evaluation Suite**:
        ```bash
        npm run eval
        ```

---

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the frontend developer server locally:
    ```bash
    npm run dev
    ```
4.  Open the local address printed by Vite (typically `http://localhost:5173`) in your web browser.

---

## Tech Stack

### Frontend
*   **Framework**: React (v19)
*   **Build Tool**: Vite
*   **Style System**: Vanilla CSS with modern HSL palettes, variables, and responsive layout structures.

### Backend
*   **Framework**: Express.js
*   **AI SDKs**: LangChain Core, LangGraph, OpenAI Node API
*   **Databases**: MongoDB (document store), Pinecone (vector store)
*   **Utilities**: Nodemon, Zod (runtime schemas)

---

## Evaluation & Testing

The backend includes a dedicated evaluation framework for verifying the LLM agent:
*   **Run command**: `npm run eval` in `backend/`
*   **Script path**: [evalRunner.js](file:///d:/Internships%20Assignment/aradhana/backend/eval/evalRunner.js)
*   **Output**: Test scorecards are generated inside the `backend/eval/` directory as `results.csv` and `scorecard.md`.
