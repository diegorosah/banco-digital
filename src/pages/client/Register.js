import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/client/Register.css'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            navigate('/login');
        } else {
            console.error('Erro ao registrar o usuário');
        }
    };

    return (
        <div className="register-container">
            <h2>Registrar</h2>
            <InputText placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <InputText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Password placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button label="Registrar" onClick={handleRegister} />
        </div>
    );
};

export default Register;
