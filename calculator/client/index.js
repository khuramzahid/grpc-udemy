const grpc = require('@grpc/grpc-js');
const { SumRequest } = require('../proto/sum_pb');
const { CalculatorServiceClient } = require('../proto/calculator_grpc_pb');

function doSum(client) {
  console.log('doSum was invoked');
  const req = new SumRequest()
      .setFirstNumber(1)
      .setSecondNumber(1);

  client.sum(req, (err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Sum: ${res.getResult()}`);
    client.close();
  });
}

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient('localhost:50051', creds,);

  doSum(client);
}

main();