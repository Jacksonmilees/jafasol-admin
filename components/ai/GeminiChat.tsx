import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../../types';
import { MOCK_SCHOOLS, MOCK_USERS, MOCK_ANALYTICS, MOCK_TICKETS, PLANS } from '../../constants';
import { GeminiIcon } from '../icons/Icons';
import Card from '../ui/Card';

const GeminiChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const initChat = async () => {
            setIsLoading(true);
            try {
                if (process.env.API_KEY) {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    const systemInstruction = `You are a helpful assistant for the Jafasol Super Admin dashboard. Your goal is to answer questions about the platform's data based on the JSON context provided. Be concise and clear in your answers. Format lists or tables neatly. The data contains: schools, users, analytics, support tickets, and billing plans.`;
                    
                    chatRef.current = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: {
                            systemInstruction,
                        },
                    });

                    const platformDataContext = {
                        schools: MOCK_SCHOOLS,
                        users: MOCK_USERS,
                        analytics: MOCK_ANALYTICS,
                        supportTickets: MOCK_TICKETS,
                        plans: PLANS,
                    };
                    const contextString = JSON.stringify(platformDataContext);
                    const prompt = `Here is the platform data context in JSON format. Use this to answer all subsequent questions. Do not mention this context message in your responses unless asked. Just acknowledge that you have received the context and are ready by replying with a single, short sentence. Context: ${contextString}`;
                    
                    await chatRef.current.sendMessage({ message: prompt });
                    
                    setMessages([{
                        id: 'init',
                        sender: 'ai',
                        text: 'Hello! I am the Jafasol AI Assistant. I have loaded the platform data. Ask me anything, like "How many schools are on the Premium plan?" or "List all suspended users".'
                    }]);
                    setIsReady(true);
                } else {
                     setMessages([{
                        id: 'init-error',
                        sender: 'ai',
                        text: 'Error: API_KEY is not configured. This feature is disabled. Please ask the administrator to configure the API key.'
                    }]);
                }
            } catch(error) {
                console.error("Gemini AI initialization failed:", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                setMessages([{
                    id: 'init-error',
                    sender: 'ai',
                    text: `There was an error initializing the AI Assistant: ${errorMessage}`
                }]);
            } finally {
                setIsLoading(false);
            }
        };
        
        initChat();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !isReady) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: input });
            
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            const errorAiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: `Sorry, I encountered an error: ${errorMessage}`,
                sender: 'ai'
            };
            setMessages(prev => [...prev, errorAiMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholderText = () => {
        if (isLoading && !isReady) return "Initializing AI Assistant...";
        if (!isReady) return "AI Assistant is not available.";
        return "Ask the AI anything...";
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gemini AI Chat</h1>
                <p className="mt-1 text-gray-600">Ask questions about your platform data using natural language.</p>
            </div>
            <Card className="flex-grow flex flex-col h-[calc(100vh-200px)]">
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <GeminiIcon className="w-6 h-6 text-primary" />
                                </div>
                            )}
                            <div className={`max-w-xl p-4 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <img className="w-10 h-10 rounded-full" src="https://picsum.photos/seed/admin/40/40" alt="User Avatar" />
                            )}
                        </div>
                    ))}
                    {isLoading && isReady && (
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <GeminiIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="max-w-xl p-4 rounded-xl bg-gray-100 text-gray-800">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t bg-white rounded-b-xl">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={getPlaceholderText()}
                            className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            disabled={isLoading || !isReady}
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400"
                            disabled={isLoading || !input.trim() || !isReady}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default GeminiChat;
