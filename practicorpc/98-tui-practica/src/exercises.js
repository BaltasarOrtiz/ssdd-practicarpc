import path from 'node:path';
import {
  GRPC_GENERATED_DIR,
  GRPC_PYTHON_SERVER_DIR,
  NODE_CLIENT_DIR,
  PRACTICO_ROOT,
  PROJECT_ROOT,
  VENV_PYTHON,
  shEscape
} from './utils.js';
import {
  runCapturedCommand,
  runFailureRecipe,
  runServerClientRecipe,
  runTerminalCommand
} from './runner.js';

const paths = {
  nextPrime: path.join(PRACTICO_ROOT, '01-invocacion-remota-rpc', '01-sockets-siguiente-primo'),
  calcsize: path.join(PRACTICO_ROOT, '01-invocacion-remota-rpc', '07-python-calcsize'),
  jsonLint: path.join(PRACTICO_ROOT, '02-json', '13-validacion-jsonlint'),
  jsonParse: path.join(PRACTICO_ROOT, '02-json', '14-json-parse-y-stringify'),
  protobuf: path.join(PRACTICO_ROOT, '02-json', '15-protobuf'),
  sunRpcParity: path.join(PRACTICO_ROOT, '03-programacion-rpc', 'a-par-o-impar'),
  sunRpcCalc: path.join(PRACTICO_ROOT, '03-programacion-rpc', 'b-calculadora'),
  rmiParity: path.join(PRACTICO_ROOT, '04-java-rmi', 'b-paridad-y-calculadora', 'paridad'),
  rmiCalc: path.join(PRACTICO_ROOT, '04-java-rmi', 'b-paridad-y-calculadora', 'calculadora'),
  rmiSeason: path.join(PRACTICO_ROOT, '04-java-rmi', 'd-estaciones'),
  rmiSchedule: path.join(PRACTICO_ROOT, '04-java-rmi', 'e-materias-por-dia'),
  grpcRoot: path.join(PRACTICO_ROOT, '05-grpc', '02-java-rmi-b-y-d-en-grpc'),
  rpycRoot: path.join(PRACTICO_ROOT, '05-grpc', '03-framework-python-rpc', 'rpyc'),
  rpycParity: path.join(PRACTICO_ROOT, '05-grpc', '03-framework-python-rpc', 'rpyc', 'a-paridad'),
  rpycCalc: path.join(PRACTICO_ROOT, '05-grpc', '03-framework-python-rpc', 'rpyc', 'b-calculadora')
};

const rmiParityCompile = 'mkdir -p out && javac -d out src/ar/edu/ssdd/rmi/paridad/*.java';
const rmiCalcCompile = 'mkdir -p out && javac -d out src/ar/edu/ssdd/rmi/calculadora/*.java';
const rmiSeasonCompile = 'mkdir -p out && javac -d out src/ar/edu/ssdd/rmi/estaciones/*.java';
const rmiScheduleCompile = 'mkdir -p out && javac -d out src/ar/edu/ssdd/rmi/materias/*.java';
const sunRpcParityCompile = 'gcc -o paridad_server paridad_rpc_svc.c paridad_server_impl.c -ltirpc -I/usr/include/tirpc && gcc -o paridad_client paridad_rpc_clnt.c paridad_client.c -ltirpc -I/usr/include/tirpc';
const sunRpcCalcCompile = 'gcc -o calculadora_server calculadora_rpc_svc.c calculadora_rpc_xdr.c calculadora_server_impl.c -ltirpc -I/usr/include/tirpc && gcc -o calculadora_client calculadora_rpc_clnt.c calculadora_rpc_xdr.c calculadora_client.c -ltirpc -I/usr/include/tirpc';
const grpcGenerate = `${shEscape(VENV_PYTHON)} -m grpc_tools.protoc -I./protos --python_out=./python-server/generated --grpc_python_out=./python-server/generated ./protos/calculator.proto && ${shEscape(VENV_PYTHON)} -m grpc_tools.protoc -I./protos --python_out=./python-server/generated --grpc_python_out=./python-server/generated ./protos/season.proto`;

function buildPrintf(values) {
  const format = `${values.map(() => '%s').join('\\n')}\\n`;
  const args = values.map(value => shEscape(value)).join(' ');
  return `printf ${shEscape(format)} ${args}`;
}

