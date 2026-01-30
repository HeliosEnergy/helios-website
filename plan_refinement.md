# Plan: Refinement of Use Cases (Inference, Clusters, Training)

**Date:** January 30, 2026
**Objective:** Update the `UseCasesSection` to match the stricter, less aggressively rounded Helios aesthetic and refine the "Playground" UI to look more professional (like AI Studio) rather than "bubbly."

## 1. Structural Changes

*   **Tabs:** Reduce from 5 to 3:
    1.  **Inference** (Default)
    2.  **Clusters** (was "GPU Clusters")
    3.  **Training** (was "Pre-Training")
*   **Active State:** The active tab pill background changes from **Blue** to **White** (text becomes Black).
*   **Border Radius:** Reduce the main section container's border-radius from `48px` to `24px` (or `32px`) to match the rest of the site's "Kind but Structured" feel.

## 2. UI Refinement: "The Playground" (Inference Tab)

*   **Vibe:** Professional, dense, technical. Less "toy-like."
*   **Shape:** Reduce border-radius on the Playground container from `32px` to `12px` or `16px`.
*   **Header:**
    *   Clean, thin dividers.
    *   "Run" button instead of just decorative toggles.
    *   Parameters (Temp, Top P) moved to a cleaner right-hand sidebar with distinct numerical inputs, not just abstract sliders.
*   **Chat Area:**
    *   Monospace font for the "Thinking" logs (`font-mono`).
    *   Distinct "User" vs "Model" bubbles with sharper corners (e.g., `rounded-lg` instead of `rounded-2xl`).
    *   Syntax highlighting colors (subtle blues/greens) for any code or structured output.

## 3. Implementation Steps

1.  **Modify `tabs` array:** Filter down to the 3 core pillars.
2.  **Update `UseCasesSection` wrapper:** Fix border-radius and tab styling (White active state).
3.  **Rewrite `InferenceContent`:**
    *   Rebuild the "Playground" mockup CSS.
    *   Make it look like a real IDE/Studio (dark gray surface, distinct panels, crisp typography).
    *   Ensure the "off-center/cut-off" composition remains but feels more intentional.
4.  **Verify:** Check that **Clusters** and **Training** tabs still render correctly (I will likely need to tweak their content headers to match the new 3-tab structure if necessary, but the content itself is mostly fine, just the tab labels changed).

## 4. Visual References (Mental)
*   **Google AI Studio:** Dark theme, density, distinct "Prompt" vs "Output" areas.
*   **Helios Codex:** "Black is not empty." "Typography is ornament."
