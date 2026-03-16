$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

Write-Host "Instalando/atualizando PyInstaller..."
python -m pip install --upgrade pyinstaller

Write-Host "Gerando EXE de inicialização..."
python -m PyInstaller --noconfirm --clean --onefile --windowed --name IniciarFogazza launcher_app.py

Write-Host "Gerando EXE de encerramento..."
python -m PyInstaller --noconfirm --clean --onefile --windowed --name PararFogazza stop_app.py

Write-Host "Pronto! EXEs gerados em:"
Write-Host "- dist\IniciarFogazza.exe"
Write-Host "- dist\PararFogazza.exe"
