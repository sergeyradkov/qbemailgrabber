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
  secret = require('./config')
  captchaUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LeWCCETAAAAAGtTk0MKqtHyPEyNZtfRpqND-uV1&response='

// GENERIC EXPRESS CONFIG
app.use(express.static(__dirname + '/public'))
app.set('port', port)
app.set('views', 'views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('brad'))
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }))

var consumerKey = 'qyprdTjD18ZhGt5PwnU2jvy6lMn69O',
  consumerSecret = 'kayCfBs78Ce4zYrS4euUx9PVha4O18IInYgRlVvB'
  ot = 'qyprdayqvuyFm1IojfHE85vWjDKaP6BDvORHUyI9936xXtHk',
  ots = 'T4f6y6c9mgUhindX7q7mXssCZ2CvTeRMY1BnrdfE',
  // realmId = '123145721128202'
  realmId = secret.realmId;

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

app.listen(port, function () {
  console.log('Express server listening on port ' + app.get('port'))
})

// TWILIO PART

var ACCOUNT_SID = 'AC48148f3f2d267b5bb05f41ba082bdf41';
var AUTH_TOKEN = 'b2bb51ba7eaf8f7d4bf4d0504efc049d';
// var myNumber = '+12085059247';
var myNumber = "+15005550006";
var sendNumber = '+12082839080';

//require the Twilio module and create a REST client
var client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

app.post('/calling', function(req, res){
  //Send an SMS text message
  client.sendMessage({

      to: req.body.sendNumber, // Any number Twilio can deliver to
      from: myNumber, // A number you bought from Twilio and can use for outbound communication
      body: 'Hello word' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."

      }
      res.send({err: err, response: responseData})
  });

})


// //Place a phone call, and respond with TwiML instructions from the given URL
// client.makeCall({

//     to:'+16515556677', // Any number Twilio can call
//     from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
//     url: 'http://www.example.com/twiml.php' // A URL that produces an XML document (TwiML) which contains instructions for the call

// }, function(err, responseData) {

//     //executed when the call has been initiated.
//     console.log(responseData.from); // outputs "+14506667788"

// });
