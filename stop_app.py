import ctypes
import json
import subprocess
import sys
from pathlib import Path

BACKEND_RELATIVE = Path("back")
FRONTEND_RELATIVE = Path("front")
PID_FILE_NAME = ".fogazza_processes.json"
BACKEND_PORT = 5000
FRONTEND_PORT = 5173


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


def _pid_file(root: Path) -> Path:
    return root / PID_FILE_NAME


def _show_popup(message: str, title: str, is_error: bool = False):
    icon = 0x10 if is_error else 0x40
    try:
        ctypes.windll.user32.MessageBoxW(0, message, title, icon)
    except Exception:
        pass


def _taskkill_pid(pid: int):
    subprocess.run(
        ["taskkill", "/PID", str(pid), "/T", "/F"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    )


def _pids_listening_on_port(port: int) -> set[int]:
    result = subprocess.run(
        ["netstat", "-ano", "-p", "tcp"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
        check=False,
    )

    pids = set()
    for line in result.stdout.splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue

        proto = parts[0].upper()
        local_address = parts[1]
        state = parts[3].upper()
        pid_text = parts[4]

        if proto != "TCP":
            continue

        if not local_address.endswith(f":{port}"):
            continue

        if state not in {"LISTENING", "ESCUTANDO", "LISTEN"}:
            continue

        if pid_text.isdigit():
            pids.add(int(pid_text))

    return pids


def _pids_listening_on_port_powershell(port: int) -> set[int]:
    command = (
        f"Get-NetTCPConnection -LocalPort {port} -State Listen -ErrorAction SilentlyContinue "
        "| Select-Object -ExpandProperty OwningProcess | Out-String"
    )

    result = subprocess.run(
        ["powershell", "-NoProfile", "-Command", command],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
        check=False,
    )

    pids = set()
    for line in result.stdout.splitlines():
        value = line.strip()
        if value.isdigit():
            pids.add(int(value))

    return pids


def main():
    root = _root_dir()
    pid_file = _pid_file(root)

    pids_to_kill = set()

    if pid_file.exists():
        try:
            data = json.loads(pid_file.read_text(encoding="utf-8"))
            backend_pid = data.get("backend_pid")
            frontend_pid = data.get("frontend_pid")

            if isinstance(backend_pid, int):
                pids_to_kill.add(backend_pid)
            if isinstance(frontend_pid, int):
                pids_to_kill.add(frontend_pid)
        except Exception:
            pid_file.unlink(missing_ok=True)

    pids_to_kill.update(_pids_listening_on_port(BACKEND_PORT))
    pids_to_kill.update(_pids_listening_on_port(FRONTEND_PORT))
    pids_to_kill.update(_pids_listening_on_port_powershell(BACKEND_PORT))
    pids_to_kill.update(_pids_listening_on_port_powershell(FRONTEND_PORT))

    if not pids_to_kill:
        pid_file.unlink(missing_ok=True)
        _show_popup(
            "Nenhum processo da aplicação foi encontrado para encerrar.", "Parar Fogazza")
        return

    for pid in pids_to_kill:
        _taskkill_pid(pid)

    pid_file.unlink(missing_ok=True)
    _show_popup("Aplicação encerrada com sucesso.", "Parar Fogazza")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        _show_popup(
            f"Erro ao encerrar aplicação: {error}", "Parar Fogazza", is_error=True)
        raise
