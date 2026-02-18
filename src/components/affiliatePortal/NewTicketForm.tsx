import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NewTicketFormProps {
  onCancel?: () => void;
}

const NewTicketForm = ({ onCancel }: NewTicketFormProps) => {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Low',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Ticket Data:', formData);
    // Logic for API calls can be placed here
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
        {/* Sticky Header with X Icon */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create New Ticket</h2>
            <p className="text-gray-500 text-xs">Submit a new support request.</p>
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
          {/* Row 1: Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject</label>
            <input 
              type="text" 
              placeholder="e.g. Issue with Payout"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>

          {/* Row 2: Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Priority</label>
            <div className="relative">
              <select 
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none appearance-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
              {/* Custom arrow for the select box */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Row 3: Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</label>
            <textarea 
              rows={4}
              placeholder="Describe your issue..."
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#76B09F] outline-none transition-all text-gray-600"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
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
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketForm;
