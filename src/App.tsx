import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./ui/pages/dashboard";
import WEBSITE_CONTENT from "./ui/pages/home";
import Login from "./ui/pages/login";
import ScrollToTop from "./utils/scrollToTop";
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    setStatus(navigator.onLine);
    if (!navigator.onLine) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [navigator.onLine]);
  if (!status) {
    return (
      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1>You Are Offline. Trying to reconnect...</h1>
      </div>
    );
  } else {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/*" element={<WEBSITE_CONTENT />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
  }
}

export default App;
