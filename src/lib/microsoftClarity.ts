const CLARITY_PROJECT_ID = "whq1fqokkl";

type ClarityFunction = {
  (...args: unknown[]): void;
  q?: unknown[][];
};

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

export const loadMicrosoftClarity = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.clarity) return;

  window.clarity = (...args: unknown[]) => {
    (window.clarity!.q = window.clarity!.q || []).push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode?.insertBefore(script, firstScript);
};
