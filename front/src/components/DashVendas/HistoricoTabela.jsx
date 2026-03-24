import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from '@mui/material';
import { atendimentoService } from '../../services/api';

import { PiCheeseLight } from "react-icons/pi";
import { LuPizza } from "react-icons/lu";
import { TbSausage } from "react-icons/tb";
import ModalImpressao from '../ModalImpressao';

function Paginacao({ paginaAtual, setPaginaAtual, totalPaginas, totalItens, itensPorPagina, itensMostrados = 0 }) {
  const inicioItem = totalItens === 0 ? 0 : (paginaAtual - 1) * itensPorPagina + 1;
  const fimItem = totalItens === 0 ? 0 : Math.min((paginaAtual - 1) * itensPorPagina + itensMostrados, totalItens);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
      <div className="text-sm text-gray-600">
        {totalItens === 0 ? 'Nenhum item encontrado' : `Mostrando ${inicioItem} a ${fimItem} de ${totalItens} itens`}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
          disabled={paginaAtual === 1}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="px-4 py-1 text-sm text-green-igreja">
          {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default function HistoricoTabela({ filtros = {}, dados: dadosIniciais = [], fogazzas = [] }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtros]);
  const [totalItens, setTotalItens] = useState(0);
  const [usandoDadosLocais, setUsandoDadosLocais] = useState(true);
  const ITENS_POR_PAGINA = 20;
  const [modalOpen, setModalOpen] = useState(false);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null);

  useEffect(() => {
    const temFiltrosAtivos = Object.keys(filtros).some(key => 
      filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== ''
    );

    if (!temFiltrosAtivos && dadosIniciais.length > 0) {
      setUsandoDadosLocais(true);
      const dadosPaginados = dadosIniciais.slice(
        (currentPage - 1) * ITENS_POR_PAGINA,
        currentPage * ITENS_POR_PAGINA
      );
      setDados(dadosPaginados);
      setTotalItens(dadosIniciais.length);
      setTotalPages(Math.ceil(dadosIniciais.length / ITENS_POR_PAGINA));
      setLoading(false);
    } else if (temFiltrosAtivos) {
      setUsandoDadosLocais(false);
      carregarAtendimentos(currentPage, filtros);
    }
  }, [dadosIniciais, filtros, currentPage]);

  const carregarAtendimentos = async (pagina = 1, filtrosParam = filtros) => {
    try {
      setLoading(true);
      
      const filtrosComPaginacao = {
        ...filtrosParam,
        pagina: pagina,
        limit: ITENS_POR_PAGINA,
        order_by: "comprado_em",
        order_dir: "desc"
      };
      
      const response = await atendimentoService.filtrar(filtrosComPaginacao);
      
      if (response && response.atendimentos) {
        const atendimentos = response.atendimentos || [];
        setDados(atendimentos);
        
        // Calcula o total real baseado nos itens recebidos
        let totalReal;
        if (atendimentos.length < ITENS_POR_PAGINA) {
          // Se recebeu menos itens que o limite, é a última página
          totalReal = (pagina - 1) * ITENS_POR_PAGINA + atendimentos.length;
        } else {
          // Senão, usa o total reportado pela API
          totalReal = response.total || atendimentos.length;
        }
        
        setTotalItens(totalReal);
        setTotalPages(Math.ceil(totalReal / ITENS_POR_PAGINA));
      } else {
        const dados = Array.isArray(response) ? response : [];
        setDados(dados);
        setTotalItens(dados.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
      setDados([]);
      setTotalItens(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  const formatarValor = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };


  const formatarItens = (itens) => {
    if (!itens || itens.length === 0) return 'Nenhum item';
    
    return itens.map((item, index) => {
      // Buscar nome da fogazza pelo ID
      const fogazza = fogazzas.find(f => f.id_fogazza === item.id_fogazza);
      const sabor = fogazza ? fogazza.nome_fogazza : `Fogazza ${item.id_fogazza}`;
      
      return (
        <span key={index} className="inline-block mr-2 mb-1">
          <span className=" font-medium text-gray-700">
            {item.quantidade}x {sabor}
          </span>
          {index < itens.length - 1 && ', '}
        </span>
      );
    });
  };

  return (
    <>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-white rounded-b-lg shadow-md flex flex-col max-h-[calc(100dvh-80px)] md:max-h-[calc(100dvh-150px)] p-2 md:p-4"
      >
        {/* Tabela para telas maiores */}
        <div className="hidden lg:block overflow-x-auto w-full md:overflow-visible scrollbar-hide" id="historico-tabela">
          <table className="bg-white w-full lg:table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-100 text-green-igreja">
                <th className="py-3 px-2 w-1/8 text-xs md:text-sm">
                  Nº
                </th>
                <th className="py-3 px-2 text-left text-xs md:text-sm">
                  Data/Hora
                </th>
                <th className="py-3 px-2 w-2/8 text-xs md:text-sm">
                  Itens
                </th>
                <th className="py-3 px-2 w-1/8 text-xs md:text-sm">
                  Quantidade
                </th>
                <th className="py-3 px-2 w-2/8 text-xs md:text-sm">
                  Valor Total
                </th>
                <th className="py-3 px-2 w-2/8 text-xs md:text-sm">
                  Tipo de Cliente
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="hidden lg:block lg:flex-1 overflow-auto scrollbar-hide">
          <div className="overflow-x-auto w-full lg:overflow-visible">
            <table className="border border-gray-300 w-full lg:table-fixed min-w-[1000px]">
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : dados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Nenhum atendimento encontrado
                    </td>
                  </tr>
                ) : (
                  dados.map((item, index) => (
                    <tr
                      key={item.id_atendimento || index}
                      className={`transition-all duration-300 cursor-pointer ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                      onClick={() => {
                        setAtendimentoSelecionado(item);
                        setModalOpen(true);
                      }}
                    >
                      <td className="py-3 px-2 border-b border-gray-300 text-xs">
                        {item.id_atendimento}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-300 text-xs max-w-[200px] truncate whitespace-nowrap overflow-hidden text-left">
                        {formatarData(item.comprado_em)}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-300 text-xs truncate">
                        {formatarItens(item.itens)}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-300 text-xs">
                        {item.itens ? item.itens.reduce((total, item) => total + item.quantidade, 0) : 0}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-300 text-xs font-semibold text-green-600">
                        {formatarValor(item.preco_total)}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-300 text-xs">
                        {item.tipo_cliente
                          ? item.tipo_cliente.charAt(0).toUpperCase() + item.tipo_cliente.slice(1).toLowerCase()
                          : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Tabela para telas menores */}
        <div className="block lg:hidden overflow-x-auto scrollbar-hide w-full " id="historico-tabela">
          <table className="bg-white border border-gray-300 w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200 text-green-igreja">
                <th className="py-3 px-2 border-b border-gray-300 text-xs md:text-sm">
                  Atendimento
                </th>
                <th className="py-3 px-2 border-b border-gray-300 text-xs md:text-sm">
                  Data/Hora
                </th>
                <th className="py-3 px-2 border-b border-gray-300 text-xs md:text-sm">
                  Valor Total
                </th>
                <th className="py-3 px-2 border-b border-gray-300 text-xs md:text-sm">
                  Tipo Cliente
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    Carregando dados...
                  </td>
                </tr>
              ) : dados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    Nenhum atendimento encontrado
                  </td>
                </tr>
              ) : (
                dados.map((item, index) => (
                  <tr
                    key={item.id_atendimento || index}
                    className={`transition-all duration-300 cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                    onClick={() => {
                      setAtendimentoSelecionado(item);
                      setModalOpen(true);
                    }}
                  >
                    <td className="py-3 px-2 border-b border-gray-300 text-xs text-left">
                      <div className="font-semibold">#{item.id_atendimento}</div>
                      <div className="text-gray-500 text-xs rounded bg-gray-100">{formatarItens(item.itens)}</div>
                    </td>
                    <td className="py-3 px-2 border-b border-gray-300 text-xs">
                      {formatarData(item.comprado_em)}
                    </td>
                    <td className="py-3 px-2 border-b border-gray-300 text-xs">
                      <div className="font-semibold text-green-600">{formatarValor(item.preco_total)}</div>
                      <div className="text-blue-600 text-xs">Qtd: {item.itens ? item.itens.reduce((total, item) => total + item.quantidade, 0) : 0}</div>
                    </td>
                    <td className="py-3 px-2 border-b border-gray-300 text-xs">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        {item.tipo_cliente
                          ? item.tipo_cliente.charAt(0).toUpperCase() + item.tipo_cliente.slice(1).toLowerCase()
                          : ''}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex pb-5 md:pb-0 lg:flex-row justify-end md:items-end sm:gap-2 md:gap-4 lg:gap-6">
          <Paginacao
            paginaAtual={currentPage}
            setPaginaAtual={setCurrentPage}
            totalPaginas={totalPages}
            totalItens={totalItens}
            itensPorPagina={ITENS_POR_PAGINA}
            itensMostrados={dados.length}
          />
        </div>
      </motion.div>
      <ModalImpressao
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        atendimento={atendimentoSelecionado}
        fogazzas={fogazzas}
        validarImpressao={false}
      />
    </>
  );
}
