import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Engineer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onLogin({ email, role });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#0c101d', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#3b82f6', fontWeight: '700', margin: 0 }}>Operations Portal</p>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '8px 0 0 0' }}>Fleet & Field Authentication</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Work Email / Identifier</label>
            <input
              type="email"
              required
              placeholder="e.g. samwel@innovis.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Select Responsibility Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            >
              <option value="Engineer">Field Engineer (Request Fuel & Maintenance)</option>
              <option value="Manager">Fleet Manager / Approver (Inventory & Approvals)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}
          >
            Access Dashboard
          </button>
        </form>

      </div>
    </div>
  );
}