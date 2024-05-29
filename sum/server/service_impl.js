const pb = require('../proto/sum_pb');

exports.sum = (call, callback) => {
  console.log('Sum was invoked');
  const answer = parseInt(call.request.getFirst()) + parseInt(call.request.getSecond());
  const res = new pb.SumResponse()
      .setResult(answer);

  callback(null, res);
};