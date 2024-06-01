const grpc = require('@grpc/grpc-js');
const { SumRequest } = require('../proto/sum_pb');
const { PrimeRequest } = require('../proto/primes_pb');
const { AverageRequest } = require('../proto/average_pb');
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

async function doPrimes(client) {
  console.log('doPrimes was invoked');
  const req = new PrimeRequest()
    .setNumber(12390392840);

  const call = await client.primes(req);

  call.on('data', (res) => {
    console.log(`Primes: ${res.getResult()}`);
  });
}

function doAverage(client) {
  console.log('doAverage was invoked');
  const numbers = [1, 2, 3, 4];
  const call = client.average((err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Average: ${res.getResult()}`);
  });

  numbers.map((number) => {
    return new AverageRequest().setNumber(number);
  }).forEach((req) => call.write(req));
  call.end();
}

async function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient('localhost:50051', creds,);

  // doSum(client);
  // await doPrimes(client);
  doAverage(client);
}

main();