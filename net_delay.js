var net = require('net'),
  repl = require('repl'),
  argv = require('optimist').argv;

var listen = argv.listen;
var upstream = argv.upstream;

var syntax = 'Args : --listen 0.0.0.0:6545 --upstream 127.0.0.1:6379';

if (!listen || !upstream) {
  console.log(syntax);
  process.exit(1);
}

var r = repl.start({
  prompt: '> ',
});

r.context.delay_in = argv.delay_in || 500;
r.context.delay_out = argv.delay_out || 500;

listen = listen.split(':');
upstream = upstream.split(':');

var socket = net.createServer(function(c) {
  var client = net.createConnection({host: upstream[0], port: upstream[1]});
  var queue_in = [];
  var queue_out = [];
  client.on('error', function(err) {
    console.log(err);
    c.end();
  });
  c.on('error', function(err) {
    console.log(err);
    client.end();
  });
  c.on('data', function(b) {
    queue_out.push(b);
    setTimeout(function() {
      var bb = queue_out.pop();
      if (bb) {
        client.write(bb);
      }
    }, r.context.delay_out);
  });
  c.on('end', function() {
    client.end();
    console.log('End of connection');
  });
  client.on('data', function(b) {
    queue_in.push(b);
    setTimeout(function() {
      var bb = queue_in.pop();
      if (bb) {
        c.write(bb);
      }
    }, r.context.delay_in);
  });
  client.on('connect', function() {
    console.log('Connected to', upstream[0] + ':' + upstream[1]);
  });
});

socket.listen(listen[1], listen[0]);

socket.on('error', function(err) {
  console.log(err);
});

console.log('Listening on', listen[0] + ':' + listen[1], 'forwarding to', upstream[0] + ':' + upstream[1]);

