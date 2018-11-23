const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { dialogflow } = require("actions-on-google");
const app = dialogflow();

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });
const db = firestore.collection("session");

const localeData = {
  en: {
    currentAccount: "current account",
    savingsAccount: "savings account",
    notAvailable: "currently not available",
    currency: "dollar"
  },
  nl: {
    currentAccount: "betaalrekening",
    savingsAccount: "spaarrekening",
    notAvailable: "niet beschikbaar",
    currency: "euro"
  }
};

function getSessionData(sessionId) {
  return new Promise((resolve, reject) => {
    db.doc(sessionId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          resolve(data);
        } else {
          const data = {
            currentAccountBalance: 1000,
            savingsAccountBalance: 0,
            transaction: {},
            sessionId: sessionId
          };
          resolve(data);
        }
      })
      .catch(err => {
        console.log("getSessionData", err);
        reject();
      });
  });
}

function bookTransAction(conv, params, languageCode) {
  const sessionId = conv.body.session.replace(/.+\//, "");
  const account = params.Account;
  const amount = params.Amount.amount;
  const { fulfillmentText } = conv.body.queryResult;
  const locale = localeData[languageCode];
  console.log(sessionId, account, amount, fulfillmentText, languageCode);
  return getSessionData(sessionId)
    .then(session => {
      session.currentAccountBalance -= amount;
      if (account === locale.savingsAccount) {
        session.savingsAccountBalance += amount;
      }
      db.doc(sessionId)
        .set(session)
        .then(data => {
          conv.data = { transferBot: data };
          conv.ask(fulfillmentText);
        });
    })
    .catch(err => console.log("bookTransAction", err));
}

function getBalance(conv, params, languageCode) {
  const sessionId = conv.body.session.replace(/.+\//, "");
  const account = params.Account;
  const { fulfillmentText } = conv.body.queryResult;
  const locale = localeData[languageCode];
  console.log(sessionId, account, fulfillmentText, languageCode);
  return getSessionData(sessionId).then(session => {
    var balance = null;
    if (account === locale.currentAccount) {
      balance = session.currentAccountBalance;
    }
    if (account === locale.savingsAccount) {
      balance = session.savingsAccountBalance;
    }
    if (balance !== null) {
      conv.ask(
        fulfillmentText.replace(
          locale.notAvailable,
          `${balance} ${locale.currency}`
        )
      );
    } else {
      conv.ask(fulfillmentText);
    }
  });
}

app.intent("Confirm transfer", (conv, params) => {
  return bookTransAction(conv, params, "en");
});

app.intent("Bevestig overboeking", (conv, params) => {
  return bookTransAction(conv, params, "nl");
});

app.intent("Account Balance", (conv, params) => {
  return getBalance(conv, params, "en");
});

app.intent("Saldo", (conv, params) => {
  return getBalance(conv, params, "nl");
});

exports.transferBot = functions.https.onRequest(app);
