import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../assets/styles/client/Dashboard.css'

// Registrar os elementos necessários
Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar transações');
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const calculateData = () => {
        const amounts = { entrada: 0, saída: 0 };

        transactions.forEach(transaction => {
            amounts[transaction.type] += transaction.amount;
        });

        return {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                data: [amounts.entrada, amounts.saída],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        };
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Resumo da Conta</h2>
            <Pie data={calculateData()} />
        </div>
    );
};

export default Dashboard;
