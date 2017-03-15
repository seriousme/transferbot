const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

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
          admin.database().ref('session/' + sessionId).set(data)
          resolve(data)
        }
      })
  })
}

function storeTransAction (body) {
  const data = body.result
  return new Promise((resolve, reject) => {
    getSessionData(body.sessionId).then((session) => {
      if (data.actionIncomplete === false) {
        const account = data.parameters.Account
        var amount = data.parameters.Amount
        if (typeof (amount) === 'object') {
          amount = data.parameters.Amount.amount
        }
        session.transaction = {Account: account, amount: amount}
        admin.database().ref('session/' + body.sessionId).set(session)
      }
      resolve()
    })
  })
}

function bookTransAction (data) {
  return new Promise((resolve, reject) => {
    data.currentAccountBalance -= data.transaction.amount
    if (data.transaction.Account === 'savings account') {
      data.savingsAccountBalance += data.transaction.amount
    }
    data.lastUpdate = Number(new Date())
    data.transaction = null
    admin.database().ref('session/' + data.sessionId).set(data)
    resolve(data)
  })
}

function getBalance (body) {
  return new Promise((resolve, reject) => {
    getSessionData(body.sessionId).then((session) => {
      const data = body.result
      var balance = null
      if (data.parameters.Account === 'current account') {
        balance = session.currentAccountBalance
      }
      if (data.parameters.Account === 'savings account') {
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
  if (action === 'account.transfer.create') {
    storeTransAction(body).then(
      () => {
        response.send(result.fulfillment)
      })
  }
  if (action === 'account.transfer.confirm') {
    getSessionData(body.sessionId).then(bookTransAction).then(
      (data) => {
        response.send({speech: result.fulfillment.speech, data: { transferBot: data }})
      })
  }
  if (action === 'account.balance') {
    getBalance(body).then(
    (balance) => {
      const speech = result.fulfillment.speech.replace('currently not available', balance)
      response.send({ speech: speech })
    }).catch(
      (balance) => {
        response.send(result.fulfillment)
      }
    )
  }
})
