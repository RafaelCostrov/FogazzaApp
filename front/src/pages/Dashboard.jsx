import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "react-perfect-scrollbar/dist/css/styles.css";
import { atendimentoService, fogazzaService } from '../services/api';
import HistoricoTabela from '../components/DashVendas/HistoricoTabela';
import Modal from '../components/DashVendas/Modal';
import MenuFiltro from '../components/DashVendas/MenuFiltro';
import InputUnico from '../components/DashVendas/InputUnico';
import HeaderRelatorio from '../components/DashVendas/HeaderRelatorio';
import HeaderVendas from '../components/DashVendas/HeaderVendas';
import ExportModal from '../components/DashVendas/ExportModal';
import CardsTotais from '../components/DashVendas/CardsTotais';
import CardVendaHora from '../components/DashVendas/CardVendaHora';
import CardVendaSabor from '../components/DashVendas/CardVendaSabor';
import CardVendaTicket from "../components/DashVendas/CardVendaTicket";


export default function Dashboard() {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [modal, setModal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [dadosAtendimentos, setDadosAtendimentos] = useState([]);
  const [fogazzas, setFogazzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const [atendimentosResponse, fogazzasResponse] = await Promise.all([
        atendimentoService.filtrar({
          pagina: 1,
          limit: 1000, 
          order_by: "comprado_em",
          order_dir: "desc"
        }),
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
      // Forçar navegação para a página principal
      window.location.href = '/';
    } else if (page === 'relatorios') {
      navigate('/relatorio');
    }
  };

  const onClickFilter = () => setIsFiltered(!isFiltered);
  const onClickModal = (modalType) => setModal(modalType);
  const onCloseModal = () => setModal("");

  const handleExportarRelatorio = async (formato) => {
    console.log(`Exportando relatório em formato ${formato}`);
    onCloseModal();
  };

  const aplicarFiltros = () => {
    //nada ainda
    console.log("Aplicando filtros...");
  };

  const limparForms = () => {
    setDataInicial("");
    setDataFinal("");
    setTipoCliente("");
    setValorMinimo("");
  };

  const algumFiltroAtivo = () => {
    return dataInicial || dataFinal || tipoCliente || valorMinimo;
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
          <CardsTotais dados={dadosAtendimentos} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CardVendaHora dados={dadosAtendimentos} fogazzas={fogazzas} />
            <CardVendaSabor dados={dadosAtendimentos} fogazzas={fogazzas} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CardVendaTicket dados={dadosAtendimentos} />
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

        <MenuFiltro
          isFiltered={isFiltered}
          onClick={aplicarFiltros}
          onClear={limparForms}
          filtrosAtivos={algumFiltroAtivo()}
        >
          <InputUnico
            nomeInput={"Data Inicial"}
            type={"date"}
            classNameDiv={"md:col-start-1 md:row-start-1"}
            value={dataInicial}
            onChange={e => setDataInicial(e.target.value)}
          />
          <InputUnico
            nomeInput={"Data Final"}
            type={"date"}
            classNameDiv={"md:col-start-2 md:row-start-1"}
            value={dataFinal}
            onChange={e => setDataFinal(e.target.value)}
          />
          <InputUnico
            nomeInput={"Tipo de Cliente"}
            type={"text"}
            classNameDiv={"md:col-start-3 md:row-start-1"}
            value={tipoCliente}
            onChange={e => setTipoCliente(e.target.value)}
          />
          <InputUnico
            nomeInput={"Valor Mínimo"}
            type={"number"}
            classNameDiv={"md:col-start-4 md:row-start-1"}
            value={valorMinimo}
            onChange={e => setValorMinimo(e.target.value)}
          />
        </MenuFiltro>

        <AnimatePresence>
          <HistoricoTabela dados={dadosAtendimentos} fogazzas={fogazzas} />
        </AnimatePresence>
      </section>

      {modal === "exportar" && (
        <Modal
          onCloseModal={onCloseModal}
          size={"small"}
          title={"Exportar Relatório"}
        >
          <ExportModal onExportar={handleExportarRelatorio} />
        </Modal>
      )}
    </div>
  );
}


