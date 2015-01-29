
Net_delay is a small utility to introduce delay on a tcp connection.

For example, to add 500 ms of delay on each block of data in front of redis :

````
node net_delay.js --listen 0.0.0.0:6380 --upstream 127.0.0.1:6739
````

Normal speed :
````
redis-cli -p 6379 info
````

With delay :
````
redis-cli -p 6379 info
````

Net delay use a REPL, you can dynamically change the delay :
````
> delay_min = 200;
200
> delay_out = 200;
200

````

Unit is milliseconds.

