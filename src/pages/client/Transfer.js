import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '../../assets/styles/client/Transfer.css'

const Transfer = () => {
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('entrada');

    const handleTransfer = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount), // Convertendo para número
                    type: transactionType,
                    description: 'Transferência realizada' // Você pode personalizar isso
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao realizar a transferência');
            }

            const data = await response.json();
            console.log('Transação criada:', data);
            // Resetar os campos após a transferência
            setAmount('');
            setTransactionType('entrada');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="transfer">
            <h2>Transferir Pix</h2>
            <InputText
                placeholder="Valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
            />
            <Dropdown
                value={transactionType}
                onChange={(e) => setTransactionType(e.value)}
                options={[
                    { label: 'Entrada', value: 'entrada' },
                    { label: 'Saída', value: 'saída' }
                ]}
                placeholder="Selecione o tipo"
            />
            <Button label="Enviar" onClick={handleTransfer} />
        </div>
    );
};

export default Transfer;
