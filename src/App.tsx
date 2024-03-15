import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./ui/pages/dashboard";
import WEBSITE_CONTENT from "./ui/pages/home";
import Login from "./ui/pages/login";
import ScrollToTop from "./utils/scrollToTop";
import { useEffect, useState } from "react";
import DetailProfile from "./ui/pages/peoples/detail.profile";
import Alert from "./ui/components/alert";
import { useSelector } from "react-redux";

function App() {
  const getalerts = useSelector((state: any) => state.getalerts.data);
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
        {getalerts.length > 0 && (
          <div
            className="w-100 d-flex align-items-center justify-content-center flex-wrap flex-column gap-0"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              overflow: "hidden",
              height: "100vh",
              backgroundColor: "#00000046",
              zIndex: 9999,
            }}
          >
            {getalerts?.map((item_: any, index_: number) => {
              return (
                <Alert
                  key={index_}
                  content={item_?.content}
                  id={item_?.id}
                  type={item_?.type}
                />
              );
            })}
          </div>
        )}
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/profile/:id" element={<DetailProfile />} />
          <Route path="/*" element={<WEBSITE_CONTENT />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
  }
}

export default App;
