const grpc = require('@grpc/grpc-js');
const {SumRequest} = require('../proto/sum_pb');
const { SumServiceClient } = require('../proto/sum_grpc_pb');

function doSum(client) {
  console.log('doSum was invoked');
  const req = new SumRequest()
      .setFirst(1)
      .setSecond(2);

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
  const client = new SumServiceClient('localhost:50051', creds,);

  doSum(client);
}

main();