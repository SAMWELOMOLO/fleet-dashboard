import React, { useState } from 'react';
import { Truck, X, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterVehicleModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    plate: '',
    driver: '',
    phone: '',
    model: '',
    mileage: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const payload = {
      ...formData,
      plate: formData.plate.toUpperCase().trim(),
      mileage: Number(formData.mileage) || 0,
    };

    const result = await onSubmit(payload);
    setSubmitting(false);

    if (result.success) {
      setFormData({ plate: '', driver: '', phone: '', model: '', mileage: '' });
      onClose();
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base flex items-center gap-2 text-white">
            <Truck className="w-5 h-5 text-blue-400" /> Register New Vehicle
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Plate Number</label>
              <input
                name="plate"
                type="text"
                placeholder="e.g. KEE 456Z"
                value={formData.plate}
                onChange={handleChange}
                required
                className="w-full bg-[#080c16] border border-slate-800 rounded-xl p-3 text-slate-200 uppercase focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Assigned Driver</label>
              <input
                name="driver"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.driver}
                onChange={handleChange}
                required
                className="w-full bg-[#080c16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Driver Phone</label>
              <input
                name="phone"
                type="tel"
                placeholder="+254..."
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#080c16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Vehicle Model</label>
              <input
                name="model"
                type="text"
                placeholder="e.g. Toyota Hilux"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full bg-[#080c16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Current Odometer (km)</label>
            <input
              name="mileage"
              type="number"
              placeholder="e.g. 75000"
              value={formData.mileage}
              onChange={handleChange}
              required
              className="w-full bg-[#080c16] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Register Vehicle</span>
          </button>
        </form>
      </div>
    </div>
  );
}