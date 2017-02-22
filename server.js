/******************************************************************************
server.js

main entry point for app

******************************************************************************/

var express = require('express'),
    app = express(),
    db = require('./database'),
    pkg = require('./package.json'),
    config = require('./config/config'),
    bp = require('body-parser'),
    moment = require('./node_modules/sequelize/node_modules/moment'),
    bars = require('express-handlebars');

app.engine('.hbs', bars({
  defaultLayout: 'layout', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// set static route
app.use(express.static('assets'));
// use body-parser to get post data
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.locals.env = config.env;
app.locals.ver = pkg.version;
app.locals.app = pkg.name;
app.locals.expired = config.expired;
app.locals.deadline = moment(config.deadline).format('MMM D');
app.set('port', process.env.PORT || 1951); // a good year for bogart

// pull in the different routes
require('./routes')(app);

// start the server
db.conn( err => {
  if (err) {
    console.log('Can\'t connect to MySQL');
  } else {
    app.listen(app.get('port'), () => {
      console.log(pkg.name, 'running on port:', app.get('port'));
    })
  }
})
