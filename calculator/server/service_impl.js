const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/primes_pb');
const { AverageResponse } = require('../proto/average_pb');
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

exports.average = async (call, callback) => {
  console.log('Average was invoked');
  let aggregator = 0.0;
  let count = 0;

  call.on('data', (req) => {
    aggregator += parseInt(req.getNumber());
    count += 1;
  });

  call.on('end', () => {
    const res = new AverageResponse()
      .setResult(aggregator/count);

    callback(null, res);
  });
};