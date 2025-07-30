import React, { useState } from 'react';
import Card from '../ui/Card';
import { SupportTicket, TicketStatus, TicketPriority } from '../../types';
import TicketDetailsModal from './TicketDetailsModal';

interface SupportTicketsProps {
    tickets: SupportTicket[];
    onUpdateTicket: (ticket: SupportTicket) => void;
}

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [TicketStatus.Open]: "bg-blue-100 text-blue-800",
        [TicketStatus.InProgress]: "bg-yellow-100 text-yellow-800",
        [TicketStatus.Closed]: "bg-gray-100 text-gray-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const priorityClasses = {
        [TicketPriority.Low]: "bg-green-100 text-green-800",
        [TicketPriority.Medium]: "bg-yellow-100 text-yellow-800",
        [TicketPriority.High]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${priorityClasses[priority]}`}>{priority}</span>;
};

const SupportTickets: React.FC<SupportTicketsProps> = ({ tickets, onUpdateTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleUpdateTicket = (updatedTicket: SupportTicket) => {
    onUpdateTicket(updatedTicket);
    setSelectedTicket(updatedTicket); // Keep modal open with updated data
  };

  return (
    <div className="space-y-6">
       {selectedTicket && (
            <TicketDetailsModal 
                ticket={selectedTicket}
                onClose={handleCloseModal}
                onUpdate={handleUpdateTicket}
            />
        )}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
        <p className="mt-1 text-gray-600">Respond to school inquiries and track ticket status.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.schoolName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleViewTicket(ticket)} className="text-primary hover:text-indigo-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SupportTickets;
