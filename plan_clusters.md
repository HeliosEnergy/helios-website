# Plan: Refinement of Clusters Tab (Mission Control Dashboard)

**Date:** January 30, 2026
**Objective:** Redesign the **Clusters** tab in `UseCasesSection.tsx` to reflect a deep technical "Mission Control" aesthetic, replacing the generic maps with a dense, data-rich visualization of GPU topology, health, and scheduling status.

## 1. Design Philosophy: "The Engine Room"
*   **Vibe:** Highly technical, dense, and alive. This isn't a marketing brochure; it's a window into the machine.
*   **Visual Language:** Monospaced fonts, grid lines, status indicators (green/amber/red), and scrolling data streams.
*   **Key Data Points:** NVLink topology, Node Health (ECC/Thermals), and Job Queue depth.

## 2. Implementation: The "Clusters" Tab

### A. The Composition
*   **Container:** Same split layout as Inference (Left: Copy, Right: Visual).
*   **Left Side (Copy):**
    *   **Headline:** "Sovereign Compute." (or similar high-impact text).
    *   **Body:** Highlight support for **Slurm & Kubernetes**, bare-metal access, and massive interconnect scale (NVSwitch/InfiniBand).
    *   **CTA:** "Provision Cluster" (White pill button).

### B. The Visual: "Cluster Topology Dashboard"
We will build a CSS-only dashboard layout.

**1. Top Bar: Global Metrics**
*   **Grid:** 3 or 4 columns.
*   **Metrics:**
    *   `CLUSTER_LOAD`: 92% (Green)
    *   `AVAIL_H100`: 1,024
    *   `POWER_DRAW`: 4.2 MW
    *   `PUE`: 1.08

**2. Main Visualization: "The Node View" (Center)**
*   **Visual:** A schematic representation of a single HGX H100 Node (or a rack).
*   **Topology:** 8 distinct GPU blocks connected by lines representing NVLink.
*   **Status:** Each GPU block has:
    *   ID (GPU-0 to GPU-7)
    *   Temp (e.g., 68°C)
    *   Util (e.g., 99%)
    *   Memory Bar (HBM3 Usage)

**3. Bottom Panel: The "Event Stream"**
*   **Look:** A terminal-like log window.
*   **Content:** A mix of Slurm and K8s events scrolling (or static list).
    *   `[SLURM] Job #49221 allocated (128x H100) - Training_LLAMA3_405B`
    *   `[K8S] Pod 'inference-worker-xyz' scheduled on node-04`
    *   `[SYS] NVLink training topology verified. Bandwidth: 900GB/s`

### C. Technical Execution
*   **File:** `src/components/UseCasesSection.tsx`
*   **Components:**
    *   Use `lucide-react` icons for status (Activity, Server, Zap).
    *   Use `grid` layouts for the Node View.
    *   Use `monospace` fonts (`font-mono`) extensively for data.
    *   Use subtle animations (pulsing green dots, moving progress bars) to make it feel "live."

## 3. Implementation Steps
1.  **Modify `ClustersContent`:** Replace the map grid with this new Dashboard layout.
2.  **Styling:** Ensure colors are strict (Black bg, White text, muted Greens/Blues for status). Avoid "rainbow" colors.
3.  **Animation:** Add subtle entrance animations for the grid elements.
