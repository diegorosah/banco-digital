import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useAuth } from '../../context/AuthContext';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import '../../assets/styles/client/OfferDetails.css';

const OfferDetails = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editableOffer, setEditableOffer] = useState(location.state?.offer || {});

  // Salvar alterações na oferta existente
  const handleSaveChanges = async () => {
    try {
      // Faz a requisição para salvar as alterações da oferta
      const saveOfferResponse = await axios.put(`/api/offers/${editableOffer._id}`, editableOffer, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });

      if (saveOfferResponse.status === 200) {
        console.log('Oferta atualizada com sucesso:', saveOfferResponse.data);

        // Salvar a proposta na tabela de propostas com status "simulação"
        await saveProposal(saveOfferResponse.data);
      }
    } catch (error) {
      console.error('Erro ao salvar alterações na oferta:', error);
      alert('Houve um problema ao salvar as alterações. Por favor, tente novamente.');
    }
  };

  // Salvar a proposta na tabela de propostas
  const saveProposal = async (updatedOffer) => {
    try {
      const newProposal = {
        userId: user.id,
        offerId: editableOffer._id,
        status: 'Simulação',
        valorLiberado: updatedOffer.valorLiberado,
        parcelas: updatedOffer.parcelas,
        valorParcela: updatedOffer.valorParcela,
        createdAt: new Date().toISOString(),
      };

      const saveProposalResponse = await axios.post('/api/proposals', newProposal, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });

      if (saveProposalResponse.status === 201) {
        console.log('Proposta salva com sucesso:', saveProposalResponse.data);
        alert('Alterações salvas e proposta criada com sucesso!');
        navigate('/profile/edit', { state: { offer: editableOffer, proposal: saveProposalResponse.data} });
      } else {
        throw new Error('Erro ao criar a proposta.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Erro ao salvar a proposta:', error.response.data);
        alert(`Erro ao salvar a proposta: ${error.response.data.message || 'Houve um problema ao salvar a proposta.'}`);
      } else {
        console.error('Erro ao salvar a proposta:', error.message);
        alert('Houve um problema ao salvar a proposta. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="offer-details-page">
      <h3>Detalhes da Oferta</h3>
      <div className="dados-proposta">
        <label>Valor liberado:</label>
        <InputNumber
          value={editableOffer.valorLiberado}
          onValueChange={(e) => setEditableOffer({ ...editableOffer, valorLiberado: e.value })}
          placeholder="Valor Liberado"
        />
        <br />
        <label>Parcelas:</label>
        <InputNumber
          value={editableOffer.parcelas}
          onValueChange={(e) => setEditableOffer({ ...editableOffer, parcelas: e.value })}
          placeholder="Parcelas"
        />
        <br />
        <label>Valor Parcela:</label>
        <InputNumber
          value={editableOffer.valorParcela}
          onValueChange={(e) => setEditableOffer({ ...editableOffer, valorParcela: e.value })}
          placeholder="Valor da Parcela"
        />
      </div>
      <div className="buttons-container">
        <Button label="Salvar Alterações" onClick={handleSaveChanges} />
        <Button label="Cancelar" className="button-cancelar" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default OfferDetails;
