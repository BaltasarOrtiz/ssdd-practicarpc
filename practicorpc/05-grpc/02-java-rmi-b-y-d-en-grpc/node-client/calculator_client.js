const path = require("node:path");
const readline = require("node:readline");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "..", "protos", "calculator.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const proto = grpc.loadPackageDefinition(packageDefinition).ssdd.practicarpc.grpc;
const client = new proto.CalculatorService("localhost:50050", grpc.credentials.createInsecure());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

(async () => {
  const operation = await question("Operación (sum, subtract, divide, multiply): ");
  const op1 = parseInt(await question("Operando 1: "), 10);
  const op2 = parseInt(await question("Operando 2: "), 10);

  const map = {
    sum: "Sum",
    subtract: "Subtract",
    divide: "Divide",
    multiply: "Multiply",
  };

  client[map[operation]]({ op1, op2 }, (error, response) => {
    if (error) {
      console.error("Error gRPC:", error.message);
    } else {
      console.log("Resultado:", response.result);
    }
    rl.close();
  });
})();
