var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'KRM34';

    channel.assertQueue(queue, {
        //assertQueue checks if Queue doesn't exist then it will create one.
      durable: true
      //Queues can be durable or transient. 
      //Metadata of a durable queue is stored on disk, while metadata of a transient queue is stored in memory
    });
    channel.prefetch(1);
    //The channel prefetch value defines the max number of unacknowledged deliveries that are permitted on a channel.
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    
    channel.consume(queue, function(msg) {
    //The BlockingChannel.consume method is a generator that will return a tuple of method, properties and body.

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, 5 * 1000);
    }, {
      noAck: false
    });
  });
});
