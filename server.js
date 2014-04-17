var express = require('express');
var app 	= express();
var moment  = require('moment');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


app.use( bodyParser() );
app.use( cookieParser() );
app.use( expressSession({secret: 'thesecret'}) );

app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

function checkLoggedIn(req, res, next){
	console.log('inside checkLoggedIn');

	if (req.session.username) {
		res.locals.loggedInUsername = req.session.username;
	}

	next();
}

app.use( checkLoggedIn );

app.get('/', function(req, res){
	var data = {
		name: 'Gorilla',
		age:  45,
		address: {
			streetName: 'Broadway',
			streetNumber: 721
		}

	};
	var days = [
		'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
	];
	data.days = days;

	var athletes = [
		{name: 'Jordan', team: 'Bulls'},
		{name: 'Elway',  team: 'none'}
	];
	data.athletes = athletes;

	data.itIsNight = 'yeah';

	data.helpers = {
		showThirdItem: function(list){
			return list[2];
		},
		formatDate: function(date){
			return moment(date).format('MMMM Do YYYY, h:mm:ss a');
		}
	};
	data.today = new Date();


	res.locals.fruit = 'Banana';

	res.render('index', data);
});

app.get('/users/:user_id', function(req,res){
	res.send("The user id is: " + req.params.user_id);
});

// people?id=5
app.get('/people', function(req, res){
	var id = req.query['id'];
	console.log("The query params are: ",req.query);


	res.render("people", {id: id});
});

app.get('/login', function(req, res){
	res.render('login');
});

function passwordIsValid(user, pass) {
	if (user === 'itpclass' && pass === 'letmein') {
		return true;
	} else {
		return false;
	}
}

app.post('/login', function(req, res){
	console.log('body params:', req.body);

	var username = req.body['username'];
	var password = req.body['password'];

	if ( passwordIsValid(username, password) ) {
		req.session.username = username;
		res.redirect('/');
	} else {
		res.render('login', {failedLogin: true});
	}
});

// /set_session?myValue=abc
app.get('/set_session', function(req, res){
  if (!req.query.myValue){
    res.send("Please add a 'myValue' query to the URL like /set_session?myValue=abc");
  } else {
    req.session.myValue = req.query.myValue;
    res.send("Session's 'myValue' was set. Visit /see_session to view it.");
  }

});

app.get('/see_session', function(req, res){
	res.send("session.myValue: " + req.session.myValue);
});


app.use('/public', express.static('public'));

app.listen(process.env.PORT || 5000);
