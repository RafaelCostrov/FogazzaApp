import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

function ListaFogazza({ nome, preco, quantidade, onAdicionar, onRemover }) {
  const precoTotal = quantidade > 0 ? quantidade * preco : preco

  return (
    <div className="flex rounded-2xl shadow-md overflow-hidden">
      <div className="w-1 bg-red-igreja rounded-full"></div>
      <div className="flex flex-col items-center p-6 flex-1 bg-white rounded-r-2xl">
        <div className="mb-4 h-16 w-16">
            <div className="flex h-full w-full items-center justify-center text-4xl">
              <img src={`public/images/pasty_4498022.png`} className="h-full w-full object-contain" />
            </div>
        </div>
        <h3 className="text-center text-sm font-semibold text-gray-600">{nome}</h3>
        <p className="mb-4 text-xl font-bold text-green-igreja">
          R$ {precoTotal.toFixed(2)}
          {quantidade > 0 && <span className="text-sm text-slate-500 ml-1">({quantidade}x)</span>}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={onRemover}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-400 text-slate-600 hover:border-red-igreja hover:text-red-igreja transition"
          >
            <AiOutlineMinus size={18} />
          </button>
          <span className="text-center text-base font-semibold text-slate-800 min-w-8">{quantidade}</span>
          <button
            onClick={onAdicionar}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-igreja text-white hover:bg-green-700 transition"
          >
            <AiOutlinePlus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListaFogazza
