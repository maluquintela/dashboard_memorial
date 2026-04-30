#!/usr/bin/env python3

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_package_json():
    package_path = ROOT / "package.json"

    if not package_path.exists():
        print("ERRO: package.json não encontrado. Rode este script na raiz do dashboard.")
        sys.exit(1)

    with package_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def detect_package_manager():
    if (ROOT / "pnpm-lock.yaml").exists():
        return "pnpm"

    if (ROOT / "yarn.lock").exists():
        return "yarn"

    return "npm"


def script_command(package_manager, script_name):
    if package_manager == "yarn":
        return ["yarn", script_name]

    return [package_manager, "run", script_name]


def run(command, timeout_seconds=300):
    print("")
    print("$ " + " ".join(command))

    subprocess.run(
        command,
        cwd=ROOT,
        check=True,
        timeout=timeout_seconds
    )


def main():
    package = load_package_json()
    scripts = package.get("scripts", {})
    package_manager = detect_package_manager()

    if not (ROOT / "node_modules").exists():
        print("ERRO: node_modules não encontrado.")
        print("Instale as dependências antes de rodar o Ralph.")
        print("")
        print("Sugestão:")
        print(f"  {package_manager} install")
        sys.exit(1)

    ran_anything = False

    if "lint" in scripts:
        run(script_command(package_manager, "lint"))
        ran_anything = True
    else:
        print("AVISO: script lint não encontrado. Pulando lint.")

    if "typecheck" in scripts:
        run(script_command(package_manager, "typecheck"))
        ran_anything = True
    else:
        print("AVISO: script typecheck não encontrado. Pulando typecheck.")

    test_script = scripts.get("test")

    if test_script and "vitest" in test_script:
        run(script_command(package_manager, "test") + ["--", "--run"])
        ran_anything = True
    elif test_script and "jest" in test_script:
        run(script_command(package_manager, "test") + ["--", "--watch=false"])
        ran_anything = True
    elif test_script and "echo" not in test_script:
        print("AVISO: script test existe, mas não parece ser vitest nem jest.")
        print("Pulando para evitar teste em modo watch.")
    else:
        print("AVISO: script test não encontrado ou é placeholder. Pulando testes.")

    if "build" in scripts:
        run(script_command(package_manager, "build"), timeout_seconds=600)
        ran_anything = True
    else:
        print("ERRO: script build não encontrado. Para esta iteração, build é obrigatório.")
        sys.exit(1)

    if not ran_anything:
        print("ERRO: nenhum comando de verificação foi executado.")
        sys.exit(1)

    print("")
    print("VERIFY PASSOU")


if __name__ == "__main__":
    main()
