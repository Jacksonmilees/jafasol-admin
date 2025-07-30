import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import { SupportTicket, TicketStatus, TicketPriority, TicketMessage } from '../../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { GeminiIcon } from '../icons/Icons';

interface TicketDetailsModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onUpdate: (updatedTicket: SupportTicket) => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose, onUpdate }) => {
    const [reply, setReply] = useState('');
    const [currentTicket, setCurrentTicket] = useState<SupportTicket>(ticket);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);
    
    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentTicket.conversation]);
    
    useEffect(() => {
        if (process.env.API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemInstruction = `You are a support agent for Jafasol, a school management software platform. Your persona is helpful, professional, and slightly formal. When asked to draft a reply to a support ticket, analyze the conversation and provide a clear, empathetic, and actionable response. Address the user by their school name if possible.`;
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
            } catch (error) {
                console.error("Failed to initialize AI for support: ", error);
            }
        }
    }, []);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TicketStatus;
        const updatedTicket = { ...currentTicket, status: newStatus };
        setCurrentTicket(updatedTicket);
        onUpdate(updatedTicket);
    };
    
    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value as TicketPriority;
        const updatedTicket = { ...currentTicket, priority: newPriority };
        setCurrentTicket(updatedTicket);
        onUpdate(updatedTicket);
    };
    
    const handleSendReply = () => {
        if (!reply.trim()) return;
        
        const newReply: TicketMessage = {
            id: `msg_${Date.now()}`,
            sender: 'Super Admin',
            senderAvatar: 'https://picsum.photos/seed/admin/40/40',
            text: reply,
            timestamp: 'Just now',
        };
        
        const updatedTicket = {
            ...currentTicket,
            conversation: [...currentTicket.conversation, newReply],
            lastUpdated: 'Just now',
            // If admin replies, ticket is now 'In Progress' unless closed
            status: currentTicket.status === TicketStatus.Closed ? TicketStatus.Closed : TicketStatus.InProgress,
        };
        
        setCurrentTicket(updatedTicket);
        onUpdate(updatedTicket);
        setReply('');
    };

    const handleGenerateReply = async () => {
        if (!chatRef.current) {
            alert("AI Assistant is not available. Please check the API key configuration.");
            return;
        }
        setIsAiLoading(true);
        setReply('Generating response...');

        const conversationHistory = currentTicket.conversation.map(m => `${m.sender}: ${m.text}`).join('\n');
        const prompt = `Here is a support ticket for my review.
        School: ${currentTicket.schoolName}
        Subject: ${currentTicket.subject}
        Initial Request: ${currentTicket.description}
        
        Conversation History:
        ${conversationHistory}
        
        Draft a helpful reply from the Super Admin to the School Admin.`;

        try {
            const response = await chatRef.current.sendMessage({ message: prompt });
            setReply(response.text);
        } catch (error) {
            console.error("Error generating AI reply:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setReply(`Sorry, I could not generate a reply. Error: ${errorMessage}`);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Ticket: ${ticket.subject}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {/* Description */}
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-800">Initial Request from {ticket.schoolName}</h4>
                        <p className="mt-2 text-sm text-gray-600">{ticket.description}</p>
                    </div>

                    {/* Conversation */}
                    <div className="space-y-4 max-h-80 overflow-y-auto p-4 border rounded-lg">
                        {currentTicket.conversation.map(msg => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'Super Admin' ? 'justify-end' : ''}`}>
                                {msg.sender === 'School Admin' && (
                                    <img src={msg.senderAvatar} alt="School Admin" className="w-8 h-8 rounded-full" />
                                )}
                                <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'Super Admin' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'Super Admin' ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.timestamp}</p>
                                </div>
                                {msg.sender === 'Super Admin' && (
                                    <img src={msg.senderAvatar} alt="Super Admin" className="w-8 h-8 rounded-full" />
                                )}
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Form */}
                    <div className="space-y-2">
                        <label htmlFor="reply" className="text-sm font-medium text-gray-700">Your Reply</label>
                        <textarea
                            id="reply"
                            rows={4}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="Type your response or generate one with AI..."
                            disabled={isAiLoading}
                        />
                        <div className="flex justify-end items-center space-x-3">
                             <button onClick={handleGenerateReply} disabled={isAiLoading || !chatRef.current} className="inline-flex items-center text-sm font-medium text-primary hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                <GeminiIcon className={`w-5 h-5 mr-1 ${isAiLoading ? 'animate-spin' : ''}`} />
                                {isAiLoading ? 'Generating...' : 'Generate with AI'}
                             </button>
                            <button onClick={handleSendReply} className="bg-primary text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border h-fit">
                     <h4 className="font-semibold text-gray-800">Ticket Details</h4>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" value={currentTicket.status} onChange={handleStatusChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select id="priority" value={currentTicket.priority} onChange={handlePriorityChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                     <div className="text-sm">
                        <p className="text-gray-500">School: <span className="font-medium text-gray-800">{currentTicket.schoolName}</span></p>
                        <p className="text-gray-500">Last Update: <span className="font-medium text-gray-800">{currentTicket.lastUpdated}</span></p>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TicketDetailsModal;