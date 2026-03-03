import { FaFileCsv, FaFilePdf } from "react-icons/fa";

export default function ExportModal({ onExportar }) {
  return (
    <div className="space-x-4 p-4">
      <div
        onClick={() => onExportar("csv")}
        className="flex flex-col space-y-8 text-gray-600 hover:text-green-igreja border-2 border-gray-300 rounded-lg shadow-xl p-4 h-full hover:scale-105 transition-all duration-300 cursor-pointer justify-center items-center"
      >
        <h2 className="text-lg font-semibold">Exportar para CSV</h2>
        <FaFileCsv size={102} className="text-green-700" />
      </div>
    </div>
  );
}