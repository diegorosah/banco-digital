import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import '../../assets/styles/client/OfferDetails.css';

const OfferDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [editableOffer, setEditableOffer] = useState(location.state?.offer || {});

  const handleSaveChanges = async () => {
    try {
      // Aqui você faria a requisição para salvar as alterações na oferta
      console.log('Alterações salvas:', editableOffer);

      // Redireciona para a página UserProfile após salvar
      navigate('/profile/edit', { state: { offer: editableOffer } });
    } catch (error) {
      console.error('Erro ao salvar alterações na oferta:', error);
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
      <Button label="Salvar Alterações" onClick={handleSaveChanges} />
      <Button label="Cancelar" className="button-cancelar" onClick={() => navigate(-1)} />
    </div>
  );
};

export default OfferDetails;
