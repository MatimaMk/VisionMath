"use client";
import React from "react";
import { Globe } from "lucide-react";
import { CSSProperties } from "react";
import { useRouter } from "next/navigation";

// Define the styles with proper TypeScript typing
interface StylesDictionary {
  [key: string]: CSSProperties;
}

const styles: StylesDictionary = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 50px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    height: "64px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#00BFA6",
  },
  nav: {
    display: "flex",
    gap: "24px",
  },
  menuItem: {
    fontSize: "16px",
    cursor: "pointer",
  },
  headerButtons: {
    display: "flex",
    gap: "12px",
  },
  textButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "8px 16px",
  },
  primaryButton: {
    backgroundColor: "#00BFA6",
    color: "white",
    border: "none",
    borderRadius: "2px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  heroSection: {
    backgroundColor: "#F0FFF9",
    padding: "60px 50px",
    minHeight: "500px",
  },
  heroContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  capsText: {
    color: "#00BFA6",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "48px",
    marginTop: "12px",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  tagline: {
    marginTop: "8px",
    marginBottom: "30px",
    color: "#444",
    fontSize: "18px",
    maxWidth: "700px",
  },
  actionButtons: {
    display: "flex",
    gap: "16px",
    marginBottom: "60px",
  },
  actionButton: {
    height: "48px",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0 24px",
    backgroundColor: "#00BFA6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  demoButton: {
    height: "48px",
    fontSize: "16px",
    backgroundColor: "white",
    color: "#444",
    border: "1px solid #ddd",
    padding: "0 24px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  statsContainer: {
    display: "flex",
    gap: "40px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
  },
  statValue: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#00BFA6",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "16px",
    color: "#666",
  },
  featuresSection: {
    padding: "80px 50px",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  featureDescription: {
    maxWidth: "600px",
    margin: "0 auto 60px auto",
    color: "#666",
    fontSize: "18px",
    lineHeight: "1.6",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    padding: "30px 20px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    border: "1px solid #eee",
  },
  featureIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "8px",
    backgroundColor: "#E6F7F4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 12px 0",
  },
  featureText: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#666",
    margin: 0,
  },
  // Additional styles from the requested CSS method
  card_div: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "32px",
    border: "4px solid green",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    height: "48px",
    fontSize: "16px",
    border: "2px solid green",
    borderRadius: "4px",
    width: "100%",
    padding: "0 12px",
  },
  button: {
    width: "100%",
    height: "56px",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "16px",
    backgroundColor: "#00BFA6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  paragraph: {
    marginTop: "20px",
    fontSize: "16px",
    textAlign: "center",
  },
  link: {
    color: "green",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

const VisionMathLanding: React.FC = () => {
  const router = useRouter();
  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Globe size={32} color="#00BFA6" />
          <span style={{ marginLeft: "8px" }}>VisionMath</span>
        </div>
        <nav style={styles.nav}>
          <div style={styles.menuItem}>Features</div>
          <div style={styles.menuItem}>For Students</div>
          <div style={styles.menuItem}>For Educators</div>
        </nav>
        <div style={styles.headerButtons}>
          <button style={styles.textButton}>Log In</button>
          <button style={styles.primaryButton}>Sign Up Free</button>
        </div>
      </header>

      <main>
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.capsText}>CAPS-ALIGNED MATHEMATICS PLATFORM</div>
            <h1 style={styles.title}>
              Master <span style={{ color: "#00BFA6" }}>Mathematics</span>{" "}
              Concepts
            </h1>
            <p style={styles.tagline}>
              VisionMath transforms how students learn and teachers teach
              mathematical concepts through AI-powered visual learning,
              interactive lessons, and personalized education.
            </p>
            <div style={styles.actionButtons}>
              <button
                style={styles.actionButton}
                onClick={() => router.push("/login")}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>
            Powerful Features for Mathematical Excellence
          </h2>

          <p style={styles.featureDescription}>
            Our comprehensive platform combines visual learning, interactive
            tests, and AI-powered assistance to make mathematics accessible and
            engaging.
          </p>

          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="9"
                    x2="21"
                    y2="9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="21"
                    x2="9"
                    y2="9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>CAPS-Aligned Content</h3>
              <p style={styles.featureText}>
                Access a vast library of topics perfectly aligned with CAPS
                curriculum requirements, organized by grade and difficulty.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                  <path d="M16 12L10 16L10 8L16 12Z" fill="#00BFA6" />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Video Lessons</h3>
              <p style={styles.featureText}>
                Watch comprehensive video lessons on mathematical concepts with
                downloadable options for offline learning.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Auto-Graded Tests</h3>
              <p style={styles.featureText}>
                Test your knowledge with intelligent quizzes that provide
                instant feedback and detailed explanations for each answer.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19H20M4 5H20M6 9H18M6 15H18"
                    stroke="#00BFA6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Progress Tracking</h3>
              <p style={styles.featureText}>
                Monitor your learning journey with intuitive dashboards showing
                completion rates, test performance, and time spent on each
                topic.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16L12 8M12 8L8 12M12 8L16 12"
                    stroke="#00BFA6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Math Image Processing</h3>
              <p style={styles.featureText}>
                Simply upload a photo of a math problem and receive step-by-step
                solutions with visual explanations instantly.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#00BFA6"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8V16M8 12L16 12"
                    stroke="#00BFA6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>AI Learning Assistant</h3>
              <p style={styles.featureText}>
                Receive personalized learning suggestions, study tips, and early
                alerts for topics that need extra attention.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisionMathLanding;
