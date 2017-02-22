module.exports = function(app) {

  var player = require('./models/player'),
      pred = require('./models/prediction'),
      config = require('./config/config'),
      mailer = require('./models/mailer');

  // main page
  app.get('/', (req, res) => {
    res.render('main', { signups: config.placeholders() });
  });

  // other static routes
  app.get('/about', (req, res) => {
    res.render('about');
  })

  app.get('/history', (req, res) => {
    res.render('history');
  })

  // handle user signup form
  app.post('/signup', (req, res) => {
    player.create(req.body.username, req.body.email, check => {
      if (check.code) {
        mailer.send(req.body.username, req.body.email, check.code, result => {
          //console.log(result);
        })
      }
      res.render('main', { signup: check, signups: config.placeholders() });
    })
  })

  // get the results
  app.get('/results', (req, res) => {
    pred.results( data => {
      res.render('results', { table: data });
    })
  })

  // routing for users
  app.get('/player/:code', (req, res) => {
    player.exists(req.params.code, check => {
      if (check.id) {
        pred.preds(check.id, data => {
          if (data.code) {
            res.render('main', { error: data.code, signups: config.placeholders() })
          } else {
            res.render('players', { user: check, data: data });
          }
        })
      } else {
        res.render('main', { error: check.err, signups: config.placeholders() })
      } 
    })
  })

  // handle prediction update
  app.post('/prediction', (req, res) => {
    pred.save(req.body, response=> {
      res.send(response);
    })
  })

  // handle setting a category winner
  app.post('/setwinner', (req, res) => {
    pred.setwinner(req.body, check => {
      res.send(check);
    })
  })

  // render a view of a category, with predictions
  app.get('/category/:cat', (req, res) => {
    if (req.params.cat > 0 && req.params.cat < 25) {
      pred.getwinner(req.params.cat, film => {
        pred.category(req.params.cat, cat => {
          res.render('category', {film: film[0], table: cat});
        })
      }) 
    } else {
      res.send('Invalid category');
    }

  })

  // check the uniqueness of a signups name and email
  app.post('/player/check', (req, res) => {
    player.unique(req.body.type, req.body.value, check => {
      res.send(check);
    })
  })

  // get list of users predicting nom in cat
  app.get('/prediction/userbycat/:cat/:nom', (req, res) => {
    pred.getUsersByBet(req.params.cat, req.params.nom, list => {
      res.send(list);
    })
  })

}