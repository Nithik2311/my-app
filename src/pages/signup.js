import Head from "next/head";
import Link from "next/link";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Sign Up | Bus Scheduler</title>
      </Head>

      <main className="signup-page">
        <div className="signup-card">
          <div className="signup-header">
            <img src="/route-map-icon.png" alt="Route Icon" className="bus-icon" />
            <h2>Create an Account</h2>
            <p>Join the network. Get smarter commute insights.</p>
          </div>

          <form className="signup-form">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" required />

            <label>Email Address</label>
            <input type="email" placeholder="jane@example.com" required />

            <label>Password</label>
            <input type="password" placeholder="••••••••" required />

            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••" required />

            <button type="submit">Sign Up</button>
          </form>

          <p className="bottom-link">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>

        <style jsx>{`
          .signup-page {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f3e8ff;
            font-family: 'Poppins', sans-serif;
            background-image: url('/bus-route-lines.svg');
            background-repeat: no-repeat;
            background-position: left bottom;
            background-size: 500px;
          }

          .signup-card {
            background: #ffffff;
            padding: 3rem 2.5rem;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            max-width: 450px;
            width: 100%;
          }

          .signup-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .bus-icon {
            width: 50px;
            margin-bottom: 0.5rem;
          }

          h2 {
            color: #0f172a;
            margin: 0;
            font-size: 1.8rem;
          }

          .signup-header p {
            color: #475569;
            font-size: 0.95rem;
          }

          .signup-form label {
            font-weight: 500;
            margin-bottom: 0.25rem;
            display: block;
            color: #1e293b;
          }

          .signup-form input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1.25rem;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            font-size: 1rem;
            background-color: #f8fafc;
          }

          .signup-form input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }

          button {
            width: 100%;
            background: #9400D3;
            border: none;
            padding: 0.75rem;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            border-radius: 8px;
            cursor: pointer;
          }

          button:hover {
            background: #000000;
          }

          .bottom-link {
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #475569;
          }

          .bottom-link a {
            color: #0ea5e9;
            text-decoration: none;
          }

          .bottom-link a:hover {
            text-decoration: underline;
          }
        `}</style>
      </main>
    </>
  );
}
