require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const compression = require('compression');
const MysqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const port=process.env.PORT;
const {db} = require('./utils/dbConnect');
const {logging} = require('./utils/logs');
const {isLoggedin} = require('./middlewares/auth');

const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();
const sessionStore=new MysqlStore({},db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave:false,
  secret:process.env.SESSION_SECRET,
  saveUninitialized:false,
  store:sessionStore,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(flash());

app.use('/',userRouter);
app.use('/', isLoggedin, viewRouter);

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

db.connect((err)=>{
  if(err){
      logging.error('Error connecting to cardioscan database\n',err);
  }else{
      logging.info('connected to database');
  }
});

app.listen(port,()=>{
  logging.info(`Listening on port ${port}`);
});