var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var system = require('child_process');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.use(express.static('resources'));

// Allow cross-origin reqs
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://apchecker-astrocb.rhcloud.com');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

server.listen(app.get('port'), app.get('ip'), function() {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'), app.get('port'));
});

function getReport(user, pass) {
    // Grab report with PhantomJS (see phantom-scripts/report.js for details)
    system.exec("$OPENSHIFT_PHANTOMJS_DIR/usr/phantomjs phantom-scripts/report.js " + user + " " + pass, function(error, stdout, stderr) {
        console.log(stdout);
        var filename = user + ".png";
        app.get("/" + filename, function(req, res) {
            res.sendfile('reports/' + filename);
        })
        io.emit("reportLoaded", {
            filename: filename
        });
    });
}

io.on("connection", function(socket) {
    socket.on("userData", function(creds) {
        // User credentials received
        getReport(creds.user, creds.password);
    });
});
