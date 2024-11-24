import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'; // Import para redirecionamento
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/client/Loans.css';

const Loans = () => {
    const { user } = useAuth();
    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const isOffersSaved = useRef(false);
    const hasDeletedOffers = useRef(false);

    const navigate = useNavigate(); // Hook para navegação

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
            navigate('/offer-details', { state: { offer: selectedOffer } }); 
        } else {
            console.log('Nenhuma oferta selecionada!');
        }
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
        </div>
    );
};

export default Loans;
