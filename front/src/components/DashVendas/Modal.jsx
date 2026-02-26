import { FiX } from "react-icons/fi";

export default function Modal({ children, onCloseModal, size = "medium", title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl ${
        size === "small" ? "w-96" : size === "medium" ? "w-3/4 max-w-4xl" : "w-1/3"
      } max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}