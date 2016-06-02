var QuickBooks = require('node-quickbooks')

var qbo = new QuickBooks(consumerKey,
                         consumerSecret,
                         oauthToken,
                         oauthTokenSecret,
                         realmId,
                         false, // don't use the sandbox (i.e. for testing)
                         true); // turn debugging on

qbo.createAttachable({Note: 'My File'}, function(err, attachable) {
  if (err) console.log(err)
  else console.log(attachable.Id)
})

qbo.getBillPayment(42, function(err, billPayment) {
  console.log(billPayment)
})

qbo.updateCustomer({
  Id: 42,
  SyncToken: 1,
  sparse: true,
  PrimaryEmailAddr: {Address: 'customer@example.com'}
}, function(err, customer) {
  if (err) console.log(err)
  else console.log(customer)
})

qbo.deleteAttachable(42, function(err, attachable) {
  if (err) console.log(err)
  else console.log(attachable)
}))

qbo.findAccounts({
  AccountType: 'Expense',
  desc: 'MetaData.LastUpdatedTime',
  limit: 5,
  offset: 5
  }, function(err, accounts) {
  accounts.QueryResponse.Account.forEach(function(account) {
    console.log(account.Name)
  })
})

qbo.reportBalanceSheet({department: '1,4,7'}, function(err, balanceSheet) {
  console.log(balanceSheet)
})

qbo.upload(
  fs.createReadStream('contractor.jpg'),
  'Invoice',
  40,
  function(err, data) {
    console.log(err)
    console.log(data)
  })