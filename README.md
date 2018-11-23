# Transferbot
Experiment in conversational banking to learn about interaction using natural language.

The transferbot is composed of 3 parts:
- the AI, provided by https://dialogflow.com (two instances: one English version and one Dutch version)
- the (very simplistic) banking backend hosted at https://firebase.google.com/ to maintain balances
- the web frontend hosted using gitHub pages, including voice recognition when using Chrome using the selected language

The frontend can be easily replaced by other [channels](https://docs.api.ai/docs/integrations) an example being the [default dialogflow.com web agent](https://console.dialogflow.com/api-client/demo/embedded/transferbot) and the [Dutch dialogflow.com web agent](https://console.dialogflow.com/api-client/demo/embedded/transferbotNL)
