import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../assets/styles/client/Statement.css'

const Statement = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar transações');
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="statement">
            <h2>Extrato</h2>
            <DataTable value={transactions} paginator rows={10}>
                <Column field="date" header="Data" body={rowData => new Date(rowData.date).toLocaleDateString()} />
                <Column field="amount" header="Valor" />
                <Column field="type" header="Tipo" />
                <Column field="description" header="Descrição" />
            </DataTable>
        </div>
    );
};

export default Statement;
