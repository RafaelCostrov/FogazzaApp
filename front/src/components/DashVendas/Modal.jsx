import { FiX } from "react-icons/fi";
import { RiExportFill } from "react-icons/ri";

export default function Modal({ children, onCloseModal, size = "medium", title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl ${
        size === "small" ? "w-96" : size === "compact" ? "w-[540px] max-w-[95vw]" : size === "medium" ? "w-3/4 max-w-4xl" : "w-1/3"
      } max-h-[80vh] overflow-y-auto`}>
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <RiExportFill className="text-green-igreja text-3xl" />
            <h2 className="text-xl font-semibold text-green-igreja">{title}</h2>
          </div>
          <button
            onClick={onCloseModal}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Fechar modal"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}