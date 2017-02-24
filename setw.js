/*********************************************************
setw.js

command line tool to set winners of categories

*********************************************************/

var db = require('./database'),
    inq = require('inquirer');
    pred = require('./models/prediction'),
    config = require('./config/config');

if (!config.expired) {
  console.log('wait until deadline');
  process.exit(1);
}

db.conn( err => {

  pred.categories( response => {
    inq.prompt({
      type: 'list',
      name: 'category',
      message: 'Select a category',
      choices: response
    }).then( answers => {
      var cat = answers.category;
      pred.nominees(cat, response => {
        inq.prompt({
          type: 'list',
          name: 'id',
          message: 'choose winner',
          choices: response
        }).then( winner => {
          let arr = {
            code: 'ARUDMVDQ',
            winner: winner.id,
            cat: cat
          }
          pred.setwinner(arr, outcome => {
            console.log(outcome);
            process.exit(0);
          })
          //process.exit(0);
        })
      })
    })

    })

  })


