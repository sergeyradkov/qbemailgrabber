var http         = require('http'),
    express      = require('express'),
    app          = express(),
    port         = process.env.PORT || 8080;
    request      = require('request'),
    bodyParser   = require('body-parser'),
    qs           = require('querystring'),
    util         = require('util'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    QuickBooks   = require('./index')
    captchaUrl ='https://www.google.com/recaptcha/api/siteverify?secret=6LeWCCETAAAAAGtTk0MKqtHyPEyNZtfRpqND-uV1&response=';

// GENERIC EXPRESS CONFIG
    app.use(express.static(__dirname + '/public'));
    app.set('port', port)
    app.set('views', 'views')
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser('brad'))
    app.use(session({resave: false, saveUninitialized: false, secret: 'smith'}));
    

var consumerKey    = 'qyprdTjD18ZhGt5PwnU2jvy6lMn69O',
    consumerSecret = 'kayCfBs78Ce4zYrS4euUx9PVha4O18IInYgRlVvB';

function QBO (req, res, consumerKey, consumerSecret){
  var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback:        'http://localhost:' + port + '/callback/',
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret
    }
  }
  request.post(postBody, function (e, r, data) {
    var requestToken = qs.parse(data)
    req.session.oauth_token_secret = requestToken.oauth_token_secret
    console.log(requestToken)
    res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
  })
  
}

app.get('/callback', function(req, res) {
  var postBody = {
    url: QuickBooks.ACCESS_TOKEN_URL,
    oauth: {
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret,
      token:           req.query.oauth_token,
      token_secret:    req.session.oauth_token_secret,
      verifier:        req.query.oauth_verifier,
      realmId:         req.query.realmId
    }
  }
  request.post(postBody, function (e, r, data) {
    var accessToken = qs.parse(data)
    console.log(accessToken)
    console.log(postBody.oauth.realmId)

    // save the access token somewhere on behalf of the logged in user
    qbo = new QuickBooks(consumerKey,
                         consumerSecret,
                         accessToken.oauth_token,
                         accessToken.oauth_token_secret,
                         postBody.oauth.realmId,
                         true, // use the Sandbox
                         true); // turn debugging on

    // test out account access
    qbo.findAccounts(function(_, accounts) { 
      accounts.QueryResponse.Account.forEach(function(account) {
        console.log("QBO is Ready")
      })
        res.redirect('/ready');
    })
  })
})

app.get('/lookup', function(req, res){
  console.log('did I get a phone number?', req.query.phoneNumber)
  console.log('Do I still have qbo?', qbo)
  res.send({member: {id: 123456789, displayName: 'My Fake Member'}})
})

app.get('/customer', function(req, res){
  console.log('did I get a customer Id?', req.query.id)
  res.send({customer: {id: 123456789, displayName: 'My Fake Member', phoneNumber: 1234567890}})
})

app.get('/start', function(req,res){
  console.log('authenticating connection, please wait.....')
  QBO(req, res, consumerKey, consumerSecret);
})

app.get('/ready', function(req, res){
  res.sendFile(__dirname+'/public/index.html')
})



// THE CAPTURE VERIFICATION PART

app.post('/', function(req, res){
  checkCaptcha(req.body.captchaResponse, function(response){
    console.log(response.success);
  if(response.success){
    res.send("WOOT! you are not a robot");
  } else {
    res.send("BAD! you are a robot");
  }
  });
});

var checkCaptcha = function(captchaResponse, cb){
  request.get(captchaUrl + captchaResponse, function(err, response, body){
    if(err){
      console.log("error: ", err);
    } else {
      console.log(body);
      return cb(JSON.parse(body));
    }
  });
};

app.listen(port, function(){
  console.log('Express server listening on port ' + app.get('port'))
});
/*
// INSERT YOUR CONSUMER_KEY AND CONSUMER_SECRET HERE

var consumerKey    = 'qyprdTjD18ZhGt5PwnU2jvy6lMn69O',
    consumerSecret = 'kayCfBs78Ce4zYrS4euUx9PVha4O18IInYgRlVvB'

app.get('/',function(req,res){
  res.redirect('/start');
})

app.get('/start', function(req, res) {
  res.render(__dirname+'/views/intuit.ejs', {locals: {port:port, appCenter: QuickBooks.APP_CENTER_BASE}})
})

app.get('/requestToken', function(req, res) {
  var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback:        'http://localhost:' + port + '/callback/',
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret
    }
  }
  request.post(postBody, function (e, r, data) {
    var requestToken = qs.parse(data)
    req.session.oauth_token_secret = requestToken.oauth_token_secret
    console.log(requestToken)
    res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
  })
})



*/