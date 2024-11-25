import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import '../../assets/styles/client/Investments.css';
import 'chartjs-adapter-date-fns'; // Importar o adaptador de data

const Investments = () => {
    const [stockData, setStockData] = useState([]); // Dados de ações para o gráfico
    const [chartData, setChartData] = useState(null); // Dados do gráfico
    const [loading, setLoading] = useState(false);
    const [timePeriod, setTimePeriod] = useState('month'); // Período selecionado (mês, semana, etc.)

    const allSymbols = ['AAPL', 'TSLA', 'GOOG']; // Lista de ações disponíveis

    // Função para gerar dados aleatórios para um determinado período
    const generateRandomData = (period) => {
        const currentDate = new Date();
        const pastData = [];
        let daysInPeriod = 30; // Default para 1 mês

        if (period === 'week') {
            daysInPeriod = 7; // Para uma semana
        } else if (period === 'year') {
            daysInPeriod = 365; // Para um ano
        } else if (period === 'day') {
            daysInPeriod = 1; // Para um único dia
        }

        for (let i = 0; i < daysInPeriod; i++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);

            // Gerar valor aleatório para o preço de fechamento (exemplo entre 100 e 1500)
            const closePrice = (Math.random() * 1400 + 100).toFixed(2);

            pastData.push({
                date: date.getTime(), // Timestamp da data
                close: parseFloat(closePrice), // Preço de fechamento
            });
        }

        return pastData;
    };

    // Função para gerar dados de ações com base no período selecionado
    const generateStockData = (symbol, period) => {
        const generatedData = {
            symbol,
            data: generateRandomData(period),
        };
        return generatedData;
    };

    // Função para adicionar ou remover uma ação do gráfico
    const toggleStockInChart = (symbol) => {
        setStockData((prevStockData) => {
            const isStockPresent = prevStockData.some(stock => stock.symbol === symbol);
            if (isStockPresent) {
                return prevStockData.filter(stock => stock.symbol !== symbol); // Remover ação
            } else {
                const newStockData = generateStockData(symbol, timePeriod);
                return [...prevStockData, newStockData]; // Adicionar ação
            }
        });
    };

    useEffect(() => {
        if (stockData.length > 0) {
            const labels = stockData[0].data.map(item => new Date(item.date)); // Convertendo timestamp para Date
            const datasets = stockData.map(stock => ({
                label: stock.symbol,
                data: stock.data.map(item => item.close),
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                tension: 0.4,
                fill: true,
            }));

            const chartConfig = {
                labels,
                datasets,
            };

            console.log('chartData:', chartConfig); // Debug: Verificando a estrutura dos dados

            setChartData(chartConfig);
        }
    }, [stockData]);

    // Função para gerar cores aleatórias para as linhas
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Função para atualizar o filtro de tempo
    const handleTimePeriodChange = (period) => {
        setTimePeriod(period);
    };

    return (
        <div className="investments-page">
            <h2 className="page-title">Investimentos - Ações</h2>

            {/* Filtros de tempo */}
            <div className="time-filters">
                <button onClick={() => handleTimePeriodChange('day')}>Dia</button>
                <button onClick={() => handleTimePeriodChange('week')}>Semana</button>
                <button onClick={() => handleTimePeriodChange('month')}>Mês</button>
                <button onClick={() => handleTimePeriodChange('year')}>Ano</button>
            </div>

            {loading ? (
                <p>Carregando dados das ações...</p>
            ) : chartData ? (
                <div className="chart-container">
                    <Chart
                        type="line"
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, // Isso garante que o gráfico não mantenha uma proporção fixa
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                },
                            },
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: timePeriod === 'day' ? 'hour' : 'day', // Ajusta a unidade do tempo com base no período
                                    },
                                    adapters: {
                                        date: 'chartjs-adapter-date-fns',  // Configurar o adaptador de data
                                    },
                                    grid: {
                                        display: false, // Remover a grade do eixo X
                                    }
                                },
                                y: {
                                    min: 0,
                                    ticks: {
                                        stepSize: 100,
                                    },
                                    grid: {
                                        display: false, // Remover a grade do eixo Y
                                    }
                                },
                            },
                            layout: {
                                padding: 0,
                            },
                            elements: {
                                line: {
                                    borderWidth: 2,
                                },
                            },
                            backgroundColor: 'rgba(211, 211, 211, 0.5)', // Fundo cinza claro
                        }}
                    />
                </div>
            ) : (
                <p>Sem dados para exibir</p>
            )}

            {/* Lista de ações fictícias */}
            <div className="stock-list">
                <h3>Ações Disponíveis</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Adicionar/Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSymbols.map((symbol) => (
                            <tr key={symbol}>
                                <td>{symbol}</td>
                                <td>
                                    <button onClick={() => toggleStockInChart(symbol)}>
                                        {stockData.some(stock => stock.symbol === symbol) ? 'Remover' : 'Adicionar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Investments;
