// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


/*
User stories:

    1. I can get the IP address, preferred languages (from header Accept-Language) and system infos (from header User-Agent) for my device.

Example usage:

    [base_url]/api/whoami

Example output:

    {"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5","software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}

*/
app.route("/")
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});


app.route('/api/whoami')
  .get(function (req, res){
    var result = { ipaddress: null,
                 language: null,
                 software: null,
                 host: null };
  
    //IP address
    //based on: https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
    /*var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function(ifname){
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log(ifname + ':' + alias, iface.address);
          result.ipaddress = iface.address;
        } else {
          // this interface has only one ipv4 adress
          console.log(ifname, iface.address);
          result.ipaddress = iface.address;
        }
        ++alias;
      });
    });*/
    //helped: http://expressjs.com/en/api.html#req.ip
    result.ipaddress = req.ip;
  
    //preferred languages (from header Accept-Language)
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
    //helped: http://expressjs.com/en/api.html#req.acceptsLanguages
    //last that helped: https://devhints.io/express
    result.language = req.headers['accept-language'];
  
    //system infos (from header User-Agent) 
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
    result.software = req.headers['user-agent'];
  
    //final result
    res.json(result);
});
  


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});