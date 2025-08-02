import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const ChatbotToggle = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'sender',
            content: 'Assalamu Alaikum 👋 I\'m your NusrahPalestine assistant. We\'re here to help Palestinians in Gaza with emergency aid, medical supplies, food, and shelter. How can I assist you today? 🤲'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        
        // Add user message to chat
        const newUserMessage = {
            type: 'receiver',
            content: userMessage
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // Send message to server
            const response = await axios.post('http://localhost:5000/api/chat/chatwithme', {
                prompt: userMessage
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Add bot response to chat
            const botMessage = {
                type: 'sender',
                content: response.data.reply
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message
            const errorMessage = {
                type: 'sender',
                content: 'Sorry, I\'m having trouble connecting right now. Please try again later. 🙏'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            {/* Toggle Button */}
            <button 
                className={`chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
                onClick={toggleChat}
                title="Chat with us"
            >
                {isChatOpen ? '✕' : '💬'}
            </button>

            {/* Chatbot */}
            {isChatOpen && (
                <div className="chatbot-wrapper">
                    <div className="chatdiv">
                        <div className="upper-section">
                            <div>
                                Chat with <br />
                                <span className='chatLogo'>NusraPalestine👋</span>
                            </div>
                            <span className="close-btn" onClick={closeChat}>✕</span>
                        </div>

                        <div className="weReply">
                            🟢 We Reply Immediately
                        </div>

                        <div className="chat-box" ref={chatBoxRef}>
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.type}`}>
                                    {message.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message sender">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sendArea">
                            <input 
                                className="messageBox" 
                                type="text" 
                                placeholder='Talk with us...'
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button 
                                className='sendMsgBtn' 
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotToggle; 