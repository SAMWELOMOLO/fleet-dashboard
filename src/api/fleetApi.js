import { useState, useEffect } from 'react';

export function useFleetApi() {
  const [fleet, setFleet] = useState(() => {
    const saved = localStorage.getItem('fleet_data');
    return saved ? JSON.parse(saved) : [
      { id: '1', plateNumber: 'KDA 000A', driverName: 'Default Driver', driverPhone: '0700000000', model: 'Probox', odometer: '45000' }
    ];
  });
  
  const [fuelRequests, setFuelRequests] = useState(() => {
    const saved = localStorage.getItem('fuel_requests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [maintenanceRequests, setMaintenanceRequests] = useState(() => {
    const saved = localStorage.getItem('maint_requests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state changes automatically to browser LocalStorage
  useEffect(() => {
    localStorage.setItem('fleet_data', JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem('fuel_requests', JSON.stringify(fuelRequests));
  }, [fuelRequests]);

  useEffect(() => {
    localStorage.setItem('maint_requests', JSON.stringify(maintenanceRequests));
  }, [maintenanceRequests]);

  useEffect(() => {
    localStorage.setItem('expenses_data', JSON.stringify(expenses));
  }, [expenses]);

  // Local Actions
  const registerVehicle = async (data) => {
    const newVehicle = { id: Date.now().toString(), ...data };
    setFleet(prev => [...prev, newVehicle]);
  };

  const deregisterVehicle = async (id) => {
    setFleet(prev => prev.filter(v => v.id !== id));
  };

  const submitFuelRequest = async (data) => {
    const newReq = { 
      id: Date.now().toString(), 
      ...data, 
      status: 'Pending', 
      approvals: { fleetManager: false, regionalManager: false, regionLead: false } 
    };
    setFuelRequests(prev => [...prev, newReq]);
  };

  const submitMaintenanceRequest = async (data) => {
    const newReq = { 
      id: Date.now().toString(), 
      ...data, 
      status: 'Pending Review', 
      approved: false 
    };
    setMaintenanceRequests(prev => [...prev, newReq]);
  };

  const submitExpense = async (data) => {
    const newExp = { id: Date.now().toString(), ...data };
    setExpenses(prev => [...prev, newExp]);
  };

  const updateFuelApproval = async (id, tier, currentApprovals) => {
    const updated = { ...currentApprovals, [tier]: !currentApprovals[tier] };
    setFuelRequests(prev => prev.map(r => r.id === id ? { ...r, approvals: updated } : r));
  };

  const updateMaintenanceApproval = async (id, currentApproved) => {
    setMaintenanceRequests(prev => prev.map(m => m.id === id ? { 
      ...m, 
      approved: !currentApproved,
      status: !currentApproved ? 'Approved (In Progress)' : 'Pending Review'
    } : m));
  };

  const uploadReceipt = async (id, note) => {
    setFuelRequests(prev => prev.map(r => r.id === id ? { ...r, receiptUrl: note } : r));
  };

  const updateMaintenanceStatusText = async (id, statusText) => {
    setMaintenanceRequests(prev => prev.map(m => m.id === id ? { ...m, status: statusText } : m));
  };

  return {
    fleet,
    fuelRequests,
    maintenanceRequests,
    expenses,
    loading,
    error,
    registerVehicle,
    deregisterVehicle,
    submitFuelRequest,
    updateFuelApproval,
    uploadReceipt,
    submitMaintenanceRequest,
    updateMaintenanceApproval,
    updateMaintenanceStatusText,
    submitExpense
  };
}
