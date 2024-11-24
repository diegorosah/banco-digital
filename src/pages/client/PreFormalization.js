import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import '../../assets/styles/client/PreFormalization.css';

const PreFormalization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateData = async () => {
      try {
        // Valida se a oferta foi passada corretamente
        const offerData = location.state?.offer;
        if (!offerData) {
          console.error("Oferta inválida.");
          navigate('/error'); // Redireciona em caso de oferta inválida
          return;
        }
        setOffer(offerData);

        // Valida e busca os dados do cliente
        const userId = location.state?.userId;
        if (!userId) {
          console.error("Cliente inválido.");
          navigate('/error'); // Redireciona em caso de cliente inválido
          return;
        }

        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        };

        const response = await axios.get(`/api/user-profile/${userId}`, { headers });
        if (!response.data) {
          console.error("Cliente não encontrado.");
          navigate('/error'); // Redireciona em caso de cliente não encontrado
          return;
        }

        setClient(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        navigate('/error'); // Redireciona em caso de erro na requisição
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    validateData();
  }, [location, navigate]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!offer || !client) {
    return <div className="error-message">Dados não encontrados. Por favor, tente novamente.</div>;
  }

  const handleBack = () => {
    navigate(-1); // Retorna para a página anterior
  };

  const handleConfirm = () => {
    const userConfirmed = window.confirm(
      "Você confirma que os dados estão corretos e deseja continuar com a formalização?"
    );

    if (userConfirmed) {
      console.log("Navigating with offerId:", offer.id);
      navigate('/formalization', { state: { offerId: offer.id } });


    } else {
      console.log('Formalização cancelada pelo usuário.');
    }
  };

  return (
    <div className="pre-formalization-container">
      <h3>Pré-Formalização</h3>

      <div className="validation-message">
        <p>
          Por favor, confirme que os dados apresentados estão corretos antes de prosseguir.
        </p>
      </div>

      {/* Exibindo os dados da oferta */}
      <div className="dados-oferta-container">
        <fieldset>
          <legend className="legend">Dados da Oferta</legend>
          <p><strong>Valor Liberado:</strong> R$ {offer.valorLiberado.toLocaleString('pt-BR')}</p>
          <p><strong>Parcelas:</strong> {offer.parcelas}</p>
          <p><strong>Valor da Parcela:</strong> R$ {offer.valorParcela.toLocaleString('pt-BR')}</p>
        </fieldset>
      </div>

      {/* Exibindo os dados do cliente */}
      <div className="dados-cliente-container">
        <fieldset>
          <legend className="legend">Dados do Cliente</legend>
          <p><strong>Nome:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>CPF:</strong> {client.cpfCnpj}</p>
        </fieldset>
      </div>

      {/* Botões de Ação */}
      <div className="action-buttons">
        <Button label="Voltar" className="p-button-secondary" onClick={handleBack} />
        <Button label="Confirmar" className="p-button-success" onClick={handleConfirm} />
      </div>
    </div>
  );
};

export default PreFormalization;
