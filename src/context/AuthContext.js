import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password) => {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            setUser(data.user); // Atualiza o estado do usuário com os dados retornados
            return true;
        }

        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null); // Limpa o usuário ao deslogar
    };

    const value = { isAuthenticated, user, login, logout }; // Adicione 'user' aqui

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
