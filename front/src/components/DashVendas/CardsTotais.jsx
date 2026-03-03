import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import { GiTacos } from "react-icons/gi";
import { FaCashRegister } from "react-icons/fa6";
import { atendimentoService } from '../../services/api';

function Card({ icone, titulo, valor, subtitulo, cor, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{titulo}</p>
          <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
          
        </div>
        <div className={`p-3 `}>
          {icone}
        </div>
      </div>
    </motion.div>
  );
}

export default function CardsTotais({ dados = [] }) {
  const [loading, setLoading] = useState(false);

  const calcularMetricas = () => {
    if (!dados || dados.length === 0) {
      return {
        vendasTotais: 0,
        quantidadeVendida: 0,
        pedidosTotais: 0,
        ticketMedio: 0
      };
    }

    const hoje = new Date().toDateString();
    
    const vendasTotais = dados.reduce((total, item) => total + (item.preco_total || 0), 0);
    
    const vendasDoDia = dados
      .filter(item => new Date(item.comprado_em).toDateString() === hoje)
      .reduce((total, item) => total + (item.preco_total || 0), 0);
    
    const pedidosTotais = dados.length;
    
    const ticketMedio = pedidosTotais > 0 ? vendasTotais / pedidosTotais : 0;

    const quantidadeVendida = dados.reduce((totalQuantidade, atendimento) => {
      if (!atendimento.itens || !Array.isArray(atendimento.itens)) return totalQuantidade;
      
      const quantidadeDoAtendimento = atendimento.itens.reduce((soma, item) => {
        return soma + (item.quantidade || 0);
      }, 0);
      
      return totalQuantidade + quantidadeDoAtendimento;
    }, 0);

    return {
      vendasTotais,
      quantidadeVendida,
      pedidosTotais,
      ticketMedio
    };
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const metricas = calcularMetricas();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        icone={<FaMoneyBillWave size={35} className="text-[#056839]" />}
        titulo="Vendas Totais"
        valor={formatarValor(metricas.vendasTotais)}
        cor="text-[#056839]"
         onClick={() => {
    const el = document.getElementById('historico-tabela');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }}
      />

       <Card 
        icone={<FaCashRegister size={35} className="text-[#D1A24B]" />}
        titulo="Atendimentos Totais"
        valor={metricas.pedidosTotais.toString()}
        subtitulo="Total de atendimentos"
        cor="text-[#D1A24B]"
         onClick={() => {
    const el = document.getElementById('historico-tabela');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }}
      />

      <Card 
        icone={<GiTacos size={37} className="text-[#973E36]" />}
        titulo="Fogazzas vendidas"
        valor={metricas.quantidadeVendida.toString()}
        subtitulo="Total de itens"
        cor="text-[#973E36]"
        onClick={() => {
    const el = document.getElementById('historico-tabela');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }}
      />
      
      
      <Card 
        icone={<FaChartLine size={35} className="text-[#056839]" />}
        titulo="Ticket Médio"
        valor={formatarValor(metricas.ticketMedio)}
        subtitulo="Valor médio por pedido"
        cor="text-[#056839]"
        onClick={() => {
    const el = document.getElementById('historico-tabela');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }}
      />
    </div>
  );
}
