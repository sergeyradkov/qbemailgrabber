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
  JSData = require('js-data'),
	DSNedbAdapter = require('js-data-nedb'),
  config = require('config-json');

  // GENERIC EXPRESS CONFIG
app.use(express.static(__dirname + '/public'))
app.set('port', port)
app.set('views', 'views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('brad'))
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }))

// JS DATA DB

var store = new JSData.DS();
var adapter = new DSNedbAdapter();
store.registerAdapter('nedb', adapter, { default: true });

var Users = store.defineResource({
    name: 'user',
    filepath: __dirname+'/dots/users.db'
})

var TwilioAccount = store.defineResource({
    name: 'twilioaccount',
    filepath: __dirname+'/dots/twilio.db'
})

// Users.create({
// "id":"ab23da75-db92-46d5-ac93-14fe0c529a1d",
// "company":"SandBox",
// "consumerKey":"qyprdTjD18ZhGt5PwnU2jvy6lMn69O",
// "consumerSecret": "kayCfBs78Ce4zYrS4euUx9PVha4O18IInYgRlVvB",
// "ot": "qyprdayqvuyFm1IojfHE85vWjDKaP6BDvORHUyI9936xXtHk",
// "ots":"T4f6y6c9mgUhindX7q7mXssCZ2CvTeRMY1BnrdfE",
// "realmId":"123145721128202",
// })



    // getSports = function(req, res, next) {
    //     if (req.params.id) {
    //         getSport(req.params.id).then(function(sport) {
    //             return res.json(sport)
    //         })
    //     } else {
    //         getSports(req.query).then(function(sports) {
    //             return res.json(sports);
    //         })
    //     }
    // }


// GENERIC KEYS
config.load('./dots/qbconfig.json');
var consumerKey = config.get('consumerKey'),
  consumerSecret = config.get('consumerSecret'),
  ot = config.get('ot'),
  ots = config.get('ots'),
  realmId = config.get('realmId');
config.load('./dots/twconfig.json');
var ACCOUNT_SID = config.get('AccountSid'),
  AUTH_TOKEN = config.get('authToken'),
  TW_PHONE = config.get('twilioPhone');




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
    // console.log(requestToken)
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
    // console.log(accessToken)
    // console.log(postBody.oauth.realmId)

    // save the access token somewhere on behalf of the logged in user
    qbo = new QuickBooks(consumerKey,
      consumerSecret,
      accessToken.oauth_token,
      accessToken.oauth_token_secret,
      postBody.oauth.realmId,
      true, // use the Sandbox
      true) // turn debugging on
  })
})

app.get('/lookup', function (req, res) {
  findCustomerByPhone(req.query.compId, req.query.phoneNumber, function (customer) {
    res.send(customer)
  })
})

app.post('/updated', function (req, res) {
  updateCuctomerByPhone(req.body, function (customer) {
    res.send(200);
  })
})

// app.get('/start', function (req, res) {
//   console.log('authenticating connection, please wait.....')
//   QBO(req, res, consumerKey, consumerSecret)
// })

app.get('/ready', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

function updateCuctomerByPhone(customer, callback) {

  var qbo = getQbo();

  qbo.updateCustomer(customer, function (err, customer) {
    if (err) console.log(err)
    if (callback && typeof callback == 'function') {
      callback(customer)
    }
  })
}

function findCustomerByPhone(id, phone, callback) {
  getQbo(id, function(qbo){

  qbo.findCustomers([
    { field: 'fetchAll', value: true },
  ], function (e, res) {
      var customer = res.QueryResponse.Customer.find(x => x.PrimaryPhone && x.PrimaryPhone.FreeFormNumber.replace(/[^\d]/g, "") == phone.replace(/[^\d]/g, ""));
      callback(customer);
    })
  })
}

app.post('/users', function(req, res){
  Users.create(req.body.user).then(function(user){
    res.send({message: `Successfully created your account. Please direct all of your customers to blah.com/?compId=`+ user.id})
  })
})


var _qbo
function getQbo(id,cb) {
  var compId = id;
  // var compId = "ab23da75-db92-46d5-ac93-14fe0c529a1d";

  Users.find(compId).then(function(user){
  var consumerKey = user.consumerKey;
  var consumerSecret = user.consumerSecret;
  //get ConsumerKey and Secret from compId

  
    _qbo = new QuickBooks(consumerKey, consumerSecret,ot,ots, realmId,
      true, // use the Sandbox
      true) // turn debugging on
  
    cb(_qbo)
  })
}

// TWILIO PART
app.post('/sms', function (req, res) {
  var TW_SN = "+1" + req.body.PrimaryPhone.FreeFormNumber.replace(/[^\d]/g, ""); // customer number for sms
  var TW_MES = Math.floor(Math.random() * 9000) + 1000;
  client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
  client.sendMessage({ to: TW_SN, from: TW_PHONE, body: TW_MES},
  function (err, responseData) {
    if (!err) {
      console.log(responseData.from);
      console.log(responseData.body);
    }
    res.send({ err: err, response: TW_MES })
  });
})
// END OF TWILIO

app.listen(port, function () {
  console.log('Express server listening on port ' + app.get('port'))
})

