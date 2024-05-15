import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./ui/pages/dashboard";
import WEBSITE_CONTENT from "./ui/pages/home";
import Login from "./ui/pages/login";
import ScrollToTop from "./utils/scrollToTop";
import DetailProfile from "./ui/pages/peoples/detail.profile";
import Alert from "./ui/components/alert";
import { useSelector } from "react-redux";
import Register from "./ui/pages/register";
import DetailProfilePHD from "./ui/pages/peoples/phd.profile";
import { useEffect, useState } from "react";
import { getSiteSettings } from "./services/firebase/settings";
import MainLoader from "./ui/components/main loader";

function App() {
  const getalerts = useSelector((state: any) => state.getalerts.data);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const handleLoad = async () => {
      await getSiteSettings();
      setLoading(false);
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  if (loading) {
    return <MainLoader />;
  }
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
        <Route path="/phd/:id" element={<DetailProfilePHD />} />
        <Route path="/*" element={<WEBSITE_CONTENT />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
