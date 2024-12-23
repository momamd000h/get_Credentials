import { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./App.css"; // Ensure your styles are applied
import { Link } from "react-router-dom"; // Import Link and useNavigate
import Icon from "./Icon.png";

// Generate client for data

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <div>
        <header className="header">
          <img src={Icon} className="logo" alt="Co Tune Logo" />
          <h1> CoTune</h1>
          <div className="signout">
            <h1 className="email">{user?.signInDetails?.loginId}</h1>
            <button className="btn" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>
      </div>

      {/* Learn by Doing Section */}
      <section className="learn-by-doing">
        <h1>Master Concepts Through Practice</h1>
        <p>Hands-On Lessons to Master the Art of Control</p>
        <div className="activities">
          <div className="activity">
            <h3>Tuning sessions</h3>
            <p>Connect to IoT devices in real-time and monitor behavior.</p>
            <Link to="/send">
              <button className="btn">Start Experiment</button>
            </Link>
          </div>
          <div className="activity">
            <h3>Interactive Lessons</h3>
            <p>Step-by-step guides for tuning and customizing your devices.</p>
            <Link to="/Interactive">
              <button className="btn">Learn Now</button>
            </Link>
          </div>
          <div className="activity">
            <h3>Live Experiments</h3>
            <p>Step-by-step guides for tuning and customizing your devices.</p>
            <Link to="/IotSubscribe">
              <button className="btn">Sub</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} CoTune. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/TermsOfService">Terms of Service</Link>
          </div>
          <div className="social-media">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons8-youtube-48.png"
                alt="YouTube"
                className="social-icon"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons8-facebook-48.png"
                alt="Facebook"
                className="social-icon"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons8-linkedin-48.png"
                alt="LinkedIn"
                className="social-icon"
              />
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Contact Us Button */}
      <a
        href="https://wa.me/+201117485545" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <img
          src="/icons8-whatsapp-48.png" // Replace with your WhatsApp icon path
          alt="Contact Us on WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    </main>
  );
}

export default App;
