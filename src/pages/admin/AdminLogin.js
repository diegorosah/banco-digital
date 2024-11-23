import React, { useState } from 'react';
import { Button, InputText, Password } from 'primereact';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './../../assets/styles/admin/AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/admin/login', { email, password, mfaCode });
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Login falhou');
        }
    };

    return (
        <div className="login-container">
            <h2>Login Admin</h2>
            {error && <div className="error">{error}</div>}
            <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="p-field">
                <label htmlFor="password">Senha</label>
                <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="p-field">
                <label htmlFor="mfaCode">Código MFA</label>
                <InputText id="mfaCode" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
            </div>
            <Button label="Entrar" onClick={handleLogin} />
        </div>
    );
};

export default AdminLogin;
