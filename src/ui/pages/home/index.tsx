import { Route, Routes } from "react-router-dom";
import Navbar from "../../components/navbar";
import Landing from "./landing";
import Footer from "../../components/footer";
import Peoples from "../peoples";
import Publications from "./publications";
import Datasets from "../datasets";
import ResearchAreas from "../research/areas";
import ResearchAreasDetails from "../research/areas.details";

const WEBSITE_CONTENT: any = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/peoples" element={<Peoples />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/research-areas" element={<ResearchAreas />} />
        <Route path="/research-areas/:id" element={<ResearchAreasDetails />} />
        <Route path="/publications" element={<Publications ref_={false} />} />
      </Routes>
      <Footer />
    </>
  );
};

export default WEBSITE_CONTENT;
