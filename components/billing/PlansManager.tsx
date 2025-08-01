import React, { useState } from 'react';
import Card from '../ui/Card';
import { PLANS } from '../../constants';
import { Plan, PlanName, Invoice, InvoiceStatus, School, SchoolStatus } from '../../types';
import { PlusIcon } from '../icons/Icons';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useAdmin } from '../../context/AdminContext';

// --- PlanEditorModal Component (defined in the same file) ---
interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  planToEdit: Plan | null;
}

const PlanEditorModal: React.FC<PlanEditorModalProps> = ({ isOpen, onClose, onSave, planToEdit }) => {
  const [planData, setPlanData] = useState<Omit<Plan, 'id' | 'name' | 'color'>>(
    { price: 0, durationDays: 30, features: [] }
  );
  const [name, setName] = useState<PlanName>(PlanName.Basic);
  const [featuresStr, setFeaturesStr] = useState('');

  React.useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name);
      setPlanData({
        price: planToEdit.price,
        durationDays: planToEdit.durationDays,
        features: planToEdit.features,
      });
      setFeaturesStr(planToEdit.features.join('\n'));
    } else {
      // Reset for new plan
      setName(PlanName.Basic);
      setPlanData({ price: 15000, durationDays: 30, features: [] });
      setFeaturesStr('');
    }
  }, [planToEdit, isOpen]);

  const handleSave = () => {
    const updatedPlan: Plan = {
      ...planToEdit,
      id: planToEdit ? planToEdit.id : `plan_${Date.now()}`,
      color: planToEdit ? planToEdit.color : 'gray',
      name: name,
      price: planData.price,
      durationDays: planData.durationDays,
      features: featuresStr.split('\n').filter(f => f.trim() !== ''),
    };
    onSave(updatedPlan);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={planToEdit ? `Edit ${planToEdit.name} Plan` : 'Create New Plan'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Plan Name</label>
          <select value={name} onChange={e => setName(e.target.value as PlanName)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            {Object.values(PlanName).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Price (KSh/mo)</label>
                <input type="number" value={planData.price} onChange={e => setPlanData({...planData, price: Number(e.target.value)})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                <input type="number" value={planData.durationDays} onChange={e => setPlanData({...planData, durationDays: Number(e.target.value)})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
          <textarea value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-mono text-sm" />
        </div>
        <div className="pt-4 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-primary text-white py-2 px-4 rounded-md shadow-sm">Save Plan</button>
        </div>
      </div>
    </Modal>
  );
};

// --- Main Billing Page Component ---
type ActiveTab = 'plans' | 'invoices';

interface PlansManagerProps {
    invoices: Invoice[];
    schools: School[];
    onUpdateSchool: (school: School) => void;
}

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        [InvoiceStatus.Paid]: "bg-green-100 text-green-800",
        [InvoiceStatus.Due]: "bg-blue-100 text-blue-800",
        [InvoiceStatus.Overdue]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
    </button>
);

const PlansManager: React.FC<PlansManagerProps> = ({ invoices, schools, onUpdateSchool }) => {
  const { state } = useAdmin();
  const [activeTab, setActiveTab] = useState<ActiveTab>('plans');
  const [plans, setPlans] = useState<Record<string, Plan>>(PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [suspendingInvoice, setSuspendingInvoice] = useState<Invoice | null>(null);

  const handleOpenModal = (plan: Plan | null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };
  
  const handleSavePlan = (updatedPlan: Plan) => {
    setPlans(prev => ({...prev, [updatedPlan.name]: updatedPlan}));
    // TODO: Add API call to save plan to backend
    console.log('Saving plan to backend:', updatedPlan);
  }

  const handleConfirmSuspend = () => {
    if (!suspendingInvoice) return;
    const schoolToSuspend = schools.find(s => s.id === suspendingInvoice.schoolId);
    if (schoolToSuspend) {
        onUpdateSchool({ ...schoolToSuspend, status: SchoolStatus.Suspended });
    }
    setSuspendingInvoice(null);
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    // TODO: Add API call to delete invoice
    console.log('Deleting invoice:', invoiceId);
  }

  const handleEditInvoice = (invoice: Invoice) => {
    // TODO: Add API call to edit invoice
    console.log('Editing invoice:', invoice);
  }

  return (
    <div className="space-y-6">
      <PlanEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePlan} planToEdit={editingPlan} />
      {suspendingInvoice && (
        <ConfirmationModal
            isOpen={!!suspendingInvoice}
            onClose={() => setSuspendingInvoice(null)}
            onConfirm={handleConfirmSuspend}
            title="Suspend School Account"
            message={`Are you sure you want to suspend the account for "${suspendingInvoice.schoolName}" due to an overdue invoice?`}
            confirmButtonText="Suspend"
            confirmButtonClass="bg-danger hover:bg-red-700"
        />
      )}
      
      <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Billing & Plans</h1>
            <p className="mt-1 text-gray-600">Manage subscription plans and track invoices.</p>
          </div>
          <button onClick={() => handleOpenModal(null)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create New Plan
          </button>
      </div>
      
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <TabButton label="Manage Plans" isActive={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
        <TabButton label="Recent Invoices" isActive={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
      </div>

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(plans).map((plan) => (
            <Card key={plan.name} className={`flex flex-col border-t-4 border-${plan.color}-500`}>
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                <p className="mt-2 text-gray-500">
                  <span className="text-4xl font-extrabold text-gray-900">KSh {plan.price.toLocaleString()}</span>
                  <span className="text-base font-medium text-gray-500">/{plan.durationDays === 30 ? 'mo' : 'yr'}</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50 rounded-b-xl">
                <button onClick={() => handleOpenModal(plan)} className={`w-full bg-${plan.color}-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-${plan.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${plan.color}-500`}>
                  Edit Plan
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {activeTab === 'invoices' && (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{invoice.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.schoolName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSh {invoice.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><InvoiceStatusBadge status={invoice.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                            <button onClick={() => handleEditInvoice(invoice)} className="text-primary hover:text-indigo-900">Edit</button>
                            <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-danger hover:text-red-700">Delete</button>
                            {invoice.status === InvoiceStatus.Overdue && (
                                <button onClick={() => setSuspendingInvoice(invoice)} className="text-orange-600 hover:text-orange-700">Suspend Account</button>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </Card>
      )}
    </div>
  );
};

export default PlansManager;
