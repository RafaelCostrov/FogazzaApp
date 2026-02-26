import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Lista from './components/Lista'
import Resumo from './components/Resumo'
import Dashboard from './pages/Dashboard'
import Relatorio from './pages/Relatorio'

function AppContent() {
  const location = useLocation();
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

  const limparVenda = () => {
    setItensSelecionados([])
  }

  // Página principal (pedidos)
  const PaginaPrincipal = () => (
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
          <Resumo 
            itensSelecionados={itensSelecionados} 
            onFinalizarAtendimento={limparVenda}
          />
        </div>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-200 text-slate-900">
      {/* Renderizar Header apenas nas páginas que precisam dele */}
      {location.pathname !== '/dashboard' && <Header />}
      
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/relatorio" element={<Relatorio />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: 'Poppins, sans-serif'
        }}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
