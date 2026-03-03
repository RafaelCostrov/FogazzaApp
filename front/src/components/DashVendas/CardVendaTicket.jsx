import { useState } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CardVendaTicket({ dados = [], onTipoClick }) {
  const [loading, setLoading] = useState(false);

  function calcularVendaTicket() {
    const vendasPorTipo = {};

    dados.forEach(atendimento => {
      const tipoCliente = atendimento.tipo_cliente;
      
      let quantidadeTotal = 0;
      if (atendimento.itens && Array.isArray(atendimento.itens)) {
        quantidadeTotal = atendimento.itens.reduce((total, item) => {
          return total + (item.quantidade || 0);
        }, 0);
      }
    
      if (vendasPorTipo[tipoCliente]) {
        vendasPorTipo[tipoCliente] += quantidadeTotal;
      } else {
        vendasPorTipo[tipoCliente] = quantidadeTotal;
      }
    });

    const tipos = Object.keys(vendasPorTipo);
    const valores = Object.values(vendasPorTipo);

    return {
      tipos: tipos,
      valores: valores
    };
  }
  
  function gerarCoresGrafico(quantidade) {
    // Mesmo padrão do CardVendaSabor
    const coresPrimarias = [
      '#D1A24B',  // dourado
      '#056839',  // verde
      '#973E36',  // vinho
    ];
    // Repete as cores se houver mais tipos
    const cores = [];
    for (let i = 0; i < quantidade; i++) {
      cores.push(coresPrimarias[i % coresPrimarias.length]);
    }
    return cores;
  }

  // Processar os dados
  const dadosProcessados = calcularVendaTicket();
  const cores = gerarCoresGrafico(dadosProcessados.tipos.length);
  const maxValor = dadosProcessados.valores.length > 0 ? Math.max(...dadosProcessados.valores) : 0;

  const chartData = {
    labels: dadosProcessados.tipos,
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: dadosProcessados.valores,
        backgroundColor: cores,
        borderColor: cores.map(cor => cor + '80'),
        borderWidth: 2,
        hoverBackgroundColor: cores.map(cor => cor + 'CC'),
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
        borderRadius: 4,
        maxBarThickness: 48,
        minBarLength: 2
      }
    ]
  };


  // click no gráfico - usa API do Chart para garantir detecção imediata
  const handleChartClick = (event, elements, chart) => {
    // chart vem como terceiro parâmetro na callback do react-chartjs-2
    if (!chart) return;
    const target = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (!target || target.length === 0) return;
    const index = target[0].index;
    const tipo = dadosProcessados.tipos[index];
    if (onTipoClick && tipo) {
      onTipoClick(tipo);
    } else {
      const el = document.getElementById('historico-tabela');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
         backgroundColor: '#973E36',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#973E36',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          family: 'Poppins',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Poppins',
          size: 12
        },
        callbacks: {
          label: function(context) {
            const quantidade = context.parsed.y;
            return `${context.label}: ${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}`;
          }
        }
      }
    },
    onClick: handleChartClick,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxValor > 0 ? maxValor : 1,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1);
            }
            return Math.floor(value) + (value === 1 ? ' un.' : ' un.');
          },
          font: {
            family: 'Poppins',
            size: 11
          },
          maxTicksLimit: 8,
          precision: 0
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Poppins',
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };



  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="text-[18px] text-gray-600 mb-4 font-medium text-left font-poppins">
        Quantidade Vendida por Tipo
      </h3>
      <div className="h-80 flex items-center justify-center">
        {dadosProcessados.tipos.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="text-center text-gray-500">
            <p className="font-poppins">Nenhum dado disponível no filtro selecionado.</p>
          </div>
        )}
      </div>
      {dadosProcessados.tipos.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 font-poppins">
            Tipos de cliente: <span className="font-semibold">{dadosProcessados.tipos.length}</span>
          </p>
          <p className="text-sm text-gray-600 font-poppins">
            Total de unidades: <span className="font-semibold">
              {dadosProcessados.valores.reduce((a, b) => a + b, 0)} unidades
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );

}