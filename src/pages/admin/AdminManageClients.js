//Admin Manage Clients
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import './../../assets/styles/admin/AdminManageClients.css';

const AdminManageClients = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('/api/admin/clients', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                setClients(response.data);
            } catch (err) {
                console.error('Erro ao carregar clientes', err);
            }
        };

        fetchClients();
    }, []);

    const handleEditClient = (client) => {
        // Implementar lógica para editar cliente
        alert(`Editar cliente ${client.id}`);
    };

    return (
        <div className="manage-clients-container">
            <h2>Gerenciar Clientes</h2>
            <DataTable value={clients} paginator rows={10} header="Lista de Clientes">
                <Column field="id" header="ID" />
                <Column field="name" header="Nome" />
                <Column field="email" header="Email" />
                <Column body={(rowData) => (
                    <Button label="Editar" onClick={() => handleEditClient(rowData)} />
                )} />
            </DataTable>
        </div>
    );
};

export default AdminManageClients;
