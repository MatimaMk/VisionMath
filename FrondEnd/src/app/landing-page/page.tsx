"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./style/landingPage.module.css";

const VisionMathLanding: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Globe size={32} className={styles.logoIcon} />
          <span className={styles.logoText}>VisionMath</span>
        </div>
        <nav className={styles.nav}>
          <div className={styles.menuItem}>Features</div>
          <div className={styles.menuItem}>For Students</div>
          <div className={styles.menuItem}>For Educators</div>
        </nav>
        <div className={styles.headerButtons}>
          <button className={styles.textButton}>Log In</button>
          <button
            className={styles.primaryButton}
            onClick={() => router.push("/signUp")}
          >
            Sign Up Free
          </button>
        </div>
      </header>

      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.capsText}>
              CAPS-ALIGNED MATHEMATICS PLATFORM
            </div>
            <h1 className={styles.title}>
              Master <span className={styles.gradientText}>Mathematics</span>{" "}
              Concepts
            </h1>
            <p className={styles.tagline}>
              VisionMath transforms how students learn and teachers teach
              mathematical concepts through AI-powered visual learning,
              interactive lessons, and personalized education.
            </p>
            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={() => router.push("/login")}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>
            Powerful Features for Mathematical Excellence
          </h2>

          <p className={styles.featureDescription}>
            Our comprehensive platform combines visual learning, interactive
            tests, and AI-powered assistance to make mathematics accessible and
            engaging.
          </p>

          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
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
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="9"
                    x2="21"
                    y2="9"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="21"
                    x2="9"
                    y2="9"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>CAPS-Aligned Content</h3>
              <p className={styles.featureText}>
                Access a vast library of topics perfectly aligned with CAPS
                curriculum requirements, organized by grade and difficulty.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
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
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                  />
                  <path d="M16 12L10 16L10 8L16 12Z" fill="url(#gradient2)" />
                  <defs>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Video Lessons</h3>
              <p className={styles.featureText}>
                Watch comprehensive video lessons on mathematical concepts with
                downloadable options for offline learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
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
                    stroke="url(#gradient3)"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="url(#gradient3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Auto-Graded Tests</h3>
              <p className={styles.featureText}>
                Test your knowledge with intelligent quizzes that provide
                instant feedback and detailed explanations for each answer.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19H20M4 5H20M6 9H18M6 15H18"
                    stroke="url(#gradient4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient4"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Progress Tracking</h3>
              <p className={styles.featureText}>
                Monitor your learning journey with intuitive dashboards showing
                completion rates, test performance, and time spent on each
                topic.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16L12 8M12 8L8 12M12 8L16 12"
                    stroke="url(#gradient5)"
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
                    stroke="url(#gradient5)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient
                      id="gradient5"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Math Image Processing</h3>
              <p className={styles.featureText}>
                Simply upload a photo of a math problem and receive step-by-step
                solutions with visual explanations instantly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
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
                    stroke="url(#gradient6)"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8V16M8 12L16 12"
                    stroke="url(#gradient6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient6"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#20B2AA" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI Learning Assistant</h3>
              <p className={styles.featureText}>
                Receive personalized learning suggestions, study tips, and early
                alerts for topics that need extra attention.
              </p>
            </div>
          </div>
        </section>

        {/* New Green Gradient Section */}
        <section className={styles.greenGradientSection}>
          <div className={styles.gradientContent}>
            <h2>Start Your Mathematical Journey Today</h2>
            <p>
              Join thousands of students who are already improving their math
              skills with VisionMath&apos;s interactive platform.
            </p>

            <button
              className={styles.whiteButton}
              onClick={() => router.push("/signup")}
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>VisionMath</h3>
            <p className={styles.footerText}>
              Making mathematics education accessible, engaging, and effective
              for all students.
            </p>
            <div className={styles.socialIcons}>
              {/* Social media icons could go here */}
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>Home</li>
              <li>About Us</li>
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Resources</h3>
            <ul className={styles.footerLinks}>
              <li>Blog</li>
              <li>Tutorials</li>
              <li>Support</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact</h3>
            <ul className={styles.footerLinks}>
              <li>Email Us</li>
              <li>Help Center</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            &copy; {new Date().getFullYear()} VisionMath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VisionMathLanding;
