# Plan: The "Award-Winning" Inference Section
**Date:** January 30, 2026
**Objective:** Redesign the "Inference" tab of the Use Cases section to achieve a high-fidelity, "Apple-meets-Airbnb" aesthetic. The goal is to move away from standard layouts into a dynamic, off-center composition that suggests scale and intelligence.

## 1. Design Philosophy (The "Jony & Airbnb" Synthesis)

*   **The "Bleed" (Jony):** We will not contain the entire UI within the card. By cropping the interface (cutting it off at the edges), we imply that the tool continues beyond the viewport. It creates a sense of "infinite canvas" rather than a "boxed form."
*   **The "Touch" (Airbnb):** The controls (toggles, sliders) must look tactile. The "Thinking" toggle shouldn't just be a checkbox; it should be a deliberate switch that changes the state of the conversation.
*   **The "Void" (Helios):** The background remains deep black/gray. The UI pops against it using subtle borders (`1px white/10`) and shadows, not heavy colors.

## 2. Implementation: The "Inference" Tab

### A. The Composition
*   **Container:** A large, rounded bounding box (Border-radius: 32px or 48px).
*   **Layout:**
    *   **Text/CTA:** Pushed to one side (likely Right or Left, depending on the "off-center" visual).
    *   **Visual:** An "off-center" render of the Helios Playground interface. It will be positioned such that parts of it (e.g., the bottom or far right) are "cut off" by the bounding box overflow.

### B. The Visual: "The Kimi Playground"
We will build a CSS-only mockup of a high-end LLM playground.

**1. The Header / Control Bar**
*   **Model Selector:** Displaying "Kimi k2.5 Thinking".
*   **Thinking Mode:** A prominent Toggle Switch (ON state: Helios Ember/Orange).
*   **Thinking Budget:** A dropdown selector next to the toggle.

**2. The Sidebar / Parameter Panel (Floating or Integrated)**
*   **Sliders:** Minimalist track lines for:
    *   `Top P`
    *   `Top K`
*   **Styling:** Thin strokes, white/40 text, white/100 handles.

**3. The Chat Canvas**
*   **User Message:** "Explain the implications of quantum supremacy on encryption." (Right aligned, or standard chat bubble).
*   **Model Response:**
    *   *State:* "Thinking..." (Visualized possibly with a collapsing accordion or a pulsing indicator, showing the "Thinking" process before the answer).
    *   *Text:* "Quantum supremacy implies..." (Fade in).

### C. Technical Execution
*   **File:** `src/components/UseCasesSection.tsx`
*   **Method:**
    *   Use `overflow-hidden` on the main container.
    *   Use `absolute` positioning for the UI Mockup.
    *   Use `transform: translate(...)` to achieve the off-center, cropped look.
    *   Use `backdrop-blur` layers to make the UI feel like it sits on glass above the void.

## 3. Next Steps (Future)
*   Once Inference is perfect, we will apply similar "off-center/cropped" logic to **GPU Clusters** (Maps) and **Pre-Training** (Stack Diagrams).
