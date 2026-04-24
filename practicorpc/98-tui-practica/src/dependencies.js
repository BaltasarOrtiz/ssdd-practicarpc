import path from 'node:path';
import {
  GRPC_GENERATED_DIR,
  GRPC_PYTHON_SERVER_DIR,
  NODE_CLIENT_DIR,
  PROJECT_ROOT,
  VENV_DIR,
  VENV_PYTHON,
  fileExists,
  parseOsRelease,
  shEscape
} from './utils.js';
import {runCapturedCommand} from './runner.js';

function buildPythonImportCheck() {
  return `${shEscape(VENV_PYTHON)} -c ${shEscape("import grpc, google.protobuf, rpyc; print('ok')")}`;
}

async function checkCommand(command, {cwd} = {}) {
  const result = await runCapturedCommand(command, {cwd});
  return {
    ok: result.success,
    detail: result.output || `exit=${result.code}`
  };
}

export const dependencyChecks = [
  {
    id: 'os',
    label: 'Distribución compatible',
    type: 'info',
    async check() {
      const os = parseOsRelease();
      const supported = ['ubuntu', 'debian'].includes(os.id);
      return {
        ok: supported,
        detail: supported ? os.prettyName : `${os.prettyName} (soporte oficial: Ubuntu/Debian)`
      };
    }
  },
  {id: 'java', label: 'Java runtime', async check() { return checkCommand('java -version'); }},
  {id: 'javac', label: 'Compilador javac', async check() { return checkCommand('javac -version'); }},
  {id: 'node', label: 'Node.js', async check() { return checkCommand('node --version'); }},
  {id: 'npm', label: 'npm', async check() { return checkCommand('npm --version'); }},
  {id: 'python3', label: 'Python 3', async check() { return checkCommand('python3 --version'); }},
  {id: 'gcc', label: 'gcc', async check() { return checkCommand('gcc --version'); }},
  {id: 'rpcgen', label: 'rpcgen', async check() { return checkCommand('rpcgen -h >/dev/null'); }},
  {id: 'rpcinfo', label: 'rpcinfo', async check() { return checkCommand('rpcinfo -p localhost'); }},
  {id: 'protoc', label: 'protoc', async check() { return checkCommand('protoc --version'); }},
  {
    id: 'tirpc-header',
    label: 'Header libtirpc-dev',
    async check() {
      return {
        ok: fileExists('/usr/include/tirpc/rpc/rpc.h'),
        detail: fileExists('/usr/include/tirpc/rpc/rpc.h') ? '/usr/include/tirpc/rpc/rpc.h' : 'Falta /usr/include/tirpc/rpc/rpc.h'
      };
    }
  },
  {
    id: 'rpcbind-service',
    label: 'Servicio rpcbind activo',
    async check() {
      return checkCommand('systemctl is-active rpcbind');
    }
  },
  {
    id: 'venv',
    label: 'Virtualenv .venv',
    async check() {
      return {
        ok: fileExists(VENV_PYTHON),
        detail: fileExists(VENV_PYTHON) ? VENV_DIR : 'Falta crear .venv en la raíz del repo'
      };
    }
  },
  {
    id: 'python-packages',
    label: 'Paquetes Python del práctico',
    async check() {
      if (!fileExists(VENV_PYTHON)) {
        return {ok: false, detail: 'No existe .venv/bin/python'};
      }

      return checkCommand(buildPythonImportCheck());
    }
  },
  {
    id: 'grpc-node-deps',
    label: 'Dependencias npm del cliente gRPC',
    async check() {
      return checkCommand('npm list --depth=0', {cwd: NODE_CLIENT_DIR});
    }
  },
  {
    id: 'grpc-generated',
    label: 'Stubs Python gRPC generados',
    async check() {
      const required = [
        path.join(GRPC_GENERATED_DIR, 'calculator_pb2.py'),
        path.join(GRPC_GENERATED_DIR, 'calculator_pb2_grpc.py'),
        path.join(GRPC_GENERATED_DIR, 'season_pb2.py'),
        path.join(GRPC_GENERATED_DIR, 'season_pb2_grpc.py')
      ];

      const missing = required.filter(item => !fileExists(item));
      return {
        ok: missing.length === 0,
        detail: missing.length === 0 ? GRPC_PYTHON_SERVER_DIR : `Faltan ${missing.length} archivo(s) generado(s)`
      };
    }
  }
];

