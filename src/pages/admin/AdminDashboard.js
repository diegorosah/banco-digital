//Admin Dashboard
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';
import './../../assets/styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                setDashboardData(response.data);
            } catch (err) {
                console.error('Erro ao carregar dados do dashboard', err);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Dashboard Admin</h2>
            <div className="card-container">
                <Card title="Resumo Geral">
                    <p><strong>Total de Clientes:</strong> {dashboardData.totalClients}</p>
                    <p><strong>Total de Operações:</strong> {dashboardData.totalOperations}</p>
                    <p><strong>Saldo Total:</strong> {dashboardData.totalBalance}</p>
                </Card>
                <Card title="Clientes Recentes">
                    {dashboardData.recentClients?.map(client => (
                        <div key={client.id}>
                            <p><strong>Nome:</strong> {client.name}</p>
                            <p><strong>Email:</strong> {client.email}</p>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
