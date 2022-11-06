

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
    var msg = "Hello World!143";

    channel.assertQueue(queue, {
                //assertQueue checks if Queue doesn't exist then it will create one.
      durable: true
      //Queues can be durable or transient. Metadata of a durable queue is stored on disk, while metadata of a transient queue is stored in memory

    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});