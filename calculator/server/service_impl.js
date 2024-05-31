const { SumResponse } = require('../proto/sum_pb');

exports.sum = (call, callback) => {
  console.log('Sum was invoked');
  const answer = parseInt(call.request.getFirstNumber()) + parseInt(call.request.getSecondNumber());
  const res = new SumResponse()
      .setResult(answer);

  callback(null, res);
};