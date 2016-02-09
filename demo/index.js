var express      = require('express')
  , https         = require('https')
  , path         = require('path')
  , bodyParser   = require('body-parser')
  , logger       = require('morgan')
  , errorHandler = require('errorhandler')
  , fs           = require('fs')
  ;

var app         = express()
  , privateKey  = fs.readFileSync('sslcert/server.key', 'utf8')
  , certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
  , stripe      = require("stripe")
  ;

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form

app.set('port', process.env.PORT || 443);
app.set('views', path.join(__dirname + '/views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(errorHandler());
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'stripepayment-form demo'
  });
});

app.post('/reg_controller', function(req, res){
  var _stripe = stripe(req.body.publishKey);
  var stripeToken = request.body.stripeToken;

  var charge = _stripe.charges.create({
    amount: request.body.amount, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      return { "error" : err.message }
    }
  });
});

https.createServer({ key: key, cert: certificate}, app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
