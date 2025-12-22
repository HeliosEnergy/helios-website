# Helios Landing Page

![Helios Logo](public/logo-white.svg)

[![Build Status](https://github.com/HeliosEnergySystems/helios-landing-page/workflows/CI/badge.svg)](https://github.com/HeliosEnergySystems/helios-landing-page/actions)
[![Vercel Deployment](https://vercel.com/helios-energy-systems/helios-landing-page/deployments/badge.svg)](https://vercel.com/helios-energy-systems/helios-landing-page)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

The Helios Landing Page is a high-performance Next.js application designed to showcase Helios Energy Systems. It features advanced WebGL animations, interactive components, and a robust CI/CD pipeline for seamless deployment. Our focus is on delivering an optimal user experience with cutting-edge web technologies.

---

## Key Features

*   **Immersive 3D Particle Background:** A performant and responsive WebGL particle system built with Three.js, featuring custom shaders and dynamic optimization for various devices.
*   **Interactive Stack Section:** Engage with precisely positioned markers on an image, offering adaptive popup positioning and a mobile-friendly interface.
*   **Enhanced Feature Cards:** Experience dynamic hover interactions with sliding accordions and procedurally generated geometric animations.
*   **Advanced GPU Pricing Calculator:** A responsive, multi-platform tool providing real-time pricing calculations with complex logic and volume discounts.
*   **Automated CI/CD Pipeline:** Seamless deployment to Vercel via GitHub Actions, including automated preview environments for pull requests and quality gates.

---

## Technology Stack

*   **Framework:** Next.js 15.5.0 (App Router, Turbopack)
*   **UI Libraries:** React 19.1.0, Tailwind CSS 4.0, Framer Motion, Lucide React
*   **3D Graphics:** Three.js 0.179.1 with custom shaders
*   **Build Tools:** Turbopack (development & production)
*   **Deployment:** Vercel with GitHub Actions CI/CD
*   **Code Quality:** ESLint with Next.js configuration

---

## Getting Started

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL_HERE]
    cd helios-landing-page
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

---

## Deployment

The project utilizes a robust CI/CD pipeline with GitHub Actions and Vercel for automated deployments:

*   **Production Deployments:** Pushes to the `main` branch automatically trigger a production build and deployment to Vercel.
*   **Preview Deployments:** Every pull request automatically generates a preview deployment, allowing for easy review of changes before merging.

---

## Performance Optimizations

We prioritize performance to ensure a smooth user experience across all devices:

*   **Mobile-First Approach:** Dynamic particle count reduction, pixel ratio limiting, and adaptive frame rate control for mobile devices.
*   **Build Optimizations:** Leveraging Turbopack for faster builds, Next.js Image component for optimized images, and automatic bundle splitting.
*   **Runtime Optimizations:** Debounced resize events, comprehensive Three.js resource cleanup, and intelligent `requestAnimationFrame` usage for smooth animations.

---

## Browser Compatibility

The landing page is designed with progressive enhancement in mind:

*   **WebGL Support:** Features graceful fallbacks to CSS gradients if WebGL is not supported or encounters issues.

*   **CSS Fallbacks:** Utilizes Flexbox fallbacks for older browsers where CSS Grid might not be fully supported.

*   **Accessibility:** Respects reduced motion settings for users who prefer less animation.

---

## Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Note:** Remember to replace the placeholder URLs for the badges (`[YOUR_REPOSITORY_URL_HERE]`, `https://github.com/HeliosEnergySystems/helios-landing-page/workflows/CI/badge.svg`, `https://vercel.com/helios-energy-systems/helios-landing-page/deployments/badge.svg`, and `https://github.com/HeliosEnergySystems/helios-landing-page/actions`, `https://vercel.com/helios-energy-systems/helios-landing-page`) with your actual repository and Vercel project links.
