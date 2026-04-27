import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { maybeRedirectForDomainMigration } from "@/lib/domainRedirect";
import { loadMicrosoftClarity } from "@/lib/microsoftClarity";

maybeRedirectForDomainMigration(window.location);

if (__VERCEL_ENV__ === "production") {
  loadMicrosoftClarity();
}

createRoot(document.getElementById("root")!).render(<App />);
