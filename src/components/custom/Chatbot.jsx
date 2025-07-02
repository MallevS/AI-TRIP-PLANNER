import React, { useState, useEffect, useRef } from 'react';
import useChatContext from '../../hooks/useChatContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSend } from 'react-icons/io5';

const renderBotMessage = (text) => {
    return <span>{text}</span>;
};

const Chatbot = ({ formData }) => {
    const chatContext = useChatContext(formData);
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "Hi! I'm your travel assistant. Ask me anything about your trip to " +
                (chatContext?.location || 'your destination') + "!"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const newMessages = [...messages, { from: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
            if (!apiKey) {
                throw new Error("API key not configured");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            const prompt = buildPrompt(input, chatContext, newMessages);

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "You are a friendly travel assistant that provides helpful suggestions about trip planning." }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "I'm happy to help with your travel plans! I can suggest activities, dining options, and itinerary ideas based on your preferences." }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.9,
                },
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(msgs => [...msgs, { from: 'bot', text }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(msgs => [...msgs, {
                from: 'bot',
                text: "Sorry, I encountered an error. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const buildPrompt = (userInput, context, messageHistory) => {
        let contextStr = '';
        if (context) {
            contextStr = `You're helping plan a trip with these details:
- Destination: ${context.location || 'Not specified'}
- Budget: ${context.budget || 'Not specified'}
- Travelers: ${context.traveler || 'Not specified'}
- Travel Style: ${context.travelStyle || 'Not specified'}
- Activities: ${context.activities || 'Not specified'}
- Dietary: ${context.dietary || 'No preference'}
- Accessibility: ${context.accessibility || 'No requirements'}\n\n`;
        }

        const history = messageHistory
            .slice(-4)
            .map(m => `${m.from === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
            .join('\n');

        return `${contextStr}Current conversation:\n${history}\n\nPlease respond conversationally to the user's question about their trip, keeping your answer concise (1-3 sentences).`;
    };

    return (
        <div className="bg-white/5 rounded-xl p-4 h-full flex flex-col min-h-[330px] max-h-[330px]">
            <div className="flex-1 overflow-y-auto space-y-2 mb-2 cool-scrollbar">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`
                text-sm p-2 rounded-lg max-w-[80%] inline-block
                ${msg.from === 'bot'
                                    ? 'bg-cyan-900/30 text-cyan-200 text-left'
                                    : 'bg-cyan-500/20 text-white text-right'
                                }
            `}
                            style={{ wordBreak: 'break-word' }}
                        >
                            {msg.from === 'bot' ? renderBotMessage(msg.text) : msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-sm p-2 rounded-lg bg-cyan-900/30 text-cyan-200">
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse">Thinking</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 rounded-full px-4 py-2 bg-cyan-900/20 text-white placeholder:text-cyan-300 border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-150"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your trip..."
                    disabled={loading}
                />
                <button
                    className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    <IoSend className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;