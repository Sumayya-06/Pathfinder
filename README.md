# Pathfinder: Your AI Career Roadmap Chatbot

## Project Overview

Pathfinder is an interactive chatbot designed to assist college students in navigating their career journeys. It aims to provide quick and concise guidance on career paths, necessary skills, and interview preparation. The project leverages Google technologies for its development and deployment.

## Problem Solved

Many college students face uncertainty regarding their career trajectories. They often struggle with identifying suitable career paths, understanding the specific skills required for desired roles, and effectively preparing for job interviews. Pathfinder aims to simplify this process by offering an accessible and interactive tool for immediate career guidance.

## Key Features

* **Intuitive Chat Interface:** A user-friendly and responsive design that allows for seamless interaction.
* **Real-time Messaging:** Displays both user queries and bot responses dynamically.
* **Easy Interaction:** Supports message submission via a dedicated send button and the Enter key.
* **Intended AI-Powered Guidance:** (As envisioned) Capable of providing:
    * **Career Path Suggestions:** Tailored recommendations based on academic background or interests.
    * **Skill Requirements:** Lists of essential skills for specific job roles.
    * **Interview Tips:** Actionable advice and common questions for various interview scenarios.

## Google Technologies Used

* **Firebase Hosting:** Utilized for fast, secure, and reliable deployment and serving of the chatbot's static frontend (HTML, CSS, JavaScript).
* **Firebase Studio (IDX):** The integrated development environment provided by Google for building, testing, and deploying the application directly within the browser.
* **Google Gemini API (Generative Language API):** The core Google AI technology intended to power the chatbot's intelligent responses.
* **Git / GitHub:** Employed for version control, tracking changes, and managing the project's codebase.

## Technical Challenges & Learnings

Developing Pathfinder presented valuable learning opportunities, particularly concerning cloud service dependencies and secure API integration:

1.  **Firebase Cloud Functions Billing Requirement (Blaze Plan):**
    * **Challenge:** The most significant hurdle encountered was the inability to deploy Firebase Cloud Functions. Deploying functions requires the Firebase project to be on the "Blaze" (pay-as-you-go) plan, which necessitates linking a credit card. As I do not possess a credit card, this step became an insurmountable block for implementing the secure, recommended backend for AI integration.
    * **Learning:** This highlighted the fundamental requirements for utilizing serverless backend services in Google Cloud. It deepened my understanding of why cloud providers require billing information even for services with generous free tiers (to prevent abuse and ensure resource management).

2.  **API Enabling and Permissions:**
    * **Challenge:** Even after attempting to upgrade to Blaze, a "Permission denied to enable service [artifactregistry.googleapis.com]" error occurred during function deployment. This indicated a deeper issue with the project's service account permissions in Google Cloud Platform, blocking the necessary API enablement for Cloud Functions.
    * **Learning:** This experience underscored the importance of granular IAM (Identity and Access Management) roles and permissions in Google Cloud. It showed that even with broader permissions, specific API enablement rights might be required for certain service accounts.

3.  **Direct Client-Side Gemini API Integration (Alternative Attempt):**
    * **Challenge:** As a workaround for the Cloud Functions issue, I attempted to integrate the Google Gemini API directly into the frontend `script.js`. While this allowed the API key to be present in the client (a practice generally discouraged due to security risks), the API calls consistently resulted in "404 Not Found" errors or implied CORS (Cross-Origin Resource Sharing) restrictions. This suggested that the `gemini-pro` model or Generative Language API is not intended for direct browser consumption or is actively blocked by Google's security policies in a client-side context.
    * **Learning:** This reinforced the critical need for a secure backend (like Firebase Cloud Functions) when interacting with sensitive APIs. It illustrated why exposing API keys in client-side code is a significant security vulnerability and why backend proxies are essential for secure and functional API integrations, circumventing browser-imposed security policies like CORS.

## Current State

The Pathfinder chatbot UI is fully deployed and accessible via Firebase Hosting. While the AI integration with the Google Gemini API could not be successfully implemented due to the aforementioned platform and billing-related challenges, the foundational structure for the chatbot and the learning journey through these obstacles have been significant. The current `script.js` attempts a direct API call, which is expected to fail with `404` errors in the browser console, demonstrating the attempt.

## Deployment

The project is deployed on Firebase Hosting.

**Live URL:** `https://pathfinder-1d5df.web.app`

## Getting Started (Local Development - Optional)

To run this project locally (for the static UI):

1.  Clone this repository:
    `git clone https://github.com/Sumayya-06/Pathfinder.git`
2.  Navigate to the project directory:
    `cd Pathfinder`
3.  Ensure you have Firebase CLI installed:
    `npm install -g firebase-tools`
4.  Serve the project locally:
    `firebase serve --only hosting`
    (This will typically open on `http://localhost:5000`)

---