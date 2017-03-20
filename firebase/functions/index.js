const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const staticData = {
  'en': {
    'currentAccount': 'current account',
    'savingsAccount': 'savings account',
    'placeholder': 'currently not available',
    'currency': ''
  },
  'nl': {
    'currentAccount': 'betaalrekening',
    'savingsAccount': 'spaarrekening',
    'placeholder': 'niet beschikbaar',
    'currency': ' Euro'
  }
}

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//

function getSessionData (sessionId) {
  return new Promise((resolve, reject) => {
    admin.database().ref('session/' + sessionId).once('value').then(
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          resolve(data)
        } else {
          const now = Number(new Date())
          const data = {
            currentAccountBalance: 1000,
            savingsAccountBalance: 0,
            transaction: {},
            lastUpdate: now,
            sessionId: sessionId
          }
          resolve(data)
        }
      })
  })
}

function bookTransAction (body) {
  return new Promise((resolve, reject) => {
    getSessionData(body.sessionId).then((session) => {
      const data = body.result
      const account = data.parameters.Account
      var amount = data.parameters.Amount
      if (typeof (amount) === 'object') {
        amount = data.parameters.Amount.amount
      }
      session.currentAccountBalance -= amount
      if (account === staticData[body.lang].savingsAccount) {
        session.savingsAccountBalance += amount
      }
      data.lastUpdate = Number(new Date())
      admin.database().ref('session/' + body.sessionId).set(session)
      resolve(session)
    })
  })
}

function getBalance (body) {
  return new Promise((resolve, reject) => {
    getSessionData(body.sessionId).then((session) => {
      const data = body.result
      var balance = null
      if (data.parameters.Account === staticData[body.lang].currentAccount) {
        balance = session.currentAccountBalance
      }
      if (data.parameters.Account === staticData[body.lang].savingsAccount) {
        balance = session.savingsAccountBalance
      }
      if (balance !== null) {
        resolve(balance)
      } else {
        reject()
      }
    })
  })
}

exports.transferBot = functions.https.onRequest((request, response) => {
  const body = request.body
  const result = body.result
  const action = result.action

  if (action === 'account.transfer.confirm') {
    bookTransAction(body).then(
      (data) => {
        response.send({speech: result.fulfillment.speech, data: { transferBot: data }})
      })
  }
  if (action === 'account.balance') {
    getBalance(body).then(
    (balance) => {
      const speech = result.fulfillment.speech.replace(staticData[body.lang].placeholder, balance) + staticData[body.lang].currency
      response.send({ speech: speech })
    }).catch(
      (balance) => {
        response.send(result.fulfillment)
      }
    )
  }
})
