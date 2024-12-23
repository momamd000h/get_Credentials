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

  const [showVideo, setShowVideo] = useState(videos.map(() => false));

  const toggleVideo = (index) => {
    setShowVideo((prevState) =>
      prevState.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to CoTune</h1>
      </header>
      <div style={styles.videoContainer}>
        {videos.map((video, index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.videoTitle}>{video.title}</h2>
            <p style={styles.description}>{video.description}</p>
            {!showVideo[index] ? (
              <img
                src={video.imageUrl}
                alt={`${video.title} Thumbnail`}
                style={styles.thumbnail}
                onClick={() => toggleVideo(index)}
              />
            ) : (
              <div style={styles.videoWrapper}>
                <iframe
                  src={video.embedUrl}
                  frameBorder="0"
                  allowFullScreen
                  style={styles.videoPlayer}
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f4f4f9",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
  },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: "600px",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  videoTitle: {
    fontSize: "1.8rem",
    color: "#222",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "15px",
  },
  thumbnail: {
    width: "100%",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  videoWrapper: {
    position: "relative",
    overflow: "hidden",
    paddingTop: "56.25%", // 16:9 aspect ratio
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  videoPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "12px",
  },
};

export default Interactive;
