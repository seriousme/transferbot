// {
//   "id": "3bd2c47e-e282-4afa-85d1-49badb552ae6",
//   "data": [
//     {
//       "text": "save",
//       "alias": "Account",
//       "meta": "@Accounts",
//       "userDefined": false
//     },
//     {
//       "text": " "
//     },
//     {
//       "text": "25.50",
//       "alias": "Amount",
//       "meta": "@sys.unit-currency",
//       "userDefined": false
//     }
//   ],
//   "isTemplate": false,
//   "count": 0
// },

function parse(data){
  for (let saying of data.userSays) {
    var text = ''
    for (let item of saying.data) {
      text += item.text
    }
    says.push(text)
  }
}

var says=[];
const testFolder = './api.ai/intents'
const fs = require('fs')
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    let data = require(testFolder + '/' + file)
    parse(data)
  })
  console.log(says.sort().reverse())
})
