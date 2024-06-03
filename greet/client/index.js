const grpc = require('@grpc/grpc-js');
const {GreetRequest} = require('../proto/greet_pb');
const { GreetServiceClient } = require('../proto/greet_grpc_pb');

function doGreet(client) {
  console.log('doGreet was invoked');
  const req = new GreetRequest()
      .setFirstName('Clement');

  client.greet(req, (err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Greet: ${res.getResult()}`);
    client.close();
  });
}

async function doGreetManyTimes(client) {
  console.log('doGreetManyTimes was invoked');

  const req = new GreetRequest()
    .setFirstName('Clement');
  const call = await client.greetManyTimes(req);

  call.on('data', (res) => {
    console.log(`GreetManyTimes: ${res.getResult()}`);
  });
}

function doLongGreet(client) {
  console.log('doLongGreet was invoked');

  const names = ['Clement', 'Marie', 'Test'];
  const call = client.longGreet((err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`LongGreet: ${res.getResult()}`);
  });

  names.map((name) => {
    return new GreetRequest().setFirstName(name);
  }).forEach((req) => call.write(req));
  call.end();
}

function doGreetEveryone(client) {
  console.log('doGreetEveryone was invoked');
  const names = ['Clement', 'Marie', 'Test'];
  const call = client.greetEveryone();

  call.on('data', (res) => {
    console.log(`GreetEveryone: ${res.getResult()}`);
  });

  names.map((name) => {
    return new GreetRequest().setFirstName(name);
  }).forEach((req) => call.write(req));
  call.end();
}

async function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new GreetServiceClient('localhost:50051', creds,);

  // doGreet(client);
  // await doGreetManyTimes(client);
  // doLongGreet(client);
  doGreetEveryone(client);
}

main();