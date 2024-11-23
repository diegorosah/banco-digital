import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../../assets/styles/client/Profile.css'

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleUpdate = () => {
        // Lógica de atualização
    };

    return (
        <div className="profile">
            <h2>Atualizar Informações</h2>
            <InputText placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <InputText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button label="Atualizar" onClick={handleUpdate} />
        </div>
    );
};

export default Profile;
