"use strict";

var http = require('http');
var express = require('express');
var config = require('./config');
var routes = require('./routes');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


var router = express();
var server = http.createServer(router);

router.use(express.static(__dirname + '/client'));

//create one process for each CPU core
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", function(worker, code, signal) {
        cluster.fork();
    });
}
else {
    //do the work
    routes.coordinates(router);

    //create server
    server.listen(config.app.port, config.app.ip, function() {
        console.log('Server running');
    });
}
