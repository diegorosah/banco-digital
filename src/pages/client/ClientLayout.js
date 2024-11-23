import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const ClientLayout = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="client-layout">
            <Sidebar /> {/* O Sidebar deve lidar com as rotas de navegação */}
            <main>
                <Outlet /> {/* Renderiza o conteúdo das rotas aninhadas */}
            </main>
        </div>
    );
};

export default ClientLayout;
