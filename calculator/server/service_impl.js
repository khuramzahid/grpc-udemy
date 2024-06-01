const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/primes_pb');
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