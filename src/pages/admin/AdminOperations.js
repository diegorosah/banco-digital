//Admin Operations
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable'; 
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';
import axios from 'axios';
import './../../assets/styles/admin/AdminOperations.css';

const AdminOperations = () => {
    const [operations, setOperations] = useState([]);

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await axios.get('/api/admin/operations', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                setOperations(response.data);
            } catch (err) {
                console.error('Erro ao carregar operações', err);
            }
        };

        fetchOperations();
    }, []);

    return (
        <div className="operations-container">
            <h2>Operações</h2>
            <DataTable value={operations} paginator rows={10} header="Lista de Operações">
                <Column field="id" header="ID" />
                <Column field="type" header="Tipo" />
                <Column field="amount" header="Valor" />
                <Column field="date" header="Data" />
                <Column field="status" header="Status" />
                <Column body={(rowData) => (
                    <Button label="Ver Detalhes" onClick={() => alert(`Detalhes da operação ${rowData.id}`)} />
                )} />
            </DataTable>
        </div>
    );
};

export default AdminOperations;