function buildGrpcCalculatorNodeCommand({operation, op1, op2}) {
  const methodByOperation = {
    sum: 'Sum',
    subtract: 'Subtract',
    divide: 'Divide',
    multiply: 'Multiply'
  };

  const source = `
const path = require('node:path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const def = protoLoader.loadSync(path.join('..', 'protos', 'calculator.proto'), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const proto = grpc.loadPackageDefinition(def).ssdd.practicarpc.grpc;
const client = new proto.CalculatorService('localhost:50051', grpc.credentials.createInsecure());
client.${methodByOperation[operation]}({ op1: ${Number(op1)}, op2: ${Number(op2)} }, (error, response) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log('Resultado:', response.result);
  process.exit(0);
});
`;

  return `node -e ${shEscape(source)}`;
}

function buildGrpcSeasonNodeCommand({day, month}) {
  const source = `
const path = require('node:path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const def = protoLoader.loadSync(path.join('..', 'protos', 'season.proto'), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const proto = grpc.loadPackageDefinition(def).ssdd.practicarpc.grpc;
const client = new proto.SeasonService('localhost:50052', grpc.credentials.createInsecure());
client.GetSeason({ day: ${Number(day)}, month: ${Number(month)} }, (error, response) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log('Estación:', response.season);
  console.log('Mensaje:', response.message);
  process.exit(0);
});
`;

  return `node -e ${shEscape(source)}`;
}

async function compileOrFail(command, cwd, title) {
  const result = await runCapturedCommand(command, {cwd});
  if (result.success) {
    return null;
  }

  return {
    success: false,
    output: `## Error preparando ${title}\n${result.output || `exit=${result.code}`}`
  };
}

async function runSimpleCommand(title, command, cwd, env = {}) {
  const result = await runCapturedCommand(command, {cwd, env});
  return {
    success: result.success,
    output: `## ${title}\n${result.output || 'Sin salida.'}`
  };
}

export const exerciseCategories = [
  {id: 'invocacion', label: 'Invocación remota / RPC'},
  {id: 'json', label: 'JSON / Protobuf'},
  {id: 'rpc-clasica', label: 'Programación RPC clásica'},
  {id: 'java-rmi', label: 'Java RMI'},
  {id: 'grpc', label: 'gRPC / Framework Python RPC'}
];

