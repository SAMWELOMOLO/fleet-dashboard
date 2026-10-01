import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VehicleRow({ vehicle, onDeregister }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to deregister vehicle ${vehicle.plate}?`)) {
      setIsDeleting(true);
      const res = await onDeregister(vehicle.id);
      setIsDeleting(false);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  return (
    <tr className="hover:bg-slate-900/30 transition border-b border-slate-800/70">
      <td className="py-3.5 px-4 font-bold font-mono text-blue-400">{vehicle.plate}</td>
      <td className="py-3.5 px-4 text-slate-200 font-medium">{vehicle.driver}</td>
      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{vehicle.phone}</td>
      <td className="py-3.5 px-4 text-slate-300">{vehicle.model}</td>
      <td className="py-3.5 px-4 font-mono text-slate-300">
        {Number(vehicle.mileage).toLocaleString()} km
      </td>
      <td className="py-3.5 px-4">
        <StatusBadge status={vehicle.status} />
      </td>
      <td className="py-3.5 px-4 text-right">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Deregister Vehicle"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/80 border border-rose-500/30 text-rose-400 hover:text-rose-100 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          <span>Deregister</span>
        </button>
      </td>
    </tr>
  );
}