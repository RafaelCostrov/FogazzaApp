import subprocess
import time
import webbrowser
from pathlib import Path
import shutil
import sys
import ctypes
import json

BACKEND_RELATIVE = Path("back")
FRONTEND_RELATIVE = Path("front")
BACKEND_MAIN_FILE = "app_fast.py"
FRONTEND_URL = "http://localhost:5173"
PID_FILE_NAME = ".fogazza_processes.json"


def _has_project_structure(base: Path) -> bool:
    return (base / BACKEND_RELATIVE).exists() and (base / FRONTEND_RELATIVE).exists()


def _root_dir() -> Path:
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        current_dir = Path.cwd().resolve()

        candidates = [current_dir, exe_dir, exe_dir.parent]
        for candidate in candidates:
            if _has_project_structure(candidate):
                return candidate

        return exe_dir

    return Path(__file__).resolve().parent


def _find_backend_python(back_dir: Path):
    venv_python = back_dir / ".venv" / "Scripts" / "python.exe"
    if venv_python.exists():
        return [str(venv_python)]

    system_python = shutil.which("python")
    if system_python:
        return [system_python]

    py_launcher = shutil.which("py")
    if py_launcher:
        return [py_launcher, "-3.11"]

    return None


def _find_npm():
    npm_cmd = shutil.which("npm.cmd")
    if npm_cmd:
        return npm_cmd

    npm = shutil.which("npm")
    if npm:
        return npm

    return None


def _start_hidden_process(command, cwd: Path):
    startup_info = subprocess.STARTUPINFO()
    startup_info.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    startup_info.wShowWindow = 0

    return subprocess.Popen(
        command,
        cwd=cwd,
        creationflags=subprocess.CREATE_NO_WINDOW,
        startupinfo=startup_info,
    )


def _start_backend(root: Path):
    back_dir = root / BACKEND_RELATIVE
    command_base = _find_backend_python(back_dir)
    if not command_base:
        raise RuntimeError("Python não encontrado. Instale o Python 3.11.")

    command = command_base + [BACKEND_MAIN_FILE]

    return _start_hidden_process(command, back_dir)


def _start_frontend(root: Path):
    front_dir = root / FRONTEND_RELATIVE
    npm_executable = _find_npm()
    if not npm_executable:
        raise RuntimeError("npm não encontrado. Instale o Node.js LTS.")

    return _start_hidden_process([npm_executable, "run", "dev"], front_dir)


def _show_error_message(message: str):
    try:
        ctypes.windll.user32.MessageBoxW(
            0, message, "Erro ao iniciar aplicação", 0x10)
    except Exception:
        pass


def _pid_file(root: Path) -> Path:
    return root / PID_FILE_NAME


def _save_process_info(root: Path, backend_process, frontend_process):
    data = {
        "backend_pid": backend_process.pid,
        "frontend_pid": frontend_process.pid,
    }
    _pid_file(root).write_text(json.dumps(data), encoding="utf-8")


def main():
    root = _root_dir()

    back_dir = root / BACKEND_RELATIVE
    front_dir = root / FRONTEND_RELATIVE

    if not back_dir.exists():
        raise RuntimeError(f"Pasta não encontrada: {back_dir}")
    if not front_dir.exists():
        raise RuntimeError(f"Pasta não encontrada: {front_dir}")

    backend_process = _start_backend(root)
    frontend_process = _start_frontend(root)

    if backend_process.poll() is not None:
        raise RuntimeError("Falha ao iniciar o backend.")

    if frontend_process.poll() is not None:
        raise RuntimeError("Falha ao iniciar o frontend.")

    _save_process_info(root, backend_process, frontend_process)

    time.sleep(4)
    webbrowser.open(FRONTEND_URL)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        _show_error_message(str(error))
        raise
