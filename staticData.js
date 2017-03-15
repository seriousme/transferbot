
var staticDataEn = {
  language: 'en',
  locale: 'en-US',
  appData: {
    accounts: {
      'currentAccountBalance': {
        label: 'Current',
        balance: 1000
      },
      'savingsAccountBalance': {
        label: 'Savings',
        balance: 0
      }
    },
    addressBook: [
    { name: 'Savings account', aliases: ['Savings'] },
    { name: 'Paul', aliases: [] },
    { name: 'Jennifer', aliases: ['my wife'] }
    ],
    messages: [],
    mesg: '',
    example: ''
  },
  examples: [ 'what is the balance of my savings account?',
    'what is my balance?',
    'transfer 27 euro to my savings account',
    'transfer 15 bucks to Paul',
    'transfer 10 euro to my savings account',
    'transfer',
    'save 25.50',
    'save 25 euro',
    'save',
    'is my paycheck in?',
    'how much is in my savings account ?',
    'how much is in my account?',
    'how much do I have?',
    'how much did I save?',
    'give Jennifer 10 euro',
    'Yes',
    'Stop',
    'Ok',
    'No',
    'Good',
    'Fine',
    'Confirm',
    'Cancel' ],
  clientToken: '5e892d9acb9d4d03a6e82814017fdfc5',
  strings: {
    internalError: 'Internal Server Error',
    infoSpeakNow: 'Speak now',
    infoNoSpeech: 'No speech detected',
    infoSpeechBlocked: 'Permission to use microphone is blocked',
    infoSpeechAllow: 'Allow microphone access'
  }
}

var staticData = { en: staticDataEn }
