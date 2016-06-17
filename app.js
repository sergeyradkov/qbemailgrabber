var http = require('http'),
  express = require('express'),
  app = express(),
  port = process.env.PORT || 8080
  request = require('request'),
  bodyParser = require('body-parser'),
  qs = require('querystring'),
  util = require('util'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  QuickBooks = require('./index'),
  config = require('./config.json')
  captchaUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LeWCCETAAAAAGtTk0MKqtHyPEyNZtfRpqND-uV1&response='

// GENERIC EXPRESS CONFIG
app.use(express.static(__dirname + '/public'))
app.set('port', port)
app.set('views', 'views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('brad'))
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }))

var consumerKey = config.qb
    consumerSecret = 'kayCfBs78Ce4zYrS4euUx9PVha4O18IInYgRlVvB'
    ot = 'qyprdayqvuyFm1IojfHE85vWjDKaP6BDvORHUyI9936xXtHk',
    ots = 'T4f6y6c9mgUhindX7q7mXssCZ2CvTeRMY1BnrdfE',
    realmId = '123145721128202'
  // realmId = secret.realmId;

function QBO(req, res, consumerKey, consumerSecret) {
  var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback: 'http://localhost:' + port + '/callback/',
      consumer_key: consumerKey,
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

app.get('/callback', function (req, res) {
  var postBody = {
    url: QuickBooks.ACCESS_TOKEN_URL,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: req.query.oauth_token,
      token_secret: req.session.oauth_token_secret,
      verifier: req.query.oauth_verifier,
      realmId: req.query.realmId
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
      true) // turn debugging on

    // test out account access
    qbo.findAccounts(function (_, accounts) {
      accounts.QueryResponse.Account.forEach(function (account) {
        console.log('QBO is Ready')
      })
      res.redirect('/ready')
    })
  })
})

app.get('/lookup', function (req, res) {
  findCustomerByPhone(req.query.phoneNumber, function (customer) {
    res.send(customer)
  })
})

app.post('/updated', function (req, res) {
  updateCuctomerByPhone(req.body, function (customer) {
    res.send(200);
  })
})


app.get('/start', function (req, res) {
  console.log('authenticating connection, please wait.....')
  QBO(req, res, consumerKey, consumerSecret)
})

app.get('/ready', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

function updateCuctomerByPhone(customer, callback) {

  var qbo = getQbo();
  delete customer.captchaResponse
  delete customer.captchaUrl

qbo.updateCustomer(customer, function (err, customer) {
    if (err) console.log(err)
    if(callback && typeof callback == 'function'){
      callback(customer)
    }
  })
}

function findCustomerByPhone(phone, callback) {
  var qbo = getQbo()
  qbo.findCustomers([
    { field: 'fetchAll', value: true },
  ], function (e, res) {
    var customer = res.QueryResponse.Customer.find(x => x.PrimaryPhone && x.PrimaryPhone.FreeFormNumber == phone);
    callback(customer);
  })
}

var _qbo
function getQbo() {
  if (!_qbo) {
    _qbo = new QuickBooks(consumerKey,
      consumerSecret,
      ot,
      ots,
      realmId,
      true, // use the Sandbox
      true) // turn debugging on
  }
  return _qbo
}

// THE CAPTURE VERIFICATION PART

app.post('/', function (req, res) {
  checkCaptcha(req.body.captchaResponse, function (response) {
    if (response.success) {
      res.send('WOOT! you are not a robot')
    } else {
      res.send('BAD! you are a robot')
    }
  })
})

var checkCaptcha = function (captchaResponse, cb) {
  request.get(captchaUrl + captchaResponse, function (err, response, body) {
    if (err) {
      console.log('error: ', err)
    } else {
      return cb(JSON.parse(body))
    }
  })
}


// TWILIO PART

var ACCOUNT_SID = 'AC21e725be2493dab86257bb53be063985';
var AUTH_TOKEN = '937f4c9d827cf744030aa651ef43bc98';
var myNumber = '+12085059247';
var sendNumber = '+12082839080';


//require the Twilio module and create a REST client
var client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

app.post('/calling', function(req, res){

  client.sendMessage({

      to: sendNumber, // Any number Twilio can deliver to
      from: myNumber, // A number you bought from Twilio and can use for outbound communication
      body: "Hello Jay" // body of the SMS message

  }, function(err, responseData) {

      if (!err) { 
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
      }
      res.send({err: err, response: responseData})
  });
})

// END OF TWILIO

app.listen(port, function () {
  console.log('Express server listening on port ' + app.get('port'))
})