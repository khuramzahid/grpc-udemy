const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/prime_pb');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

exports.sum = (call, callback) => {
  console.log('Sum was invoked');
  const answer = parseInt(call.request.getFirstNumber()) + parseInt(call.request.getSecondNumber());
  const res = new SumResponse()
      .setResult(answer);

  callback(null, res);
};

exports.prime = async (call, _) => {
  console.log('Prime was invoked');
  const res = new PrimeResponse();

  let num = parseInt(call.request.getNumber());
  let factor = 2;
  while (num != 1) {
    if(num % factor == 0) {
      res.setFactor(factor);
      num = num / factor;
      call.write(res);
      await setTimeoutPromise(0); // wait for 100 milliseconds between each write
    }
    else {
      factor += 1;
    }
  }

  call.end(); // end of streaming
};