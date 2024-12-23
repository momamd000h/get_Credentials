import React, { useState } from "react";

const Interactive = () => {
  const videos = [
    {
      title: "Parameter Estimation in MATLAB",
      description:
        "Learn the basics of parameter estimation using MATLAB tools.",
      embedUrl:
        "https://drive.google.com/file/d/13li9plh2lz8s4bs08IG4jdudmFIFkjtQ/preview", // Google Drive embed link
      imageUrl:
        "https://www.mathworks.com/discovery/parameter-estimation/_jcr_content/imageParsys/thumbnail_0.adapt.480.medium.jpg/1670912074726.jpg", // Replace with an actual image URL
    },
  ];

  // Manage state for which video is being shown
  const [showVideo, setShowVideo] = useState(videos.map(() => false));

  const toggleVideo = (index) => {
    setShowVideo((prevState) =>
      prevState.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div>
      <header>
        <h1>Welcome to CoTune</h1>
      </header>
      <div style={{ margin: "20px" }}>
        {videos.map((video, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", color: "#333" }}>{video.title}</h2>
            <p style={{ fontSize: "1.2rem", color: "#555" }}>
              {video.description}
            </p>
            {!showVideo[index] ? (
              <img
                src={video.imageUrl}
                alt={`${video.title} Thumbnail`}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => toggleVideo(index)}
              />
            ) : (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                }}
              >
                <iframe
                  src={video.embedUrl}
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interactive;
