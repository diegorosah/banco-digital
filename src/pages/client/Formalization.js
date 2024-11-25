import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/client/Formalization.css';

const Formalization = () => {
    const sigCanvas = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [proposal] = useState(location.state?.proposal || {});
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controlar o modal

    const proposalNumber = proposal?._id || null;

    useEffect(() => {
        if (!proposalNumber) {
            console.error("Número da proposta não encontrado.");
            alert("Número da proposta inválido. Você será redirecionado.");
            navigate('/error');
        }
    }, [proposalNumber, navigate]);

    useEffect(() => {
        const onScroll = () =>
            window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
    };

    const saveSignature = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            if (sigCanvas.current?.isEmpty()) {
                alert("Por favor, desenhe sua assinatura antes de continuar.");
                setIsSaving(false);
                return;
            }

            const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
            const response = await axios.post(
                'http://localhost:5000/api/signatures',
                { proposalNumber, signatureData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                }
            );

            if (response.status === 201) {
                setShowModal(true); // Exibe o modal ao salvar com sucesso
            } else {
                alert("Erro ao salvar a assinatura. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao salvar a assinatura:", error);
            alert("Houve um erro ao salvar sua assinatura. Por favor, tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false); // Fecha o modal
        navigate('/dashboard'); // Redireciona para o Dashboard
    };

    return (
        <div className="formalization-container">
            <h3>Formalização</h3>
            <p>Por favor, desenhe sua assinatura para formalizar a proposta.</p>
            <p><strong>Número da Proposta:</strong> {proposalNumber || 'N/A'}</p>

            <div className="signature-canvas">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        className: 'signature-canvas-element',
                        width: 500,
                        height: 200,
                    }}
                />
            </div>

            <div className="formalization-actions">
                <button className="btn-clear" onClick={clearSignature}>
                    Limpar
                </button>
                <button className="btn-save" onClick={saveSignature} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Assinatura'}
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Empréstimo contratado com sucesso!</h2>
                        <button onClick={handleModalClose} className="btn-ok">
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Formalization;
