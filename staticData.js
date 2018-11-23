var staticDataEN = {
  language: "en",
  locale: "en-US",
  appData: {
    language: "en",
    accounts: {
      currentAccountBalance: {
        label: "Current",
        balance: 1000
      },
      savingsAccountBalance: {
        label: "Savings",
        balance: 0
      }
    },
    addressBook: [
      { name: "Savings account", aliases: ["Savings"] },
      { name: "Paul", aliases: [] },
      { name: "Jennifer", aliases: ["my wife"] }
    ],
    messages: [],
    mesg: "",
    example: "",
    labels: {
      title: "Conversational banking demo",
      you: "You",
      send: "Send",
      placeholder: "Type your message here...",
      balances: "Balances",
      account: "Account",
      balance: "Balance",
      addressbook: "Addressbook",
      name: "Name",
      aliases: "Alias(es)",
      examples: "Examples"
    }
  },
  examples: [
    "what is the balance of my savings account?",
    "what is my balance?",
    "transfer 27 euro to my savings account",
    "transfer 15 bucks to Paul",
    "transfer 10 euro to my savings account",
    "transfer",
    "save 25.50",
    "save 25 euro",
    "save",
    "is my paycheck in?",
    "how much is in my savings account ?",
    "how much is in my account?",
    "how much do I have?",
    "how much did I save?",
    "give Jennifer 10 euro",
    "Yes",
    "Stop",
    "Ok",
    "No",
    "Good",
    "Fine",
    "Confirm",
    "Cancel"
  ],
  clientToken: "5e892d9acb9d4d03a6e82814017fdfc5",
  projectID: "moneytransfer-95cf9",
  strings: {
    internalError: "Internal Server Error",
    infoSpeakNow: "Speak now",
    infoNoSpeech: "No speech detected",
    infoSpeechBlocked: "Permission to use microphone is blocked",
    infoSpeechAllow: "Allow microphone access"
  }
};

var staticDataNL = {
  language: "nl",
  locale: "nl",
  appData: {
    language: "nl",
    accounts: {
      currentAccountBalance: {
        label: "Betalen",
        balance: 1000
      },
      savingsAccountBalance: {
        label: "Sparen",
        balance: 0
      }
    },
    addressBook: [
      { name: "Spaarrekening", aliases: ["Spaar"] },
      { name: "Paul", aliases: [] },
      { name: "Jennifer", aliases: ["mijn vrouw"] }
    ],
    messages: [],
    mesg: "",
    example: "",
    labels: {
      title: "Interactieve bank demo",
      you: "Jij",
      send: "Verzend",
      placeholder: "Typ je bericht hier...",
      balances: "Saldi",
      account: "Rekening",
      balance: "Saldo",
      addressbook: "Adresboek",
      name: "Naam",
      aliases: "Alias(sen)",
      examples: "Voorbeelden"
    }
  },
  examples: [
    "spaar €7",
    "spaar 5 euro",
    "spaar",
    "hoi",
    "hallo",
    "geef mijn vrouw 5 euro",
    "boek 5 euro over",
    "boek 24 euro over naar de spaarrekening",
    "boek 12,5 euro over naar Paul",
    "boek",
    "Wat zit er in mijn spaarvarken ?",
    "Wat is mijn saldo ?",
    "Wat is het saldo op mijn spaarrekening ?",
    "Wat heb ik gespaard ?",
    "Stop",
    "Prima",
    "Oké",
    "Ok",
    "Niet doen",
    "Nee",
    "Ja",
    "Is mijn salaris al binnen ?",
    "Hoeveel staat er op mijn betaalrekening ?",
    "Hoeveel heb ik ?",
    "Goed",
    "Bevestigd"
  ],
  clientToken: "f290a423da4d45a29a098fc0ada5cf73",
  projectID: "transferbot-4c827",
  strings: {
    internalError: "Interne server fout",
    infoSpeakNow: "Spreek nu",
    infoNoSpeech: "Geen spraak gedetecteerd",
    infoSpeechBlocked: "Toegang tot de microfoon is geblokkeerd",
    infoSpeechAllow: "Sta spraak toegang toe"
  }
};

var staticData = {
  en: staticDataEN,
  nl: staticDataNL
};
