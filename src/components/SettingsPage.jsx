import React from 'react';
import './SettingsPage.css';

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const SettingsPage = ({ user, onLogout, onBack }) => (
  <div className="settings-bg">
    <div className="settings-card">
      <h2>Settings</h2>
      <div className="settings-avatar">{getInitials(user?.name)}</div>
      <div className="settings-info">
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>
      </div>
      <div className="settings-actions">
        <button className="settings-logout-btn" onClick={onLogout}>Logout</button>
        <button className="settings-back-btn" onClick={onBack}>Back</button>
      </div>
    </div>
  </div>
);

export default SettingsPage; 