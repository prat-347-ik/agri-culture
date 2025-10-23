import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './Chatbot.css';
import { useTranslation } from 'react-i18next'; 

const Chatbot = () => {
  const { t, i18n } = useTranslation(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const messagesEndRef = useRef(null);

  // Set greeting on initial load and when language changes
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: t('chatbot.greeting', "Hello! How can I help you with your farming questions today?") }
    ]);
  }, [t]); // Re-runs when 't' function changes (language change)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      // Call the /api/chat endpoint
      const res = await axiosPrivate.post('/api/chat', {
        message: input, 
        language: i18n.language 
      });

      // Expect 'res.data.reply'
      if (res.data && res.data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
      } else {
        throw new Error('No reply from AI');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: t('chatbot.error', 'Sorry, I am having trouble connecting. Please try again later.') 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Using the embedded structure from your old file
  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={t('chatbot.placeholder', 'Type your message...')}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {t('chatbot.send_button', 'Send')}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;