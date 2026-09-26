/* FandomVerse Guide — floating, pre-scripted FAQ chatbot. */
import { useEffect, useRef, useState } from 'react';
import FANDOM_DATA from '../../data/fandomData.js';
import { useUI } from '../../context/UIContext.jsx';
import useHoverScroll from '../../hooks/useHoverScroll.js';
import { matchChatQuery } from '../../services/chatbotEngine.js';
import { ChatIcon, SendIcon } from '../common/Icons.jsx';
import ChatMessage from './ChatMessage.jsx';

const KNOWLEDGE = FANDOM_DATA.chatbot || {};
const WELCOME = KNOWLEDGE.welcomeMessage || "Hi! I'm the FandomVerse Guide. What would you like to explore?";

export default function Chatbot() {
  const { chatOpen, toggleChat } = useUI();
  const [messages, setMessages] = useState([{ from: 'bot', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [seen, setSeen] = useState(false);
  const streamRef = useRef(null);
  const chipsRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useHoverScroll(chipsRef);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Focus the input when opened and clear the unread dot
  useEffect(() => {
    if (!chatOpen) return;
    setSeen(true);
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [chatOpen]);

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages]);

  const ask = (question, answer, delay) => {
    setMessages(m => [...m, { from: 'user', text: question }]);
    timers.current.push(setTimeout(() => setMessages(m => [...m, { from: 'bot', ...answer }]), delay));
  };

  const handleChip = (q) => ask(q.question, { text: q.answer, action: q.action }, 250);

  const handleSend = () => {
    const query = input.trim();
    if (!query) return;
    setInput('');
    ask(query, matchChatQuery(query, KNOWLEDGE), 300);
  };

  return (
    <div className="chatbot-wrapper">
      <button type="button" className="chatbot-launcher-btn" onClick={toggleChat} title="Open FandomVerse Guide" aria-label="Open Chatbot Guide">
        <ChatIcon />
        {!seen && <span className="chat-unread-dot" />}
      </button>

      <div className={`chatbot-window ${chatOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chat-agent-info">
            <div className="chat-avatar">FV</div>
            <div>
              <div className="chat-agent-name">FandomVerse Guide</div>
              <div className="chat-agent-status">
                <span className="clock-live-dot" style={{ width: 6, height: 6 }} />
                <span>Rule-Based Assistant</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={toggleChat} style={{ color: 'var(--text-muted)', fontSize: 18 }}>✕</button>
        </div>

        <div ref={streamRef} className="chatbot-messages-area">
          {messages.map((msg, i) => <ChatMessage key={i} message={msg} onAction={toggleChat} />)}
        </div>

        <div ref={chipsRef} className="chat-quick-replies-strip">
          {(KNOWLEDGE.predefinedQuestions || []).map(q => (
            <button key={q.id} type="button" className="chat-chip" onClick={() => handleChip(q)}>{q.question}</button>
          ))}
        </div>

        <div className="chatbot-input-bar">
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder="Ask a question or select a topic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button type="button" className="chat-send-btn" onClick={handleSend} title="Send Message">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
