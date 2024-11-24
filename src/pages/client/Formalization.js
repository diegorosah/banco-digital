import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/client/Formalization.css';

const Formalization = () => {
    const sigCanvas = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    // Extraindo a oferta do estado e pegando o número da proposta
    const offer = location.state?.offer;
    const proposalNumber = location.state?.offerId || '';
    console.log("Proposta ID:", proposalNumber);


    console.log('Proposta ID:', proposalNumber);

    // Verificar se o número da proposta é válido ao montar o componente
    useEffect(() => {

        if (!proposalNumber) {
            console.error("Número da proposta não encontrado.");
            alert("Número da proposta inválido. Você será redirecionado.");
            navigate('/error'); // Redireciona para uma página de erro ou página inicial
        }
    }, [proposalNumber, navigate]);

    const onScroll = () => { /* lógica aqui */ };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', onScroll);
    };

    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear(); // Limpa o canvas
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
                '/api/signatures',
                { proposalNumber, signatureData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Assinatura salva com sucesso!");
                navigate('/confirmation');
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


    return (
        <div className="formalization-container">
            <h3>Formalização</h3>
            <p>Por favor, desenhe sua assinatura para formalizar a proposta.</p>
            <p><strong>Número da Proposta:</strong> {proposalNumber}</p>

            {/* Canvas de assinatura */}
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

            {/* Botões de Ação */}
            <div className="formalization-actions">
                <button className="btn-clear" onClick={clearSignature}>
                    Limpar
                </button>
                <button className="btn-save" onClick={saveSignature} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Assinatura'}
                </button>

            </div>
        </div>
    );
};

export default Formalization;