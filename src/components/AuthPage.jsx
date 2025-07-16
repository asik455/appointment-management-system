import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignUp = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('All fields required');
    localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email }));
    onAuthSuccess({ name: form.name, email: form.email });
  };

  const handleSignIn = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== form.email || form.password === '') {
      setError('Invalid credentials');
      return;
    }
    onAuthSuccess(user);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={tab === 'signin' ? 'active' : ''} onClick={() => { setTab('signin'); setError(''); }}>Sign In</button>
          <button className={tab === 'signup' ? 'active' : ''} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>
        {tab === 'signup' ? (
          <form className="auth-form" onSubmit={handleSignUp}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignIn}>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 