import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const basename = import.meta.env.VITE_BASE_URL || "/"; // ✅ 추가된 부분

async function deferRender() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser.js");
    await worker.start();
  }
}

deferRender().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  );
});