export async function collectDependencyStatuses() {
  const items = [];

  for (const item of dependencyChecks) {
    const result = await item.check();
    items.push({
      id: item.id,
      label: item.label,
      ok: result.ok,
      detail: result.detail
    });
  }

  const okCount = items.filter(item => item.ok).length;
  return {okCount, total: items.length, items};
}

export const installActions = [
  {
    id: 'install-system-base',
    label: 'Instalar paquetes base Ubuntu/Debian',
    description: 'Instala Java, toolchain RPC, protoc, python venv/pip y Node/npm.',
    mode: 'terminal',
    command: 'sudo apt update && sudo apt install -y default-jdk nodejs npm rpcbind rpcsvc-proto protobuf-compiler build-essential libtirpc-dev python3 python3-pip python3-venv'
  },
  {
    id: 'enable-rpcbind',
    label: 'Habilitar y levantar rpcbind',
    description: 'Necesario para rpcinfo y Sun RPC clásica.',
    mode: 'terminal',
    command: 'sudo systemctl enable --now rpcbind'
  },
  {
    id: 'install-nfs-demo',
    label: 'Instalar paquetes NFS (opcional inciso 9)',
    description: 'Instala nfs-kernel-server y nfs-common para experimentar con rpcinfo + NFS.',
    mode: 'terminal',
    command: 'sudo apt install -y nfs-kernel-server nfs-common'
  },
  {
    id: 'setup-python-env',
    label: 'Crear/actualizar .venv y deps Python',
    description: 'Crea el virtualenv de la raíz e instala protobuf, grpc y rpyc.',
    mode: 'terminal',
    cwd: PROJECT_ROOT,
    command: `python3 -m venv ${shEscape(VENV_DIR)} && ${shEscape(VENV_PYTHON)} -m pip install --upgrade pip && ${shEscape(VENV_PYTHON)} -m pip install protobuf grpcio grpcio-tools rpyc`
  },
  {
    id: 'install-node-client',
    label: 'Instalar deps npm del cliente gRPC',
    description: 'Ejecuta npm install en el cliente Node de gRPC.',
    mode: 'terminal',
    cwd: NODE_CLIENT_DIR,
    command: 'npm install'
  },
  {
    id: 'generate-grpc-stubs',
    label: 'Regenerar stubs Python de gRPC',
    description: 'Ejecuta grpc_tools.protoc para calculator.proto y season.proto.',
    mode: 'terminal',
    cwd: PROJECT_ROOT,
    command: `${shEscape(VENV_PYTHON)} -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/calculator.proto && ${shEscape(VENV_PYTHON)} -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/season.proto`
  },
  {
    id: 'prepare-all-project',
    label: 'Preparar TODO el entorno del proyecto',
    description: 'Instala paquetes base, levanta rpcbind, crea .venv, instala npm deps y genera stubs.',
    mode: 'terminal',
    cwd: PROJECT_ROOT,
    command: 'sudo apt update && sudo apt install -y default-jdk nodejs npm rpcbind rpcsvc-proto protobuf-compiler build-essential libtirpc-dev python3 python3-pip python3-venv && sudo systemctl enable --now rpcbind && python3 -m venv .venv && .venv/bin/python -m pip install --upgrade pip && .venv/bin/python -m pip install protobuf grpcio grpcio-tools rpyc && (cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/node-client && npm install) && .venv/bin/python -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/calculator.proto && .venv/bin/python -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/season.proto'
  }
];
