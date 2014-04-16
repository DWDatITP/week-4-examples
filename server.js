var express = require('express');
var app 	= express();

var expressHbs = require('express3-handlebars');

app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('index');
});

app.use('/public', express.static('public'));

app.listen(process.env.PORT || 5000);