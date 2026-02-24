import { useState } from 'react'
import Header from './components/Header'
import Lista from './components/Lista'
import Resumo from './components/Resumo'

function App() {
  const [itensSelecionados, setItensSelecionados] = useState([])

  const adicionarItem = (item) => {
    setItensSelecionados(prev => {
      const itemExiste = prev.find(i => i.nome === item.nome)
      if (itemExiste) {
        return prev.map(i => 
          i.nome === item.nome 
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantidade: 1 }]
    })
  }

  const removerItem = (nomeItem) => {
    setItensSelecionados(prev => {
      return prev.map(item => 
        item.nome === nomeItem && item.quantidade > 0
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      ).filter(item => item.quantidade > 0)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-200 text-slate-900">
      <Header />
      <main className="p-6">
        <div className="mx-auto max-w-7xl flex gap-8">
          <div className="flex-1">
            <Lista 
              onAdicionarItem={adicionarItem}
              onRemoverItem={removerItem}
              itensSelecionados={itensSelecionados}
            />
          </div>
          <div style={{width: '450px'}}>
            <Resumo itensSelecionados={itensSelecionados} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
