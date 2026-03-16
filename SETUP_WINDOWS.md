# Setup do projeto em outro PC (Windows)

## 1) O que instalar

- **Git** (opcional, recomendado)
- **Python 3.11 (64-bit)**
- **Node.js LTS (20.x recomendado)**
- **MySQL Server 8.x**

> Marque a opção para adicionar Python ao PATH durante a instalação.

## 2) Copiar o projeto

Copie a pasta inteira `teste_fogaca` para o novo computador.

## 3) Configurar banco de dados

1. Crie o banco:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fogazza;"
```

2. Crie o arquivo `back/.env` com:

```env
SENHA_BD=sua_senha_root_mysql
```

3. (Opcional) Restaurar dump de dados:

```powershell
mysql -u root -p fogazza < fogazza.sql
```

## 4) Instalar dependências do backend

```powershell
cd back
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

## 5) Instalar dependências do frontend

```powershell
cd front
npm install
cd ..
```

## 6) Gerar EXE para iniciar app

Na raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\build_launcher_exe.ps1
```

Isso cria:

- `dist/IniciarFogazza.exe`
- `dist/PararFogazza.exe`

## 7) Como usar o EXE

1. Dê duplo clique em `dist/IniciarFogazza.exe`
2. Ele inicia backend + frontend em modo oculto (sem abrir janelas de terminal)
3. O navegador abre em `http://localhost:5173`
4. Em caso de erro de inicialização, aparece um popup com a mensagem

## 8) Como encerrar tudo (appzinha de parar)

1. Dê duplo clique em `dist/PararFogazza.exe`
2. Ele encerra backend e frontend, mesmo que o navegador já tenha sido fechado
3. Mostra popup confirmando o encerramento

## Observações importantes

- O EXE **não instala** Python/Node/MySQL automaticamente; ele apenas inicializa backend + frontend.
- Se mudar a porta do frontend, ajuste `FRONTEND_URL` em `launcher_app.py` e gere o EXE novamente.
- Se preferir rodar sem EXE, use `python app_fast.py` em `back` e `npm run dev` em `front`.
