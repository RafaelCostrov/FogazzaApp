import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

function ListaFogazza({ nome, preco, quantidade, onAdicionar, onRemover }) {
  const precoTotal = quantidade > 0 ? quantidade * preco : preco

  return (
    <div className="flex rounded-2xl shadow-md overflow-hidden border-l-4 border-red-igreja bg-white w-full">
      <div className="flex flex-col items-center justify-center p-8 flex-1">
        <div className="mb-3 h-14 w-14">
            <div className="flex h-full w-full items-center justify-center text-3xl">
              <img src={`public/images/pasty_4498022.png`} className="h-full w-full object-contain" />
            </div>
        </div>
        <h3 className="mb-2 text-center text-sm font-semibold text-gray-600 h-8 flex items-center justify-center line-clamp-2 overflow-hidden">{nome}</h3>
        <p className="mb-3 text-xl font-bold text-green-igreja">
          R$ {precoTotal.toFixed(2)}
          {quantidade > 0 && <span className="text-sm text-slate-500 ml-1">({quantidade}x)</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onRemover}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-400 text-slate-600 hover:border-red-igreja hover:text-red-igreja transition"
          >
            <AiOutlineMinus size={12} />
          </button>
          <span className="text-center text-xl font-semibold text-slate-800 min-w-6">{quantidade}</span>
          <button
            onClick={onAdicionar}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-igreja text-white hover:bg-green-700 transition"
          >
            <AiOutlinePlus size={12} />
          </button>
        </div>
      </div>
      
    </div>

    
  )
}

export default ListaFogazza
