import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/client/Loans.css';

const Loans = () => {
    const { user } = useAuth();
    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const isOffersSaved = useRef(false);
    const [proposalSaved, setProposalSaved] = useState(null);
    const [showOfferDetails, setShowOfferDetails] = useState(false); // Novo estado para exibir o container de componentes
    const [editableOffer, setEditableOffer] = useState(null);
    const hasDeletedOffers = useRef(false);

    const deleteExistingOffers = useCallback(async () => {
        if (!user || !user.id || hasDeletedOffers.current) return;

        try {
            console.log('Tentando deletar ofertas associadas ao usuário com ID:', user.id);
            await axios.delete(`http://localhost:5000/api/offers/${user.id}`);
            console.log(`Todas as ofertas do usuário com ID ${user.id} foram deletadas com sucesso.`);
            hasDeletedOffers.current = true;
        } catch (error) {
            console.error('Erro ao deletar ofertas:', error.response?.data || error.message);
        }
    }, [user]);

    const generateOffers = () => {
        const newOffers = Array.from({ length: 3 }, () => {
            const valorLiberado = Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
            const parcelas = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
            const valorParcela = (valorLiberado / parcelas).toFixed(2);
            return { valorLiberado, parcelas, valorParcela };
        });

        setOffers(newOffers);
        setSelectedOffer(newOffers[0]);
    };

    const saveOffers = useCallback(async () => {
        if (!user || !user.id || isOffersSaved.current) return;

        try {
            const savedOffers = await Promise.all(
                offers.map(async offer => {
                    const response = await axios.post(`/api/offers`, { ...offer, clienteId: user.id });
                    return response.data;
                })
            );

            console.log('Novas ofertas salvas com sucesso.', savedOffers);
            setOffers(savedOffers);
            isOffersSaved.current = true;
        } catch (error) {
            console.error('Erro ao salvar ofertas:', error);
        }
    }, [offers, user]);

    useEffect(() => {
        const handlePageLoad = async () => {
            if (user && user.id && !isInitialized) {
                setIsInitialized(true);
                await deleteExistingOffers();
                generateOffers();
            }
        };

        if (!isInitialized) {
            handlePageLoad();
        }

        return () => {
            isOffersSaved.current = false;
        };
    }, [deleteExistingOffers, user, isInitialized]);

    useEffect(() => {
        if (offers.length > 0 && !isOffersSaved.current) {
            saveOffers();
        }
    }, [offers, saveOffers]);

    const handleNext = () => {
        if (selectedOffer) {
            saveProposal(selectedOffer, user);
            setEditableOffer(selectedOffer);
            setShowOfferDetails(true); // Exibe o container de componentes ao invés do modal
        } else {
            console.log('Nenhuma oferta selecionada!');
        }
    };

    const saveProposal = async (offer, user) => {
        try {
            if (!offer._id) {
                throw new Error('ID da oferta está faltando');
            }
            const payload = { offerId: offer._id, userId: user.id };
            console.log('Dados enviados para a proposta:', payload);
            const response = await axios.post('http://localhost:5000/api/proposals', payload);
            setProposalSaved(response.data);
            console.log('Proposta salva com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao salvar proposta:', error.response ? error.response.data : error.message);
        }
    };

    const handleExit = async () => {
        if (proposalSaved) {
            console.log('Tentando excluir proposta com ID:', proposalSaved._id);
            try {
                await axios.delete(`http://localhost:5000/api/proposals/${proposalSaved._id}`);
                console.log('Proposta excluída com sucesso.');
            } catch (error) {
                console.error('Erro ao excluir proposta:', error);
            }
        }
        setShowOfferDetails(false); // Fecha o container de componentes
    };

    const handleSaveChanges = async () => {
        if (editableOffer) {
            try {
                const response = await axios.put(
                    `http://localhost:5000/api/offers/${editableOffer._id}`,
                    editableOffer
                );
                console.log('Alterações salvas na oferta:', response.data);
                setOffers(prevOffers =>
                    prevOffers.map(offer =>
                        offer._id === editableOffer._id ? response.data : offer
                    )
                );
            } catch (error) {
                console.error('Erro ao salvar alterações na oferta:', error);
            }
        }
        setShowOfferDetails(false); // Fecha o container de componentes
    };

    return (
        <div className="loans-page">
            <h2>Ofertas Disponíveis</h2>
            <div className="carousel">
                {offers.map((offer, index) => (
                    <Card
                        key={index}
                        onClick={() => setSelectedOffer(offer)}
                        className={selectedOffer === offer ? 'selected' : ''}
                    >
                        <h3>Valor Liberado: R$ {offer.valorLiberado}</h3>
                        <p>Parcelas: {offer.parcelas}</p>
                        <p>Valor da Parcela: R$ {offer.valorParcela}</p>
                    </Card>
                ))}
            </div>
            <Button
                label="Avançar"
                className="button-avancar"
                onClick={handleNext}
                disabled={!selectedOffer}
            />

            {/* Overlay */}
            <div className={`overlay ${showOfferDetails ? 'show' : ''}`} onClick={handleExit}></div>

            {/* Novo container de componentes */}
            <div className={`offer-details-container ${showOfferDetails ? 'show' : ''}`}>
                <h3>Detalhes da Oferta</h3>
                <div className='dados-proposta'>
                    <br></br>
                    <label>Valor liberado:</label>
                    <InputNumber
                        className='input-dados-proposta'
                        value={editableOffer?.valorLiberado}
                        onValueChange={e => setEditableOffer({ ...editableOffer, valorLiberado: e.value })}
                        placeholder="Valor Liberado"
                    />
                    <br></br>
                    <label>Parcelas:</label>
                    <InputNumber
                        className='input-dados-proposta'
                        value={editableOffer?.parcelas}
                        onValueChange={e => setEditableOffer({ ...editableOffer, parcelas: e.value })}
                        placeholder="Parcelas"
                    />
                    <br></br>
                    <label>Valor Parcela:</label>
                    <InputNumber
                        className='input-dados-proposta'
                        value={editableOffer?.valorParcela}
                        onValueChange={e => setEditableOffer({ ...editableOffer, valorParcela: e.value })}
                        placeholder="Valor da Parcela"
                    />
                </div>
                <div className='buttons'>
                    <Button label="Salvar Alterações" onClick={handleSaveChanges} />

                    {/* Botão Sair */}
                    <Button label="Sair" className="button-sair" onClick={handleExit} />
                </div>
            </div>
        </div>
    );
};

export default Loans;
