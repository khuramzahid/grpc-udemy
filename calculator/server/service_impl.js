const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/primes_pb');
const { AvgResponse } = require('../proto/avg_pb');
const { MaxResponse } = require('../proto/max_pb');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

exports.sum = (call, callback) => {
  console.log('Sum was invoked');
  const answer = parseInt(call.request.getFirstNumber()) + parseInt(call.request.getSecondNumber());
  const res = new SumResponse()
      .setResult(answer);

  callback(null, res);
};

exports.primes = async (call, _) => {
  console.log('Primes was invoked');
  let number = parseInt(call.request.getNumber());
  let divisor = 2;
  const res = new PrimeResponse();
  while (number > 1) {
    if(number % divisor == 0) {
      res.setResult(divisor);
      call.write(res);
      number = number / divisor;
      await setTimeoutPromise(0);
    }
    else {
      ++divisor;
    }
  }

  call.end();
};

exports.avg = async (call, callback) => {
  console.log('Avg was invoked');
  let count = 0.0;
  let total = 0.0;

  call.on('data', (req) => {
    total += req.getNumber();
    ++count;
  });

  call.on('end', () => {
    const res = new AvgResponse()
      .setResult(total / count);

    callback(null, res);
  });
};

exports.max = (call, _) => {
  console.log('Max was invoked');
  let max = 0;
  call.on('data', (req) => {
    console.log(`received request ${req}`);
    if(req.getNumber() > max) {
      max = req.getNumber();
      const res = new MaxResponse()
        .setResult(max);
      console.log(`Sending response ${res}`);

      call.write(res);
    }
  });

  call.on('end', () => call.end());
};