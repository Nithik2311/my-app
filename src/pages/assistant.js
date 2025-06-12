import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Head from "next/head";
import { useRouter } from "next/router";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function AIAssistantPage() {
  const router = useRouter();
  const { source, destination } = router.query;
  const [messages, setMessages] = useState([
    { 
      text: `Hello! I'm your Chennai bus travel assistant. You're planning a trip from ${source || 'your starting point'} to ${destination || 'your destination'}. How can I help you today?`,
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const prompt = `
        You are a helpful bus travel assistant in Chennai. 
        ${source ? `User is traveling from ${source} to ${destination}.` : ''}
        They asked: "${input}"
        
        Provide a helpful response considering:
        - Bus routes and numbers
        - Approximate fares
        - Travel time estimates
        - Alternative options
        - Accessibility information
        - Current traffic conditions if relevant
        - Safety tips
        
        Keep responses concise (1-3 sentences) and practical.
        If the question isn't bus-related, politely explain you specialize in bus travel.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiMessage = { text: response.text(), sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bus Travel Assistant | Automated Bus Scheduler</title>
        <meta name="description" content="AI-powered bus travel assistant for Chennai" />
      </Head>

      <div className="assistantContainer">
        <div className="header">
          <h1>🚍 Chennai Bus Travel Assistant</h1>
          {source && destination && (
            <p className="routeInfo">Helping with your trip from <strong>{source}</strong> to <strong>{destination}</strong></p>
          )}
          <button 
            className="backButton"
            onClick={() => router.back()}
          >
            ← Back to Map
          </button>
        </div>

        <div className="chatContainer">
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="typingIndicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="inputArea">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about bus routes, fares, or travel tips..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        <div className="suggestionBox">
          <p>Try asking:</p>
          <div className="suggestions">
            <button onClick={() => setInput("What's the fastest bus route?")}>
              What's the fastest bus route?
            </button>
            <button onClick={() => setInput("How much will the fare cost?")}>
              How much will the fare cost?
            </button>
            <button onClick={() => setInput("Are there any accessible buses?")}>
              Are there any accessible buses?
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .assistantContainer {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(to bottom, #f5f7fa, #e4e8f0);
          font-family: 'Poppins', sans-serif;
        }

        .header {
          background: #5e35b1;
          color: white;
          padding: 1.5rem;
          text-align: center;
          position: relative;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
          margin: 0;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .routeInfo {
          margin: 0.5rem 0 0;
          font-size: 1rem;
          opacity: 0.9;
        }

        .backButton {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .backButton:hover {
          background: rgba(255,255,255,0.3);
        }

        .chatContainer {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem;
          overflow: hidden;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #d1c4e9 #f3e5f5;
        }

        .messages::-webkit-scrollbar {
          width: 6px;
        }

        .messages::-webkit-scrollbar-track {
          background: #f3e5f5;
        }

        .messages::-webkit-scrollbar-thumb {
          background-color: #d1c4e9;
          border-radius: 6px;
        }

        .message {
          max-width: 80%;
          padding: 1rem 1.2rem;
          border-radius: 18px;
          line-height: 1.5;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
          align-self: flex-end;
          background: #5e35b1;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.ai {
          align-self: flex-start;
          background: white;
          color: #333;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .typingIndicator {
          display: flex;
          gap: 5px;
        }

        .typingIndicator span {
          width: 8px;
          height: 8px;
          background: #9e9e9e;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typingIndicator span:nth-child(1) {
          animation-delay: 0s;
        }

        .typingIndicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typingIndicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        .inputArea {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 0;
          border-top: 1px solid #e0e0e0;
          margin-top: auto;
        }

        .inputArea input {
          flex: 1;
          padding: 0.8rem 1.2rem;
          border: 1px solid #d1c4e9;
          border-radius: 24px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }

        .inputArea input:focus {
          border-color: #5e35b1;
        }

        .inputArea button {
          padding: 0.8rem 1.5rem;
          background: #5e35b1;
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .inputArea button:disabled {
          background: #b39ddb;
          cursor: not-allowed;
        }

        .inputArea button:not(:disabled):hover {
          background: #4527a0;
        }

        .suggestionBox {
          padding: 1rem 1.5rem;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .suggestionBox p {
          margin: 0 0 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .suggestions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .suggestions button {
          padding: 0.5rem 1rem;
          background: #ede7f6;
          border: none;
          border-radius: 16px;
          font-size: 0.85rem;
          color: #5e35b1;
          cursor: pointer;
          transition: background 0.2s;
        }

        .suggestions button:hover {
          background: #d1c4e9;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.5rem;
            padding-right: 60px;
          }

          .backButton {
            padding: 0.3rem 0.8rem;
            font-size: 0.8rem;
          }

          .chatContainer {
            padding: 1rem;
          }

          .message {
            max-width: 90%;
          }

          .suggestions {
            flex-direction: column;
          }

          .suggestions button {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}