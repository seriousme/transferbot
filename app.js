
var config = staticData.en
var appData = config.appData

var baseUrl = 'https://api.api.ai/v1/'

function dateSince (date) {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return interval + ' years'
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' months'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' days'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' hours'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}

function accountById (id) {
  return appData.accounts.filter(function(item){ return item.id === id })[0]
}

function showLatest () {
  $('#chatpanel').stop().animate({
    scrollTop: $('#chatpanel')[0].scrollHeight
  }, 800)
}

function generateGuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// very simplistic accounting system
function book (data) {
  if (data.Account === 'current account') {
    return
  }
  var amount = data.Amount
  if (typeof (amount) === 'object') {
    amount = data.Amount.amount
  }

  accountById('current account').balance -= amount
  if (data.Account === 'savings account') {
    accountById('savings account').balance += amount
  }
}

function handleSuccess (data) {
  console.log('action', data.result.action)
  if ((data.result.action === 'account.transfer.create') &&
        (data.result.actionIncomplete === false)) {
    appData.transaction = data.result.parameters
  } else if (data.result.action === 'account.transfer.confirm') {
    book(appData.transaction)
  } else {
    appData.transaction = ''
  }
  console.log(data)
  if (data.result.action === 'account.balance') {
    if (data.result.parameters.Account === 'savings account') {
      setResponse(config.strings.savingsAccountBalance + accountById('savings account').balance)
    } else {
      setResponse(config.strings.currentAccountBalance + accountById('current account').balance)
    }
  } else {
    setResponse(data.result.fulfillment.speech)
  }
}

function askApiIO (text) {
  var query
  if (text === '') {
    // start conversation
    query = JSON.stringify({ event: { name: 'WELCOME' }, lang: 'en', sessionId: guid })
  } else {
    query = JSON.stringify({ query: text, lang: config.language, sessionId: guid })
  }
  $.ajax({
    type: 'POST',
    url: baseUrl + 'query?v=20150910',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + config.clientToken
    },
    data: query,
    success: handleSuccess,
    error: function () {
      setResponse(config.strings.internalError)
    }
  })
}

function setResponse (mesg) {
  var now = new Date()
  appData.messages.push({actor: 'agent', timestamp: now, mesg: mesg})
  showLatest()
}

var guid = generateGuid()

var app = new Vue({
  // We want to target the div with an id of 'events'
  el: '#app',
  // Here we can register any values or collections that hold data
  // for the application
  data: appData,
  methods: {
    send: function (mesg) {
      if (mesg === '') {
        return
      }
      var now = new Date()
      appData.messages.push({actor: 'user', timestamp: now, mesg: mesg})
      askApiIO(mesg)
      appData.mesg = ''
    },
    since: function (data) {
      return dateSince(data)
    },
    toFixed: function (num, precision) {
      return Number(num).toFixed(precision)
    }
  }
})

// ask for a welcome message
askApiIO('')
// cycle examples in the example panel
var exampleCnt = 0
setInterval(function () {
  appData.example = config.examples[exampleCnt++]
  if (exampleCnt > config.examples.length) {
    exampleCnt = 0
  }
}, 3000)

// <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.min.js" integrity="sha256-+lq3KPqEFQg/58sDzkrt3VflAlGyJF2MZgOObJkUF2M=" crossorigin="anonymous"></script>
