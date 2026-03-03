import { RiExportFill } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

export default function HeaderRelatorio({ 
  onClickExportar, 
  onClickFiltrar, 
  menuOpen, 
  setMenuOpen 
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between bg-white rounded-t-2xl">
      {/* Visível apenas em md ou maior */}
      <div className="hidden md:flex w-full px-4 py-2 justify-between items-center space-x-6 mt-2">
        <h1 className="font-bold text-green-igreja text-xl sm:text-lg md:text-xl lg:text-xl">
          Histórico de vendas
        </h1>
        <div className="text-green-igreja flex space-x-4">
          <button onClick={onClickExportar}>
            <RiExportFill
              size={24}
              className="hover:scale-110 transition-all duration-200 cursor-pointer"
              title="Exportar atendimentos"
            />
          </button>
          <button onClick={onClickFiltrar}>
            <FaFilter
              size={22}
              className="hover:scale-110 transition-all duration-200 cursor-pointer"
              title="Filtrar atendimentos"
            />
          </button>
        </div>
      </div>

      {/* Botão hamburguer visível apenas em telas pequenas */}
      <div className="flex md:hidden justify-between px-3 items-center py-1">
        <h1 className="font-bold text-green-igreja text-xl mt-1">Histórico</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-igreja focus:outline-none"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col px-4 py-2 items-end space-y-4 md:hidden text-green-igreja">
          <button
            className="flex items-center gap-2 active:scale-95 transition-all duration-200"
            onClick={onClickExportar}
          >
            Exportar
            <RiExportFill size={24} title="Exportar" />
          </button>
          <button
            className="flex items-center gap-2 active:scale-95 transition-all duration-200"
            onClick={onClickFiltrar}
          >
            Filtrar
            <FaFilter size={22} title="Filtrar relatórios" />
          </button>
        </div>
      )}
    </div>
  );
}