import { TbFileAnalytics } from "react-icons/tb";

function Header() {
  return (
    <header className="bg-red-igreja text-white">
      <div className="mx-auto flex min-h-20 w-full items-center justify-between px-6 py-4">
        <div className="w-32">
          <img
            src="/images/saoJudas.png"
            alt="Logo Santuário São Judas Tadeu"
            className="h-28 w-28 object-contain"
          />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-semibold text-yellow-igreja">São Judas Tadeu</h1>
          <p className="text-xl text-white/90">Controle de Vendas</p>
        </div>
        <div className="w-32 flex justify-end">
          <div className="text-4xl text-yellow-igreja">
            <TbFileAnalytics />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
