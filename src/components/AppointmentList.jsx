import React from 'react';

const AppointmentList = ({ appointments, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Date & Time</th>
          <th>Reason</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt) => (
          <tr key={appt.id}>
            <td>{appt.name}</td>
            <td>{new Date(appt.datetime).toLocaleString()}</td>
            <td>{appt.reason}</td>
            <td className="actions">
              <button onClick={() => onEdit(appt)}>✏️</button>
              <button onClick={() => onDelete(appt.id)}>❌</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentList; 