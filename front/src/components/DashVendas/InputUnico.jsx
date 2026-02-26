export default function InputUnico({ nomeInput, type = "text", value, onChange, classNameDiv = "" }) {
  return (
    <div className={`flex flex-col ${classNameDiv}`}>
      <label className="text-sm font-medium text-gray-700 mb-1">{nomeInput}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}