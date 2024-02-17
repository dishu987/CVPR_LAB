import { Helmet } from "react-helmet";

const ContactUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact | {import.meta.env.VITE_APP_TITLE}</title>
      </Helmet>
      <div className="my-5 container">
        <h1 className="fw-bold mb-4 text-danger text-center text-lg-start">
          Contact Us
          <hr />
        </h1>
        <div className="row">
          <div className="col-sm-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m24!1m8!1m3!1d54733.46517815982!2d76.503119!3d30.974903!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3905543310e70e63%3A0x63397d7938035537!2sRupnagar%20Old%20Bus%20Stand%2C%20Chhota%20Khera%2C%20Basant%20Nagar%2C%20Rupnagar%2C%20Punjab%20140001!3m2!1d30.966969499999998!2d76.5338166!4m5!1s0x390554d4ffffffff%3A0xb81f1e2708c91100!2sIndian%20institute%20of%20Technology%20Ropar%2C%20Bara%20Phool%2C%20Punjab%20140001!3m2!1d30.970918299999997!2d76.4731998!5e0!3m2!1sen!2sin!4v1625103532953!5m2!1sen!2sin"
              width="100%"
              height="500px"
              style={{ border: "none" }}
              allowFullScreen
            />
          </div>
          <div className="col-sm-4" id="contact2">
            <h3 className="fw-bold h1">{import.meta.env.VITE_APP_TITLE}</h3>
            <hr className="text-left w-50" />
            <h4 className="pt-2">Address</h4>
            <i className="fas fa-globe mr-3" style={{ color: "#000" }} />
            CVPR Lab, Department of Electrical Engineering, J.C.Block, IIT
            Ropar, Rupnagar, Punjab, 140001
            <br />
            <h4 className="pt-2">Mobile</h4>
            <i className="fas fa-phone" style={{ color: "#000" }} />
            <a
              href="tel:+91-3612583507"
              style={{ textDecoration: "none" }}
              target="_blank"
              className="text-dark d-flex align-items-center justify-content-start"
            >
              <i className="bx bxs-phone me-1"></i>+91-3612583507
            </a>
            <br />
            <h4 className="pt-2">Email</h4>
            <i className="fa fa-envelope" style={{ color: "#000" }} />
            <a
              href="mailto:visionintelligencelab@gmail.com"
              style={{ textDecoration: "none" }}
              target="_blank"
              className="text-dark d-flex align-items-center justify-content-start"
            >
              <i className="bx bx-envelope me-1"></i>{" "}
              visionintelligencelab[at]gmail[dot]com
            </a>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
