import { useState, useEffect } from "react";
import { flushSync } from 'react-dom';
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "react-perfect-scrollbar/dist/css/styles.css";
import { atendimentoService, fogazzaService } from '../services/api';
import HistoricoTabela from '../components/DashVendas/HistoricoTabela';
import Modal from '../components/DashVendas/Modal';
import MenuFiltro from '../components/DashVendas/MenuFiltro';
import InputUnico from '../components/DashVendas/InputUnico';
import MultipleSelectCheckmarks from '../components/MultipleSelectCheckmarks';
import HeaderRelatorio from '../components/DashVendas/HeaderRelatorio';
import HeaderVendas from '../components/DashVendas/HeaderVendas';
import ExportModal from '../components/DashVendas/ExportModal';
import CardsTotais from '../components/DashVendas/CardsTotais';
import CardVendaHora from '../components/DashVendas/CardVendaHora';
import CardVendaSabor from '../components/DashVendas/CardVendaSabor';
import CardVendaTicket from "../components/DashVendas/CardVendaTicket";
import Filtros from '../components/DashVendas/Filtros';
import { format } from 'date-fns';
import { buildAtendimentoFilters } from '../utils/filtrosDashboard';
import CardVendaQtd from "../components/DashVendas/CardVendaQtd";

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const [periodo, setPeriodo] = useState({
    start: startOfDay,
    end: endOfDay
  });
  const [tipoCliente, setTipoCliente] = useState([]);
  const [saborFogazza, setSaborFogazza] = useState([]); // nomes
  const [idFogazzas, setIdFogazzas] = useState([]); // ids
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [dataMin, setDataMin] = useState("");
  const [dataMax, setDataMax] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [modal, setModal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenuFiltro, setShowMenuFiltro] = useState(false);
    const [dadosAtendimentos, setDadosAtendimentos] = useState([]);
  const [fogazzas, setFogazzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({});

  useEffect(() => {
    filtrarPorPeriodo();
  }, [periodo]);

  const filtrarPorPeriodo = async () => {
    try {
      setLoading(true);
      setErro(null);
      const formatDateTime = date => {
        if (!date) return undefined;
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
      };
      const formatDateDay = (dateStr, isStart) => {
        if (!dateStr) return undefined;
        return isStart
          ? `${dateStr} 00:00:00`
          : `${dateStr} 23:59:59`;
      };

      const filtros = {
        pagina: 1,
        limit: 1000,
        order_by: "comprado_em",
        order_dir: "desc",
        data_hora_min: periodo.start ? formatDateTime(periodo.start) : (dataMin ? formatDateDay(dataMin, true) : undefined),
        data_hora_max: periodo.end ? formatDateTime(periodo.end) : (dataMax ? formatDateDay(dataMax, false) : undefined),
        valor_minimo: valorMinimo || undefined,
        valor_maximo: valorMaximo || undefined
      };
      if (tipoCliente && tipoCliente.length > 0) {
        filtros.tipo_cliente = tipoCliente;
      }
      if (idFogazzas && idFogazzas.length > 0) {
        filtros.id_fogazzas = idFogazzas;
      }
      const [atendimentosResponse, fogazzasResponse] = await Promise.all([
        atendimentoService.filtrar(filtros),
        fogazzaService.listar()
      ]);
      const dados = atendimentosResponse?.atendimentos || atendimentosResponse || [];
      setDadosAtendimentos(dados);
      setFogazzas(fogazzasResponse || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados do dashboard');
      setDadosAtendimentos([]);
      setFogazzas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    if (page === 'vendas') {
      window.location.href = '/';
    } else if (page === 'relatorios') {
      navigate('/relatorio');
    }
  };

  const onClickFilter = () => setShowMenuFiltro(!showMenuFiltro);
  const onClickModal = (modalType) => setModal(modalType);
  const onCloseModal = () => setModal("");

  const handleExportarRelatorio = async (formato) => {
    console.log(`Exportando relatório em formato ${formato}`);
    onCloseModal();
  };

  const aplicarFiltros = (extra = {}) => {
    let ids = idFogazzas;
    if (saborFogazza && saborFogazza.length > 0 && fogazzas.length > 0) {
      ids = fogazzas
        .filter(f => saborFogazza.includes(f.nome_fogazza))
        .map(f => f.id_fogazza);
    }

    setFiltros(buildAtendimentoFilters({
      periodo,
      idFogazzas: ids,
      tipoCliente,
      valorMinimo,
      valorMaximo,
      dataMin,
      dataMax,
      ...extra
    }));
  };

  useEffect(() => {
    if (isFiltered && periodo.start && periodo.end && (idFogazzas.length > 0 || tipoCliente.length > 0)) {
      aplicarFiltros();
      const el = document.getElementById('historico-tabela');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [idFogazzas, tipoCliente, periodo.start, periodo.end, isFiltered]);

  const limparForms = () => {
    setDataInicial("");
    setDataFinal("");
    setTipoCliente("");
    setValorMinimo("");
    setValorMaximo("");
    setDataMin("");
    setDataMax("");
  };

  const algumFiltroAtivo = () => {
    return periodo.start || periodo.end || tipoCliente || valorMinimo || valorMaximo || dataMin || dataMax;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-200">
      <HeaderVendas 
        paginaAtual="vendas" 
        onNavigate={handleNavigate}
      />
      
      {loading && (
        <div className="p-4 md:p-6 text-center">
          <div className="text-gray-600">Carregando dados...</div>
        </div>
      )}
      
      {erro && (
        <div className="p-4 md:p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
            <button 
              onClick={carregarDadosIniciais}
              className="ml-2 underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
      
      {!loading && !erro && (
        <div className="p-4 md:p-6">
          <Filtros periodo={periodo} setPeriodo={setPeriodo} />
          <CardsTotais dados={dadosAtendimentos} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CardVendaHora 
              dados={dadosAtendimentos} 
              fogazzas={fogazzas} 
              onClickPoint={({ sabor, hour }) => {
                if (sabor) {
                  // encontrar fogazza pelo nome
                  const fog = fogazzas.find(f => f.nome_fogazza === sabor);
                  const fogazzaId = fog ? fog.id_fogazza : null;
                  
                  if (fogazzaId) {
                    const matchingIds = dadosAtendimentos
                      .filter(a => {
                        const data = new Date(a.comprado_em);
                        const temFogazza = a.itens && a.itens.some(item => item.id_fogazza === fogazzaId);
                        return data.getHours() === hour && temFogazza;
                      })
                      .map(a => a.id_atendimento);
                    
                    if (matchingIds.length > 0) {
                      flushSync(() => {
                        setIsFiltered(true);
                      });
                      aplicarFiltros({ idAtendimentos: matchingIds });
                      const el = document.getElementById('historico-tabela');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                } else if (hour !== undefined) {
                  const matchingIds = dadosAtendimentos
                    .filter(a => {
                      const data = new Date(a.comprado_em);
                      return data.getHours() === hour;
                    })
                    .map(a => a.id_atendimento);

                  if (matchingIds.length > 0) {
                    flushSync(() => {
                      setIsFiltered(true);
                    });
                    aplicarFiltros({ idAtendimentos: matchingIds });
                    const el = document.getElementById('historico-tabela');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
            <CardVendaSabor 
              dados={dadosAtendimentos} 
              fogazzas={fogazzas} 
              onSaborClick={(saborNome) => {
                // Buscar o id_fogazza 
                const fog = fogazzas.find(f => f.nome_fogazza === saborNome);
                const id = fog ? fog.id_fogazza : null;
                if (id) {
                  flushSync(() => {
                    setSaborFogazza([saborNome]);
                    setIdFogazzas([id]);
                    setIsFiltered(true);
                  });
                }
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CardVendaTicket 
              dados={dadosAtendimentos} 
              onTipoClick={(tipo) => {
                const matchingIds = dadosAtendimentos
                  .filter(a => a.tipo_cliente === tipo)
                  .map(a => a.id_atendimento);
                flushSync(() => {
                  setTipoCliente([tipo]);
                  setIsFiltered(true);
                });
                if (matchingIds.length > 0) {
                  aplicarFiltros({ idAtendimentos: matchingIds });
                  const el = document.getElementById('historico-tabela');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <CardVendaQtd 
              dados={dadosAtendimentos} 
              fogazzas={fogazzas}
              onClickPoint={({ sabor, hour }) => {
                if (sabor) {
                  const fog = fogazzas.find(f => f.nome_fogazza === sabor);
                  const fogazzaId = fog ? fog.id_fogazza : null;
                  if (fogazzaId) {
                    const matchingIds = dadosAtendimentos
                      .filter(a => {
                        const data = new Date(a.comprado_em);
                        const temFogazza = a.itens && a.itens.some(item => item.id_fogazza === fogazzaId);
                        return data.getHours() === hour && temFogazza;
                      })
                      .map(a => a.id_atendimento);
                    if (matchingIds.length > 0) {
                      flushSync(() => {
                        setIsFiltered(true);
                      });
                      aplicarFiltros({ idAtendimentos: matchingIds });
                      const el = document.getElementById('historico-tabela');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                } else if (hour !== undefined) {
                  const matchingIds = dadosAtendimentos
                    .filter(a => {
                      const data = new Date(a.comprado_em);
                      return data.getHours() === hour;
                    })
                    .map(a => a.id_atendimento);
                  if (matchingIds.length > 0) {
                    flushSync(() => {
                      setIsFiltered(true);
                    });
                    aplicarFiltros({ idAtendimentos: matchingIds });
                    const el = document.getElementById('historico-tabela');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      <section className="flex flex-col h-auto p-2 md:p-4">
        <HeaderRelatorio
          onClickExportar={() => onClickModal("exportar")}
          onClickFiltrar={onClickFilter}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <AnimatePresence>
          {showMenuFiltro && (
            <MenuFiltro
              isFiltered={isFiltered}
              onClick={aplicarFiltros}
              onClear={limparForms}
              filtrosAtivos={algumFiltroAtivo()}
              tipoCliente={tipoCliente}
              setTipoCliente={setTipoCliente}
              saborFogazza={saborFogazza}
              setSaborFogazza={setSaborFogazza}
              fogazzas={fogazzas}
              valorMinimo={valorMinimo}
              setValorMinimo={setValorMinimo}
              valorMaximo={valorMaximo}
              setValorMaximo={setValorMaximo}
              dataMin={dataMin}
              setDataMin={setDataMin}
              dataMax={dataMax}
              setDataMax={setDataMax}
              InputUnico={InputUnico}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <HistoricoTabela dados={dadosAtendimentos} fogazzas={fogazzas} filtros={filtros} />
        </AnimatePresence>
      </section>

      {modal === "exportar" && (
        <Modal
          onCloseModal={onCloseModal}
          size={"small"}
          title={"Exportar"}
        >
          <ExportModal onExportar={handleExportarRelatorio} />
        </Modal>
      )}
    </div>
  );
}


