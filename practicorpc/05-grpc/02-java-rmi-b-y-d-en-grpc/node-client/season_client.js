const path = require("node:path");
const readline = require("node:readline");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "..", "protos", "season.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const proto = grpc.loadPackageDefinition(packageDefinition).ssdd.practicarpc.grpc;
const client = new proto.SeasonService("localhost:50052", grpc.credentials.createInsecure());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

(async () => {
  const day = parseInt(await question("Día: "), 10);
  const month = parseInt(await question("Mes: "), 10);

  client.GetSeason({ day, month }, (error, response) => {
    if (error) {
      console.error("Error gRPC:", error.message);
    } else {
      console.log("Estación:", response.season);
      console.log("Mensaje:", response.message);
    }
    rl.close();
  });
})();
