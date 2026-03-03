import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import CartaoFogaca from './ListaFogazza'
import { fogazzaService } from '../services/api'
import { GiTacos } from "react-icons/gi";

function Lista({ onAdicionarItem, onRemoverItem, itensSelecionados }) {
  const [fogacas, setFogacas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarFogazzas() {
      try {
        setLoading(true)
        setErro(null)
        
        const fogazzasApi = await fogazzaService.listar()
        
        const fogazzasFormatadas = fogazzasApi.map(fogazza => ({
          id: fogazza.id_fogazza,
          nome: fogazza.nome_fogazza,
          preco: fogazza.preco_fogazza,
          imagem: null
        }))
        
        setFogacas(fogazzasFormatadas)
      } catch (error) {
        console.error('Erro ao buscar fogazzas:', error)
        setErro('Erro ao carregar as fogazzas. Tente novamente.')
        toast.error('Erro ao carregar as fogazzas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    buscarFogazzas()
  }, [])

  const getQuantidadeItem = (nome) => {
    const item = itensSelecionados.find(item => item.nome === nome)
    return item ? item.quantidade : 0
  }

  // Loading 
  if (loading) {
    return (
      <section className="w-full p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-igreja">
            Selecione os sabores
          </h2>
          <div className="flex justify-center items-center py-12">
            
            <div className="flex flex-col items-center text-green-igreja">
              <GiTacos className="animate-spin duration-1000 text-4xl mb-3 " />
              <span className="text-sm font-medium">
              Carregando fogazzas...
              </span>
              </div>
          </div>
        </div>
      </section>
    )
  }

  // Error 
  if (erro) {
    return (
      <section className="w-full p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-igreja">
            Selecione os sabores
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="text-red-600 text-center">
              <p>{erro}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-red-igreja text-white rounded hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Empty 
  if (fogacas.length === 0) {
    return (
      <section className="w-full p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-igreja">
            Selecione os sabores
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Nenhuma fogazza encontrada.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full p-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-igreja">
          Selecione os sabores
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fogacas.map((fogaca) => (
            <CartaoFogaca
              key={fogaca.id}
              nome={fogaca.nome}
              preco={fogaca.preco}
              imagem={fogaca.imagem}
              quantidade={getQuantidadeItem(fogaca.nome)}
              onAdicionar={() => onAdicionarItem(fogaca)}
              onRemover={() => onRemoverItem(fogaca.nome)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Lista
