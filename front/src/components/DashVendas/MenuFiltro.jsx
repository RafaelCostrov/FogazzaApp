import { motion } from "framer-motion";

export default function MenuFiltro({ children, isFiltered, onClick, onClear, filtrosAtivos }) {
  if (!isFiltered) return null;
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-gray-100 border-x border-gray-300 p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {children}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
        {filtrosAtivos && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
    </motion.div>
  );
}