export const exercises = [
  {
    id: 'socket-next-prime',
    category: 'invocacion',
    title: '1) Sockets — siguiente primo',
    description: 'Levanta el server TCP y consulta el siguiente primo para un entero.',
    prompts: [{name: 'number', label: 'Número entero', type: 'number', defaultValue: '10'}],
    async run(values) {
      return runServerClientRecipe({
        title: 'Sockets — siguiente primo',
        server: {cwd: paths.nextPrime, command: 'python3 next_prime_server.py'},
        client: {
          cwd: paths.nextPrime,
          command: `${buildPrintf([String(values.number)])} | python3 next_prime_client.py`
        }
      });
    }
  },
  {
    id: 'calcsize',
    category: 'invocacion',
    title: '7) Python calcsize',
    description: 'Ejecuta el script de tamaños y alineación.',
    async run() {
      return runSimpleCommand('calcsize', 'python3 calcsize_check.py', paths.calcsize);
    }
  },
  {
    id: 'rpcinfo',
    category: 'invocacion',
    title: '9) rpcinfo -p host',
    description: 'Ejecuta rpcinfo contra el host indicado. La parte NFS queda asistida por el instalador opcional.',
    prompts: [{name: 'host', label: 'Host a consultar', type: 'text', defaultValue: 'localhost'}],
    async run(values) {
      return runSimpleCommand('rpcinfo', `rpcinfo -p ${shEscape(values.host)}`, PROJECT_ROOT);
    }
  },
  {
    id: 'json-validate',
    category: 'json',
    title: '13) Validar JSON',
    description: 'Valida los JSON del práctico con Node.',
    async run() {
      return runSimpleCommand('Validación JSON', 'node validar_json.js', paths.jsonLint);
    }
  },
  {
    id: 'json-parse-stringify',
    category: 'json',
    title: '14) JSON.parse / JSON.stringify',
    description: 'Ejecuta los ejemplos de parseo y serialización.',
    async run() {
      return runSimpleCommand('parse/stringify', 'node parse_stringify_examples.js', paths.jsonParse);
    }
  },
  {
    id: 'protobuf-validate',
    category: 'json',
    title: '15) Validar Protobuf',
    description: 'Valida los .proto con el virtualenv del repo.',
    async run() {
      return runSimpleCommand('Protobuf', `${shEscape(VENV_PYTHON)} validate_protos.py`, paths.protobuf);
    }
  },
  {
    id: 'sunrpc-parity',
    category: 'rpc-clasica',
    title: 'RPC clásica a) Par o impar',
    description: 'Compila y ejecuta el servicio RPC clásico de paridad.',
    prompts: [{name: 'number', label: 'Número entero', type: 'number', defaultValue: '7'}],
    async run(values) {
      const prep = await compileOrFail(sunRpcParityCompile, paths.sunRpcParity, 'RPC clásica paridad');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'RPC clásica paridad',
        server: {cwd: paths.sunRpcParity, command: './paridad_server'},
        client: {
          cwd: paths.sunRpcParity,
          command: `${buildPrintf([String(values.number)])} | ./paridad_client localhost`
        }
      });
    }
  },
  {
    id: 'sunrpc-calculator',
    category: 'rpc-clasica',
    title: 'RPC clásica b) Calculadora',
    description: 'Compila y ejecuta la calculadora Sun RPC.',
    prompts: [
      {
        name: 'operation',
        label: 'Operación',
        type: 'select',
        options: [
          {label: '1 = suma', value: '1'},
          {label: '2 = resta', value: '2'},
          {label: '3 = divide', value: '3'},
          {label: '4 = multiplica', value: '4'}
        ]
      },
      {name: 'op1', label: 'Operando 1', type: 'number', defaultValue: '8'},
      {name: 'op2', label: 'Operando 2', type: 'number', defaultValue: '5'}
    ],
    async run(values) {
      const prep = await compileOrFail(sunRpcCalcCompile, paths.sunRpcCalc, 'RPC clásica calculadora');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'RPC clásica calculadora',
        server: {cwd: paths.sunRpcCalc, command: './calculadora_server'},
        client: {
          cwd: paths.sunRpcCalc,
          command: `${buildPrintf([values.operation, String(values.op1), String(values.op2)])} | ./calculadora_client localhost`
        }
      });
    }
  },
  {
    id: 'rmi-parity',
    category: 'java-rmi',
    title: 'Java RMI b) Paridad',
    description: 'Compila y ejecuta el inciso de paridad con Java RMI.',
    prompts: [{name: 'number', label: 'Número entero', type: 'number', defaultValue: '7'}],
    async run(values) {
      const prep = await compileOrFail(rmiParityCompile, paths.rmiParity, 'Java RMI paridad');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'Java RMI paridad',
        server: {cwd: paths.rmiParity, command: 'java -cp out ar.edu.ssdd.rmi.paridad.ParityServer'},
        client: {
          cwd: paths.rmiParity,
          command: `${buildPrintf([String(values.number)])} | java -cp out ar.edu.ssdd.rmi.paridad.ParityClient localhost`
        }
      });
    }
  },
  {
    id: 'rmi-calculator',
    category: 'java-rmi',
    title: 'Java RMI b) Calculadora',
    description: 'Compila y ejecuta la calculadora RMI local.',
    prompts: [
      {
        name: 'operation',
        label: 'Operación',
        type: 'select',
        options: [
          {label: '1 = suma', value: '1'},
          {label: '2 = resta', value: '2'},
          {label: '3 = divide', value: '3'},
          {label: '4 = multiplica', value: '4'}
        ]
      },
      {name: 'op1', label: 'Operando 1', type: 'number', defaultValue: '8'},
      {name: 'op2', label: 'Operando 2', type: 'number', defaultValue: '5'}
    ],
    async run(values) {
      const prep = await compileOrFail(rmiCalcCompile, paths.rmiCalc, 'Java RMI calculadora');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'Java RMI calculadora',
        server: {cwd: paths.rmiCalc, command: 'java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer'},
        client: {
          cwd: paths.rmiCalc,
          command: `${buildPrintf([values.operation, String(values.op1), String(values.op2)])} | java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient localhost`
        },
        waitMs: 2200
      });
    }
  },
  {
    id: 'rmi-remote-client',
    category: 'java-rmi',
    title: 'Java RMI c) Cliente hacia host remoto',
    description: 'Ejecuta el cliente de calculadora contra otra máquina. El server remoto se levanta fuera de esta sesión.',
    prompts: [
      {name: 'host', label: 'Host/IP del servidor', type: 'text', defaultValue: 'localhost'},
      {
        name: 'operation',
        label: 'Operación',
        type: 'select',
        options: [
          {label: '1 = suma', value: '1'},
          {label: '2 = resta', value: '2'},
          {label: '3 = divide', value: '3'},
          {label: '4 = multiplica', value: '4'}
        ]
      },
      {name: 'op1', label: 'Operando 1', type: 'number', defaultValue: '8'},
      {name: 'op2', label: 'Operando 2', type: 'number', defaultValue: '5'}
    ],
    async run(values) {
      const prep = await compileOrFail(rmiCalcCompile, paths.rmiCalc, 'Java RMI remoto cliente');
      if (prep) {
        return prep;
      }

      return runSimpleCommand(
        'Java RMI cliente remoto',
        `${buildPrintf([values.operation, String(values.op1), String(values.op2)])} | java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient ${shEscape(values.host)}`,
        paths.rmiCalc
      );
    }
  },
  {
    id: 'rmi-remote-server-guide',
    category: 'java-rmi',
    title: 'Java RMI c) Servidor remoto asistido',
    description: 'Compila y lanza el server calculadora listo para otra máquina. Cortalo con Ctrl+C cuando termines.',
    prompts: [{name: 'host', label: 'IP/hostname a publicar en el stub', type: 'text', defaultValue: '127.0.0.1'}],
    async run(values, context) {
      const prep = await compileOrFail(rmiCalcCompile, paths.rmiCalc, 'Java RMI remoto servidor');
      if (prep) {
        return prep;
      }

      return runTerminalCommand(
        `java -Djava.rmi.server.hostname=${shEscape(values.host)} -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer`,
        {cwd: paths.rmiCalc, setRawMode: context.setRawMode}
      );
    }
  },
  {
    id: 'rmi-season',
    category: 'java-rmi',
    title: 'Java RMI d) Estaciones',
    description: 'Compila y ejecuta el inciso de estaciones.',
    prompts: [
      {name: 'day', label: 'Día', type: 'number', defaultValue: '21'},
      {name: 'month', label: 'Mes', type: 'number', defaultValue: '12'}
    ],
    async run(values) {
      const prep = await compileOrFail(rmiSeasonCompile, paths.rmiSeason, 'Java RMI estaciones');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'Java RMI estaciones',
        server: {cwd: paths.rmiSeason, command: 'java -cp out ar.edu.ssdd.rmi.estaciones.SeasonServer'},
        client: {
          cwd: paths.rmiSeason,
          command: `${buildPrintf([String(values.day), String(values.month)])} | java -cp out ar.edu.ssdd.rmi.estaciones.SeasonClient localhost`
        }
      });
    }
  },
  {
    id: 'rmi-schedule',
    category: 'java-rmi',
    title: 'Java RMI e) Materias por día',
    description: 'Compila y ejecuta el inciso de materias por día.',
    prompts: [{name: 'day', label: 'Día a consultar', type: 'text', defaultValue: 'lunes'}],
    async run(values) {
      const prep = await compileOrFail(rmiScheduleCompile, paths.rmiSchedule, 'Java RMI materias');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'Java RMI materias',
        server: {cwd: paths.rmiSchedule, command: 'java -cp out ar.edu.ssdd.rmi.materias.ScheduleServer'},
        client: {
          cwd: paths.rmiSchedule,
          command: `${buildPrintf([values.day])} | java -cp out ar.edu.ssdd.rmi.materias.ScheduleClient localhost`
        }
      });
    }
  },
  {
    id: 'rmi-failure-no-server',
    category: 'java-rmi',
    title: 'Java RMI f) Cliente sin servidor',
    description: 'Muestra qué pasa cuando el cliente intenta invocar sin server disponible.',
    async run() {
      const prep = await compileOrFail(rmiCalcCompile, paths.rmiCalc, 'Java RMI fallos');
      if (prep) {
        return prep;
      }

      return runSimpleCommand(
        'Java RMI sin servidor',
        `${buildPrintf(['1', '8', '5'])} | java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient localhost`,
        paths.rmiCalc
      );
    }
  },
  {
    id: 'rmi-failure-server-drops',
    category: 'java-rmi',
    title: 'Java RMI f) Servidor cae durante la llamada',
    description: 'Levanta el server, inicia el cliente y fuerza la caída del server a mitad de la invocación.',
    async run() {
      const prep = await compileOrFail(rmiCalcCompile, paths.rmiCalc, 'Java RMI caída durante llamada');
      if (prep) {
        return prep;
      }

      return runFailureRecipe({
        title: 'Java RMI caída durante llamada',
        server: {cwd: paths.rmiCalc, command: 'java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer'},
        client: {
          cwd: paths.rmiCalc,
          command: `${buildPrintf(['1', '8', '5'])} | java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient localhost`
        }
      });
    }
  },
  {
    id: 'grpc-calculator',
    category: 'grpc',
    title: 'gRPC 2) Calculadora Python ↔ Node',
    description: 'Regenera stubs, levanta el server Python y ejecuta el cliente Node.',
    prompts: [
      {
        name: 'operation',
        label: 'Operación',
        type: 'select',
        options: [
          {label: 'sum', value: 'sum'},
          {label: 'subtract', value: 'subtract'},
          {label: 'divide', value: 'divide'},
          {label: 'multiply', value: 'multiply'}
        ]
      },
      {name: 'op1', label: 'Operando 1', type: 'number', defaultValue: '8'},
      {name: 'op2', label: 'Operando 2', type: 'number', defaultValue: '5'}
    ],
    async run(values) {
      const prep = await compileOrFail(grpcGenerate, paths.grpcRoot, 'gRPC stubs');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'gRPC calculadora',
        server: {
          cwd: GRPC_PYTHON_SERVER_DIR,
          env: {PYTHONPATH: GRPC_GENERATED_DIR},
          command: `${shEscape(VENV_PYTHON)} calculator_server.py`
        },
        client: {
          cwd: NODE_CLIENT_DIR,
          command: buildGrpcCalculatorNodeCommand(values)
        }
      });
    }
  },
  {
    id: 'grpc-season',
    category: 'grpc',
    title: 'gRPC 2) Estaciones Python ↔ Node',
    description: 'Regenera stubs, levanta el server Python y ejecuta el cliente Node de estaciones.',
    prompts: [
      {name: 'day', label: 'Día', type: 'number', defaultValue: '21'},
      {name: 'month', label: 'Mes', type: 'number', defaultValue: '12'}
    ],
    async run(values) {
      const prep = await compileOrFail(grpcGenerate, paths.grpcRoot, 'gRPC stubs');
      if (prep) {
        return prep;
      }

      return runServerClientRecipe({
        title: 'gRPC estaciones',
        server: {
          cwd: GRPC_PYTHON_SERVER_DIR,
          env: {PYTHONPATH: GRPC_GENERATED_DIR},
          command: `${shEscape(VENV_PYTHON)} season_server.py`
        },
        client: {
          cwd: NODE_CLIENT_DIR,
          command: buildGrpcSeasonNodeCommand(values)
        }
      });
    }
  },
  {
    id: 'rpyc-parity',
    category: 'grpc',
    title: 'Framework Python RPC 3) RPyC paridad',
    description: 'Levanta el servicio RPyC de paridad y corre el cliente.',
    prompts: [{name: 'number', label: 'Número entero', type: 'number', defaultValue: '7'}],
    async run(values) {
      return runServerClientRecipe({
        title: 'RPyC paridad',
        server: {cwd: paths.rpycParity, command: `${shEscape(VENV_PYTHON)} parity_service.py`},
        client: {
          cwd: paths.rpycParity,
          command: `${buildPrintf([String(values.number)])} | ${shEscape(VENV_PYTHON)} parity_client.py`
        }
      });
    }
  },
  {
    id: 'rpyc-calculator',
    category: 'grpc',
    title: 'Framework Python RPC 3) RPyC calculadora',
    description: 'Levanta el servicio RPyC de calculadora y corre el cliente.',
    prompts: [
      {
        name: 'operation',
        label: 'Operación',
        type: 'select',
        options: [
          {label: 'suma', value: 'suma'},
          {label: 'resta', value: 'resta'},
          {label: 'divide', value: 'divide'},
          {label: 'multiplica', value: 'multiplica'}
        ]
      },
      {name: 'op1', label: 'Operando 1', type: 'number', defaultValue: '8'},
      {name: 'op2', label: 'Operando 2', type: 'number', defaultValue: '5'}
    ],
    async run(values) {
      return runServerClientRecipe({
        title: 'RPyC calculadora',
        server: {cwd: paths.rpycCalc, command: `${shEscape(VENV_PYTHON)} calculator_service.py`},
        client: {
          cwd: paths.rpycCalc,
          command: `${buildPrintf([values.operation, String(values.op1), String(values.op2)])} | ${shEscape(VENV_PYTHON)} calculator_client.py`
        }
      });
    }
  }
];

export function listExercisesByCategory(categoryId) {
  return exercises.filter(exercise => exercise.category === categoryId);
}
