var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
//var mysql = require('./routes/mysql');

var app = express();

/*var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.dev.config')
var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
   publicPath: config.output.publicPath,
   noInfo: true,
   quiet: false,
   historyApiFallback: true,
   stats: {
      colors: true
   }
}))

app.use(webpackHotMiddleware(compiler, {
   log: console.log,
   path: '/__webpack_hmr',
   heartbeat: 10 * 1000
}))*/

//Enable CORS
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../')));

app.use('/', index);
app.use('/users', users);
//app.use('/mysql', mysql);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

app.listen(3001,function(){
  console.log('listening to port 3001....');
});
