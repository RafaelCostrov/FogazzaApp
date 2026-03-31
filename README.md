<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=F59E0B&text=🥟%20Fogazza%20-%20Sistema%20de%20Vendas&fontColor=ffffff&fontSize=38&animation=fadeIn&fontAlignY=40&desc=React%20%7C%20Flask%20%7C%20MySQL&descAlignY=62" alt="Fogazza Banner" />
</p>
<p align="center">
  Aplicação para operação de vendas de fogazzas com fluxo rápido de atendimento, histórico, filtros e relatórios.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Flask-2.3-000000?logo=flask&logoColor=white" alt="Flask 2.3" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL 8" />
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#inicio-rapido">Início Rápido</a> •
  <a href="#execucao-por-exe-windows">Execução por EXE</a> •
  <a href="#documentacao-complementar">Documentação</a>
</p>

## ✨ Funcionalidades

- Venda ágil para operação do dia a dia
- Cadastro e gestão de fogazzas ativas
- Atendimento com tipo de cliente e opção viagem
- Filtros avançados para histórico de vendas
- Exportação de relatórios em Excel
- Inicialização e encerramento por EXE sem terminal aberto

## 🛠️ Stack do projeto

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, Vite, Tailwind, MUI, Chart.js |
| Backend | Flask, Flask-CORS, SQLAlchemy |
| Banco | MySQL 8 |
| Relatórios | pandas, openpyxl |
| Empacotamento | PyInstaller |

## 📁 Arquitetura rápida

```text
teste_fogaca/
  back/                   API Flask e regras de negócio
  front/                  Interface React (Vite)
  launcher_app.py         Inicializa backend + frontend
  stop_app.py             Encerra processos da aplicação
  build_launcher_exe.ps1  Gera os executáveis no Windows
  SETUP_WINDOWS.md        Guia de setup para outro PC
```

## 📦 Início rápido

### 1) Pré-requisitos

- Windows
- Python 3.11 (64-bit)
- Node.js LTS (20.x recomendado)
- MySQL Server 8.x

### 2) Criar banco e variável de ambiente

Crie o banco:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fogazza;"
```

Crie o arquivo `back/.env`:

```env
SENHA_BD=sua_senha_root_mysql
```

### 3) Instalar dependências

Backend:

```powershell
cd back
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

Frontend:

```powershell
cd front
npm install
cd ..
```

### 4) Rodar em desenvolvimento

Use 2 terminais.

Terminal 1 (backend):

```powershell
cd back
.\.venv\Scripts\Activate.ps1
python app_fast.py
```

Terminal 2 (frontend):

```powershell
cd front
npm run dev
```

Aplicação: http://localhost:5173  
API local: http://127.0.0.1:5000

## 📦 Execução por EXE (Windows)

Para gerar os executáveis:

```powershell
powershell -ExecutionPolicy Bypass -File .\build_launcher_exe.ps1
```

Arquivos gerados:

- `dist/IniciarFogazza.exe`
- `dist/PararFogazza.exe`

Como usar:

1. Execute `dist/IniciarFogazza.exe`.
2. Aguarde a subida dos serviços (backend + frontend).
3. O navegador abre automaticamente em http://localhost:5173.
4. Ao finalizar, execute `dist/PararFogazza.exe` para encerrar tudo.

## Documentação complementar

- API detalhada: `back/README.md`
- Setup adicional para Windows: `SETUP_WINDOWS.md`

## Observações importantes

- O EXE não instala Python, Node.js ou MySQL. Ele apenas inicializa o projeto já configurado.
- Se mudar a porta/url do frontend, ajuste `FRONTEND_URL` em `launcher_app.py` e gere os executáveis novamente.
- O backend conecta no banco `fogazza` em `localhost`, usuário `root`, senha vinda de `SENHA_BD`.
