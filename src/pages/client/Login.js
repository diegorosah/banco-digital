import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/client/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Use o contexto de autenticação

    const handleLogin = async () => {
        try {
            const success = await login(email, password);
    
            if (success) {
                navigate('/dashboard');
            } else {
                setErrorMessage('Erro ao fazer login. Verifique suas credenciais.'); // Mensagem de erro
            }
        } catch (error) {
            setErrorMessage('Erro ao conectar com o servidor.'); // Mensagem de erro ao conectar
            console.error("Erro no login:", error); // Log de erro
        }
    };
    

    const handleRegisterRedirect = () => {
        navigate('/register'); // Redireciona para a página de registro
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <InputText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Password placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="button-group">
                <Button label="Entrar" onClick={handleLogin} />
                <Button label="Registrar" className="p-button-secondary" onClick={handleRegisterRedirect} />
            </div>
        </div>
    );
};

export default Login;
