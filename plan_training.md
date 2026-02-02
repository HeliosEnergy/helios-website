# Plan: Refinement of Training Tab (The Data Factory)

**Date:** January 30, 2026
**Objective:** Redesign the **Training** tab in `UseCasesSection.tsx` to visualize the industrial scale of LLM pre-training ("The Data Factory") while removing specific jargon like "TKC" or "Together." The focus is on the *process*: Raw Data -> Optimization -> Model.

## 1. Design Philosophy: "The Assembly Line"
*   **Vibe:** Industrial, fluid, continuous.
*   **Visual Language:** Flowing lines, pulsing nodes, and a clear "Left-to-Right" progression of value.
*   **Key Concept:** Showing the transformation of unstructured noise (tokens) into structured intelligence (weights).

## 2. Implementation: The "Training" Tab

### A. The Composition
*   **Container:** Standard split layout (Left: Copy, Right: Visual).
*   **Left Side (Copy):**
    *   **Headline:** "From Scratch." (Bold, confident).
    *   **Body:** "Train on your own data. Secure, scalable, and cost-effective. We handle the infrastructure; you own the weights."
    *   **CTA:** "Start Training" (White pill button).

### B. The Visual: "The Training Stack"
A 3-layer vertical or horizontal visualization.

**1. Top Layer: "The Pulse" (Loss Curve)**
*   A live, scrolling line chart.
*   **Visual:** A jagged white line on a grid that is visibly trending downwards (converging).
*   **Metrics:** `Loss: 0.142`, `Epoch: 42`.

**2. Middle Layer: "The Engine" (Throughput)**
*   **Visual:** A progress bar or "flow" meter.
*   **Metric:** `142,000 tokens/sec`.
*   **Animation:** A gradient bar that is constantly moving right.

**3. Bottom Layer: "The Stack" (Simplified)**
*   **Input:** "Raw Data" (Icon/Block).
*   **Process:** "Optimization" (A glowing central block - replacing "TKC").
*   **Hardware:** "H100 Cluster" (Base layer).
*   **Output:** "Model Weights" (Final product).

### C. Technical Execution
*   **File:** `src/components/UseCasesSection.tsx`
*   **Animation:**
    *   Use `framer-motion` for the "scrolling" graph (translating an SVG path).
    *   Use simple CSS pulsing for the "Optimization" block.

## 3. Implementation Steps
1.  **Modify `TrainingContent`:** Replace the old "TKC" vertical stack with this new "Factory" layout.
2.  **Remove Jargon:** Scrub "Together," "TKC," "Kernel Collection" from the copy.
3.  **Refine Visuals:** Ensure it looks like a high-end dashboard, not a PowerPoint diagram.
