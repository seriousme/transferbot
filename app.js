
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
  return appData.accounts.filter(function (item) { return item.id === id })[0]
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

function addMessage (actor, mesg) {
  var now = new Date()
  appData.messages.push({actor: actor, timestamp: now, mesg: mesg})
  showLatest()
}

function setResponse (mesg) {
  addMessage('agent', mesg)
}

function speechButton (event) {
  if (appData.mic.status === appData.mic.active) {
    recognition.stop()
    return
  }
  recognition.lang = config.locale
  recognition.start()
  ignoreOnEnd = false
  appData.mic.status = appData.mic.blocked
  // addMessage('speech', config.strings.infoSpeechAllow)
}

function sendMesg () {
  var mesg = appData.mesg
  if (mesg === '') {
    return
  }
  addMessage('user', mesg)
  askApiIO(mesg)
  appData.mesg = ''
}

// main code starts here

var guid = generateGuid()
appData.mic = {
  status: 'notavailable',
  inactive: 'inactive',
  active: 'active',
  blocked: 'blocked',
  next: {
    inactive: 'active',
    active: 'blocked',
    blocked: 'inactive'
  }
}

// enable the speechbutton if the browser supports it
var recognition
var ignoreOnEnd
if ('webkitSpeechRecognition' in window) {
  appData.mic.status = appData.mic.inactive
  recognition = new webkitSpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onstart = function () {
    // addMessage('speech', config.strings.infoSpeakNow)
    appData.mic.status = appData.mic.active
  }

  recognition.onerror = function (event) {
    if (event.error === 'no-speech') {
      appData.mic.status = appData.mic.inactive
      addMessage('speech', config.strings.infoNoSpeech)
    }
    if (event.error === 'audio-capture') {
      appData.mic.status = appData.mic.inactive
      addMessage('speech', config.strings.infoNoMicrophone)
    }
    if (event.error === 'not-allowed') {
      appData.mic.status = appData.mic.blocked
    }
    ignoreOnEnd = true
  }

  recognition.onend = function () {
    if (ignoreOnEnd) {
      return
    }
    appData.mic.status = appData.mic.inactive
  }

  recognition.onresult = function (event) {
    var finalTranscript = ''
    if (typeof (event.results) === 'undefined') {
      recognition.onend = null
      recognition.stop()
      appData.mic.status = appData.mic.blocked
      return
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      }
    }
    if (finalTranscript) {
      appData.mesg = finalTranscript
      sendMesg()
    }
  }
}

var app = new Vue({
  // We want to target the div with an id of 'events'
  el: '#app',
  // Here we can register any values or collections that hold data
  // for the application
  data: appData,
  methods: {
    send: sendMesg,
    since: function (data) {
      return dateSince(data)
    },
    toFixed: function (num, precision) {
      return Number(num).toFixed(precision)
    },
    micClicked: speechButton
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
