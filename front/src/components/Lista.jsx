import CartaoFogaca from './ListaFogazza'

function Lista({ onAdicionarItem, onRemoverItem, itensSelecionados }) {
  const fogacas = [
    { id: 1, nome: 'Fogazza Calabresa', preco: 8.0, imagem: null },
    { id: 2, nome: 'Fogazza Queijo', preco: 8.0, imagem: null },
    { id: 3, nome: 'Fogazza Pizza', preco: 8.0, imagem: null },
  ]

  const getQuantidadeItem = (nome) => {
    const item = itensSelecionados.find(item => item.nome === nome)
    return item ? item.quantidade : 0
  }

  return (
    <section className="w-full p-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-red-igreja">
          Selecione os sabores
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
