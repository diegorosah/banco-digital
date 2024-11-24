import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../assets/styles/client/UserProfile.css';

const UserProfile = () => {
    const [cepError, setCepError] = useState('');
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(location.state?.user || {
        name: '',
        email: '',
        phone: '',
        birthDate: null,
        gender: '',
        cpfCnpj: '',
        profession: '',
        address: {
            cep: '',
            endereco: '',
            numero: '',
            bairro: '',
            cidade: '',
            pais: '',
        },
    });
    const [loading, setLoading] = useState(false);

    const genderOptions = [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
        { label: 'Outro', value: 'other' },
    ];

    const professionOptions = [
        { label: 'Engenheiro', value: 'engineer' },
        { label: 'Médico', value: 'doctor' },
        { label: 'Professor', value: 'teacher' },
        { label: 'Advogado', value: 'lawyer' },
    ];

    const fetchAddressByCEP = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                const { bairro, localidade: cidade, uf, logradouro } = response.data;
                return {
                    bairro,
                    cidade,
                    uf,
                    pais: 'Brasil',
                    endereco: logradouro,
                };
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
        return null; // Retorna `null` se o CEP for inválido ou houver erro
    };

    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        setUserData((prev) => ({
            ...prev,
            address: { ...prev.address, cep },
        }));
        setCepError(''); // Limpar mensagem de erro ao alterar o valor

        if (cep.length === 8) {
            setLoading(true);
            const addressData = await fetchAddressByCEP(cep);
            setLoading(false);

            if (addressData) {
                setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, ...addressData },
                }));
            } else {
                setCepError('CEP inválido. Verifique o valor digitado.');
            }
        }
    };


    const handleInputChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field, value) => {
        setUserData((prev) => ({
            ...prev,
            address: { ...prev.address, [field]: value },
        }));
    };

    const handleSave = async () => {
        try {
            if (!user || !user.id) {
                console.error("User ID não encontrado.");
                return;
            }
            
            // Incluindo o user.id no userData antes de enviar
            const updatedUserData = {
                ...userData,
                userId: user.id // Adiciona o user.id no objeto
            };
    
            setLoading(true);
    
            const apiUrl = 'http://localhost:5000/api/user-profile';
            const method = userData.id ? 'put' : 'post';
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Inclua o token de autenticação
            };
    
            const response = await axios({
                method,
                url: userData.id ? `${apiUrl}/${userData.id}` : apiUrl,
                data: updatedUserData, // Usa o updatedUserData que contém o userId
                headers,
            });
    
            if (response.status === 200 || response.status === 201) {
                console.log('Dados salvos com sucesso:', response.data);
                navigate(-1); // Redireciona após salvar
            } else {
                console.error('Erro ao salvar os dados:', response.data);
            }
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
            alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
        } finally {
            setLoading(false); // Oculta o spinner após a tentativa
        }
    };

    return (
        <div className="user-profile-page">
            <h3>Dados Cadastrais</h3>
            <fieldset>
                <legend className="legend">Dados Pessoais</legend>
                <div className="user-form-grid">
                    <div className="form-field">
                        <label>CPF/CNPJ:</label>
                        <InputText
                            value={userData.cpfCnpj}
                            onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                            placeholder="CPF ou CNPJ"
                        />
                    </div>
                    <div className="form-field">
                        <label>Nome:</label>
                        <InputText
                            value={userData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nome Completo"
                        />
                    </div>
                    <div className="form-field">
                        <label>Data de Nascimento:</label>
                        <Calendar
                            value={userData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.value)}
                            placeholder="Selecione a Data"
                        />
                    </div>
                    <div className="form-field">
                        <label>Gênero:</label>
                        <Dropdown
                            value={userData.gender}
                            options={genderOptions}
                            onChange={(e) => handleInputChange('gender', e.value)}
                            placeholder="Selecione"
                        />
                    </div>
                    <div className="form-field">
                        <label>E-mail:</label>
                        <InputText
                            value={userData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="E-mail"
                        />
                    </div>
                    <div className="form-field">
                        <label>Telefone:</label>
                        <InputText
                            value={userData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Telefone"
                        />
                    </div>
                    <div className="form-field">
                        <label>Profissão:</label>
                        <Dropdown
                            value={userData.profession}
                            options={professionOptions}
                            onChange={(e) => handleInputChange('profession', e.value)}
                            placeholder="Selecione sua profissão"
                        />
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend className="legend">Endereço</legend>
                <div className="user-form-grid">
                    <div className="form-field">
                        <label>CEP:</label>
                        <InputText
                            value={userData.address.cep}
                            onChange={handleCepChange}
                            placeholder="Digite o CEP"
                            className={cepError ? 'p-invalid' : ''} // Adiciona uma classe para estilo de erro
                        />
                        {cepError && <small className="p-error">{cepError}</small>}
                    </div>
                    <div className="form-field">
                        <label>Endereço:</label>
                        <InputText
                            value={userData.address.endereco}
                            onChange={(e) => handleAddressChange('endereco', e.target.value)}
                            placeholder="Endereço"
                        />
                    </div>
                    <div className="form-field">
                        <label>Número:</label>
                        <InputText
                            value={userData.address.numero}
                            onChange={(e) => handleAddressChange('numero', e.target.value)}
                            placeholder="Número"
                        />
                    </div>
                    <div className="form-field">
                        <label>Bairro:</label>
                        <InputText
                            value={userData.address.bairro}
                            onChange={(e) => handleAddressChange('bairro', e.target.value)}
                            placeholder="Bairro"
                        />
                    </div>
                    <div className="form-field">
                        <label>Cidade:</label>
                        <InputText
                            value={userData.address.cidade}
                            onChange={(e) => handleAddressChange('cidade', e.target.value)}
                            placeholder="Cidade"
                        />
                    </div>
                    <div className="form-field">
                        <label>Estado:</label>
                        <InputText
                            value={userData.address.uf}
                            onChange={(e) => handleAddressChange('uf', e.target.value)}
                            placeholder="Estado"
                        />
                    </div>
                    <div className="form-field">
                        <label>País:</label>
                        <InputText
                            value={userData.address.pais}
                            onChange={(e) => handleAddressChange('pais', e.target.value)}
                            placeholder="País"
                        />
                    </div>
                </div>
            </fieldset>
            <div className="form-field">
                <Button label="Salvar" onClick={handleSave} disabled={loading}>
                    {loading && <i className="pi pi-spin pi-spinner"></i>}
                </Button>
                <Button label="Cancelar" className="button-cancelar" onClick={() => navigate(-1)} />
            </div>
        </div>
    );
};

export default UserProfile;