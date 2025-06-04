
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Import database models and initialization function
const db = require('./db_sequelize');

// Import routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adsRouter = require('./routes/ads');
const categoriesRouter = require('./routes/categories');
const commentsRouter = require('./routes/comments');
const chatsRouter = require('./routes/chats');
const messagesRouter = require('./routes/messages');

// Configuração condicional do Swagger
let swaggerUi, swaggerFile;
try {
  swaggerUi = require('swagger-ui-express');
  swaggerFile = require('./swagger.json');
} catch (error) {
  console.log('Swagger documentation not available. Run "npm run swagger-autogen" first.');
}

const app = express();

// Initialize database before starting the server
(async () => {
  try {
    await db.sequelize.sync({ force: false }); // Altere para true apenas se quiser recriar as tabelas
    console.log('Database synchronized successfully');
    
    // Chamar a função de seed após a sincronização
    await db.seedDatabase();
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
app.use(cors());

// Register routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ads', adsRouter);
app.use('/categories', categoriesRouter);
app.use('/comments', commentsRouter);
app.use('/chats', chatsRouter);
app.use('/messages', messagesRouter);

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







