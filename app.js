
var dotenv = require('dotenv');
dotenv.config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import database models and initialization function
var db = require('./db_sequelize');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Configuração condicional do Swagger
let swaggerUi, swaggerFile;
try {
  swaggerUi = require('swagger-ui-express');
  swaggerFile = require('./swagger.json');
} catch (error) {
  console.log('Swagger documentation not available. Run "npm run swagger-autogen" first.');
}

var app = express();

// Initialize database before starting the server
(async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Configuração condicional da rota do Swagger
if (swaggerUi && swaggerFile) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  console.log('Swagger documentation available at /api-docs');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;



