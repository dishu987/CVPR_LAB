const AboutUs = () => {
  return (
    <div className="col-sm-12 py-3 px-4  my-3 mb-5">
      {/* <div className="h1 text-danger w-100 text-center mt-4 mb-5">About Us</div> */}
      <div className="col-md-12 col-sm-12 d-flex flex-md-row flex-sm-column flex-column gap-3">
        <div className="col-md-6 col-sm-12 p-lg-2 p-0">
          <img
            src="https://visionintelligence.github.io/assets/images/group.jpg"
            alt=""
            className="image-fluid rounded-3 image_up"
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <h1 className="fw-bold text-danger">Our Objective</h1>
          <hr />
          <p>
            The Vision Intelligence Lab is a multidisciplinary group performing
            basic and applied research computer vision, machine learning and
            deep learning. Our lab aims to develop intelligent algorithms that
            perform important visual perception tasks such as object detection,
            human emotion recognition, aberrant event detection, image
            retrieval, Motion analysis, etc. Currently, we are dealing with:-
          </p>
          <ol>
            <li>Moving Object Detection and Analysis</li>
            <li>Facial Expression</li>
            <li>Recognition</li>
            <li>Anomaly Detection and Analysis</li>
            <li>Content Based Image Retrieval</li>
            <li>Hand Gesture Recognition</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
