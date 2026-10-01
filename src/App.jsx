import React, { useState } from 'react';
import Login from './components/Login';
import { useFleetApi } from './api/fleetApi';

export default function App() {
  const [user, setUser] = useState(null);
  const { 
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
  } = useFleetApi();

  // Fleet Form states
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [model, setModel] = useState('');
  const [odometer, setOdometer] = useState('');

  // Fuel request form states
  const [fuelPlate, setFuelPlate] = useState('');
  const [liters, setLiters] = useState('');
  const [estCost, setEstCost] = useState('');
  const [receiptNote, setReceiptNote] = useState('');

  // Maintenance form states
  const [maintPlate, setMaintPlate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [customService, setCustomService] = useState('');
  const [maintCost, setMaintCost] = useState('');

  // Expense form states
  const [expPlate, setExpPlate] = useState('');
  const [expCategory, setExpCategory] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerVehicle({ plateNumber, driverName, driverPhone, model, odometer });
    setPlateNumber(''); setDriverName(''); setDriverPhone(''); setModel(''); setOdometer('');
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    await submitFuelRequest({
      vehiclePlate: fuelPlate || (fleet[0]?.plateNumber ?? 'KDA 000A'),
      liters,
      estimatedCost: estCost,
      engineerEmail: user.email
    });
    setLiters(''); setEstCost('');
    alert('Fuel request submitted successfully!');
  };

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    const finalServiceType = selectedService === 'Other' ? customService : selectedService;
    if (!finalServiceType) {
      alert('Please specify the service type.');
      return;
    }

    await submitMaintenanceRequest({
      vehiclePlate: maintPlate || (fleet[0]?.plateNumber ?? 'KDA 000A'),
      serviceType: finalServiceType,
      estimatedCost: maintCost,
      engineerEmail: user.email
    });
    setSelectedService(''); setCustomService(''); setMaintCost('');
    alert('Maintenance request submitted successfully!');
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    await submitExpense({
      vehiclePlate: expPlate || (fleet[0]?.plateNumber ?? 'KDA 000A'),
      category: expCategory,
      amount: expAmount,
      description: expDesc,
      engineerEmail: user.email
    });
    setExpCategory(''); setExpAmount(''); setExpDesc('');
    alert('Miscellaneous field expense logged successfully!');
  };

  // Calculations for Expense Hub Summary
  const totalFuelCost = fuelRequests.reduce((acc, curr) => acc + (Number(curr.estimatedCost) || 0), 0);
  const totalMaintCost = maintenanceRequests.reduce((acc, curr) => acc + (Number(curr.estimatedCost) || 0), 0);
  const totalMiscCost = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const overallSpend = totalFuelCost + totalMaintCost + totalMiscCost;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b14', color: '#f8fafc', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Header */}
        <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Fleet & Field Operations Portal</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Active User: <strong style={{ color: '#fff' }}>{user.email}</strong> ({user.role === 'Manager' ? 'Fleet Manager & Approver' : 'Field Engineer'})
            </p>
          </div>
          <button
            onClick={() => setUser(null)}
            style={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            Logout
          </button>
        </header>

        {error && (
          <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #991b1b', color: '#fecaca', padding: '15px', borderRadius: '8px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* EXPENSE HUB SUMMARY BANNER (Visible to Everyone) */}
        <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#38bdf8' }}>📊 Real-Time Operational Expense Hub</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Total Fuel Spend</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '5px 0 0 0' }}>KES {totalFuelCost.toLocaleString()}</p>
            </div>
            <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Total Maintenance Spend</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '5px 0 0 0' }}>KES {totalMaintCost.toLocaleString()}</p>
            </div>
            <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Misc / Field Expenses</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '5px 0 0 0' }}>KES {totalMiscCost.toLocaleString()}</p>
            </div>
            <div style={{ backgroundColor: '#172554', padding: '12px', borderRadius: '8px', border: '1px solid #1d4ed8' }}>
              <p style={{ fontSize: '12px', color: '#93c5fd', margin: 0 }}>Combined Monthly Outlay</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '5px 0 0 0' }}>KES {overallSpend.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ROLE 1: MANAGER / APPROVER VIEW */}
        {user.role === 'Manager' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Inventory Management */}
            <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px 0' }}>Register Fleet Vehicle</h2>
              <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
                <input type="text" required placeholder="Plate Number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <input type="text" required placeholder="Driver Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <input type="text" placeholder="Driver Phone" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <input type="text" required placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <input type="number" required placeholder="Odometer (km)" value={odometer} onChange={(e) => setOdometer(e.target.value)} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Add Vehicle</button>
              </form>
            </div>

            {/* Fuel Approvals Hub */}
            <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Multi-Tier Fuel Requests Approval Queue</h2>
              {fuelRequests.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No active fuel requests pending review.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {fuelRequests.map((req) => (
                    <div key={req.id} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#fff' }}>Vehicle: {req.vehiclePlate} ({req.liters} Liters / KES {req.estimatedCost})</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>Requested by: {req.engineerEmail}</p>
                        <p style={{ fontSize: '11px', color: '#38bdf8', margin: 0 }}>Status: <strong>{req.status}</strong> {req.receiptUrl && `| Receipt: ${req.receiptUrl}`}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => updateFuelApproval(req.id, 'fleetManager', req.approvals)}
                          style={{ backgroundColor: req.approvals.fleetManager ? '#065f46' : '#1e293b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Fleet Mgr: {req.approvals.fleetManager ? 'Approved ✓' : 'Pending'}
                        </button>
                        <button 
                          onClick={() => updateFuelApproval(req.id, 'regionalManager', req.approvals)}
                          style={{ backgroundColor: req.approvals.regionalManager ? '#065f46' : '#1e293b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Regional Mgr: {req.approvals.regionalManager ? 'Approved ✓' : 'Pending'}
                        </button>
                        <button 
                          onClick={() => updateFuelApproval(req.id, 'regionLead', req.approvals)}
                          style={{ backgroundColor: req.approvals.regionLead ? '#065f46' : '#1e293b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Region Lead: {req.approvals.regionLead ? 'Approved ✓' : 'Pending'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Maintenance Approval Queue */}
            <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Vehicle Service & Maintenance Approvals</h2>
              {maintenanceRequests.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No maintenance requests pending review.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {maintenanceRequests.map((m) => (
                    <div key={m.id} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#fff' }}>Vehicle: {m.vehiclePlate} - {m.serviceType} (KES {m.estimatedCost})</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>Engineer: {m.engineerEmail}</p>
                        <p style={{ fontSize: '11px', color: '#38bdf8', margin: 0 }}>Status: <strong>{m.status}</strong></p>
                      </div>
                      <button
                        onClick={() => updateMaintenanceApproval(m.id, m.approved)}
                        style={{ backgroundColor: m.approved ? '#065f46' : '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {m.approved ? 'Approved ✓ (Click to Revoke)' : 'Approve Maintenance'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fleet List */}
            <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Active Fleet Inventory ({fleet.length})</h2>
              {fleet.map((v) => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
                  <span><strong>{v.plateNumber}</strong> - {v.model} ({v.driverName})</span>
                  <button onClick={() => deregisterVehicle(v.id)} style={{ backgroundColor: '#7f1d1d', color: '#fecaca', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Deregister</button>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* ROLE 2: FIELD ENGINEER VIEW */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Left Column: Fuel, Maintenance, & Expense Form Submissions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Fuel Request Form */}
              <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Request Fuel Allocation</h2>
                <form onSubmit={handleFuelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Vehicle Plate</label>
                    <select 
                      value={fuelPlate} 
                      onChange={(e) => setFuelPlate(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                    >
                      <option value="">Choose vehicle...</option>
                      {fleet.map(v => <option key={v.id} value={v.plateNumber}>{v.plateNumber} - {v.model}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Liters Needed</label>
                    <input type="number" required placeholder="e.g. 50" value={liters} onChange={(e) => setLiters(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Estimated Cost (KES)</label>
                    <input type="number" required placeholder="e.g. 9500" value={estCost} onChange={(e) => setEstCost(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>Submit Fuel Request</button>
                </form>
              </div>

              {/* Maintenance Request Form */}
              <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Request Car Service & Maintenance</h2>
                <form onSubmit={handleMaintenanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Vehicle Plate</label>
                    <select 
                      value={maintPlate} 
                      onChange={(e) => setMaintPlate(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                    >
                      <option value="">Choose vehicle...</option>
                      {fleet.map(v => <option key={v.id} value={v.plateNumber}>{v.plateNumber} - {v.model}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Service Type / Issue</label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      required
                      style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                    >
                      <option value="">Select standard service...</option>
                      <option value="Routine 5,000km Servicing">Routine 5,000km Servicing</option>
                      <option value="Routine 10,000km Major Servicing">Routine 10,000km Major Servicing</option>
                      <option value="Brake Pad Replacement & Inspection">Brake Pad Replacement & Inspection</option>
                      <option value="Tire Replacement & Balancing">Tire Replacement & Balancing</option>
                      <option value="Wheel Alignment & Suspension Check">Wheel Alignment & Suspension Check</option>
                      <option value="Battery Replacement & Electrical Diagnostic">Battery Replacement & Electrical Diagnostic</option>
                      <option value="Coolant & Transmission Fluid Flush">Coolant & Transmission Fluid Flush</option>
                      <option value="Windshield Repair / Replacement">Windshield Repair / Replacement</option>
                      <option value="Other">Other (Custom Service)</option>
                    </select>
                  </div>

                  {selectedService === 'Other' && (
                    <div>
                      <label style={{ fontSize: '12px', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Specify Custom Service</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Alternator repair or body dent fixing" 
                        value={customService} 
                        onChange={(e) => setCustomService(e.target.value)} 
                        style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #38bdf8', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} 
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Estimated Cost (KES)</label>
                    <input type="number" required placeholder="e.g. 15000" value={maintCost} onChange={(e) => setMaintCost(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>Submit Maintenance Request</button>
                </form>
              </div>

              {/* Miscellaneous Field Expense Form */}
              <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Log Field Expense (Tolls, Parking, etc.)</h2>
                <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Vehicle Plate</label>
                    <select 
                      value={expPlate} 
                      onChange={(e) => setExpPlate(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                    >
                      <option value="">Choose vehicle...</option>
                      {fleet.map(v => <option key={v.id} value={v.plateNumber}>{v.plateNumber} - {v.model}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Category</label>
                    <select 
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                      required
                      style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                    >
                      <option value="">Select category...</option>
                      <option value="Tolls & Parking">Tolls & Parking</option>
                      <option value="Emergency Site Supplies">Emergency Site Supplies</option>
                      <option value="Accommodation / Meals">Accommodation / Meals</option>
                      <option value="Miscellaneous Field Cost">Miscellaneous Field Cost</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount (KES)</label>
                    <input type="number" required placeholder="e.g. 1200" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description / Note</label>
                    <input type="text" placeholder="e.g. Expressway toll fee" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>Log Expense</button>
                </form>
              </div>

            </div>

            {/* Right Column: Tracking & Status Updates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Fuel Requests & Receipts */}
              <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>My Fuel Requests & Receipts</h2>
                {fuelRequests.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No active fuel requests found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                    {fuelRequests.map((req) => (
                      <div key={req.id} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                        <p style={{ fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>{req.vehiclePlate} - {req.liters}L (KES {req.estimatedCost})</p>
                        <p style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>Status: {req.status}</p>
                        
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            placeholder="Receipt note / URL" 
                            onChange={(e) => setReceiptNote(e.target.value)}
                            style={{ flex: 1, backgroundColor: '#0c101d', border: '1px solid #334155', borderRadius: '6px', padding: '6px', color: '#fff', fontSize: '11px' }}
                          />
                          <button 
                            onClick={() => uploadReceipt(req.id, receiptNote || 'Receipt Attached')}
                            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Maintenance Status Tracking */}
              <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Maintenance Tracking & Status Updates</h2>
                {maintenanceRequests.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No active maintenance tickets found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                    {maintenanceRequests.map((m) => (
                      <div key={m.id} style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                        <p style={{ fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>{m.vehiclePlate} - {m.serviceType} (KES {m.estimatedCost})</p>
                        <p style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>Current Status: <strong>{m.status}</strong></p>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => updateMaintenanceStatusText(m.id, 'In Garage / Servicing In Progress')}
                            style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}
                          >
                            Mark In Progress
                          </button>
                          <button 
                            onClick={() => updateMaintenanceStatusText(m.id, 'Completed & Roadworthy')}
                            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}
                          >
                            Mark Completed
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}