import { useState } from 'react'
import { HiClipboardDocumentList } from 'react-icons/hi2'

function Resumo({ itensSelecionados = [] }) {
  const [valorRecebido, setValorRecebido] = useState('')

  const totalItens = itensSelecionados.reduce((acc, item) => acc + item.quantidade, 0)
  const valorTotal = itensSelecionados.reduce((acc, item) => acc + (item.quantidade * item.preco), 0)
  const troco = valorRecebido ? parseFloat(valorRecebido) - valorTotal : 0

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Cabeçalho Verde */}
      <div className="bg-green-igreja text-white p-4">
        <div className="flex items-center gap-2">
          <HiClipboardDocumentList size={24} />
          <h3 className="text-lg font-semibold">Resumo da Venda</h3>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        {/* Lista de Itens */}
        <div className="space-y-2">
          {itensSelecionados.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-slate-600">
                {item.quantidade}x {item.nome}
              </span>
              <span className="font-semibold">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Separador */}
        <hr className="border-slate-200" />

        {/* Total de Itens */}
        <div className="flex justify-between">
          <span className="text-slate-600">Total de itens:</span>
          <span className="font-bold text-red-igreja">{totalItens}</span>
        </div>

        {/* Valor Total */}
        <div className="bg-green-igreja text-white p-3 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Valor Total:</span>
            <span className="text-xl font-bold">R$ {valorTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Valor Recebido */}
        <div className="flex items-center gap-3">
          <label className="text-yellow-600 font-medium whitespace-nowrap">
            Valor Recebido:
          </label>
          <input
            type="number"
            step="0.01"
            value={valorRecebido}
            onChange={(e) => setValorRecebido(e.target.value)}
            className="flex-1 p-2 border-2 border-yellow-igreja rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-yellow-700"
            placeholder="0,00"
          />
        </div>

        {/* Troco */}
        <div className="flex justify-between items-center">
          <span className="text-green-igreja font-semibold">Troco:</span>
          <span className="text-green-igreja text-xl font-bold">
            R$ {Math.max(0, troco).toFixed(2)}
          </span>
        </div>

        {/* Botão Finalizar */}
        <button
          className="w-full bg-red-igreja text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-900 transition"
          disabled={totalItens === 0}
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

export default Resumo
