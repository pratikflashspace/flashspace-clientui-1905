import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddLeadFormProps {
  onCancel?: () => void;
}

const AddLeadForm = ({ onCancel }: AddLeadFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    interest: 'Virtual Office',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Lead Data:', formData);
    // Logic for API calls can be placed here
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Sticky Header with X Icon - Matching Invoice Modal Style */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <p className="text-gray-500 text-xs">Fill in the details to track a new potential client.</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
        {/* Row 1: Name & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Vikram Mehta"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. NextGen Tech"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
        </div>

        {/* Row 2: Interest Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Interest</label>
          <div className="relative">
            <select 
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none appearance-none"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
            >
              <option>Virtual Office</option>
              <option>Co-working Space</option>
              <option>Private Office</option>
              <option>Meeting Room</option>
            </select>
            {/* Custom arrow for the select box */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Row 3: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="vikram.mehta@company.com"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 98765 11111"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        {/* Row 4: Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</label>
          <textarea 
            rows={3}
            placeholder="Enter lead requirements..."
            className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all italic text-gray-600"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex flex-col md:flex-row gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-3 px-4 bg-[#76B09F] hover:bg-[#659a8b] text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadForm;