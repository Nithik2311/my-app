import Head from "next/head";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Automated Bus Scheduler</title>
      </Head>
      <style jsx>{`
        .contactPage {
          min-height: 100vh;
          background: linear-gradient(to right, #ede7f6, #d1c4e9);
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .content {
          padding: 4rem 2rem;
          text-align: center;
          color: #4a148c;
        }

        .content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .content p {
          font-size: 1.1rem;
          color: #5e35b1;
          max-width: 700px;
          margin: 0 auto;
        }

        footer {
          background: #6a1b9a;
          color: white;
          padding: 2rem 1rem;
          text-align: center;
          border-top-left-radius: 40px;
          border-top-right-radius: 40px;
        }

        .footer-container {
          max-width: 800px;
          margin: auto;
        }

        .contact-info {
          margin-bottom: 1rem;
          line-height: 1.8;
        }

        .social-icons {
          margin-top: 1rem;
        }

        .social-icons span {
          display: inline-block;
          margin: 0 0.5rem;
          font-size: 1.3rem;
          background: #9575cd;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.3s;
        }

        .social-icons span:hover {
          background: #d1c4e9;
          color: #4a148c;
          cursor: pointer;
        }
      `}</style>

      <div className="contactPage">
        <div className="content">
          <h1>Contact Us</h1>
          <p>
            Have questions, feedback, or suggestions? We’d love to hear from you!
            Reach out using the details below or connect with us on social media.
          </p>
        </div>

        <footer>
          <div className="footer-container">
            <div className="contact-info">
              📞 Phone: +91 98765 43210<br />
              📧 Email: support@busscheduler.in<br />
              📍 Location: Chennai, Tamil Nadu, India
            </div>
            <div className="social-icons">
              <span>📘</span>
              <span>📸</span>
              <span>💼</span>
              <span>🐦</span>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}>
              &copy; {new Date().getFullYear()} Automated Bus Scheduler. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
