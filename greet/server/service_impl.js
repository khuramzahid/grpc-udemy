const pb = require('../proto/greet_pb');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

exports.greet = (call, callback) => {
  console.log('Greet was invoked');
  const res = new pb.GreetResponse()
      .setResult(`Hello ${call.request.getFirstName()}`);

  callback(null, res);
};

exports.greetManyTimes = async (call, _) => {
  console.log('GreetManyTimes was invoked');
  const res = new pb.GreetResponse();

  for (let i = 0; i < 10; i++) {
    res.setResult(`Hello ${call.request.getFirstName()} - number ${i}`);
    call.write(res);
    await setTimeoutPromise(0); // wait for 100 milliseconds between each write
  }

  call.end(); // end of streaming
};

exports.longGreet = (call, callback) => {
  console.log('LongGreet was invoked');
  let greet = '';

  call.on('data', (req) => {
    greet += `Hello ${req.getFirstName()}\n`;
  });

  call.on('end', () => {
    const res = new pb.GreetResponse()
      .setResult(greet);

    callback(null, res);
  });
};

exports.greetEveryone = (call, _) => {
  console.log('GreetEveryone was invoked');

  call.on('data', (req) => {
    console.log(`received request ${req}`);
    const res = new pb.GreetResponse()
      .setResult(`Hello ${req.getFirstName()}`);
    
    console.log(`Sending response ${res}`);
    call.write(res);
  });

  call.on('end', () => call.end());
};