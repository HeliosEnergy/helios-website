import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { maybeRedirectForDomainMigration } from "@/lib/domainRedirect";

maybeRedirectForDomainMigration(window.location);

createRoot(document.getElementById("root")!).render(<App />);
