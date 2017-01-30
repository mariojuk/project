// modules
var express  = require('express');
var app      = express();                               
var morgan = require('morgan');             
var mongoose = require('mongoose');
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var nodemailer = require("nodemailer");


// db connection
mongoose.connect('mongodb://sportadmin:sportadmin@jello.modulusmongo.net:27017/rew4iTib');

// db collection
var Preorder = mongoose.model('preorder', {
	mail: String,
	code: String,
	paket: Boolean
});

// admin collection
var Adminuser = mongoose.model('adminuser', {
	username: String,
	password: String
});

// app
app.use(express.static(__dirname + '/public'));                 
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

// app port
app.listen(8080);
console.log("App listening on port 8080");

app.get('/api/sport/pre-order', function(req, res) {
	Preorder.find(function(err, preorders) {
		if (err) {
			console.log("backend err");
			res.send(err)
		}	
        res.json(preorders);
	});
});

app.get('/api/sport/admin', function(req, res) {
	Adminuser.find(function(err, admin) {
		if (err) {
			console.log("backend err");
			res.send(err)
		}	
        res.json(admin);
	});
});

app.post('/api/sport/pre-order', function(req, res) {

		Preorder.find(function(err, preorders) {
                if (err) {
                    return res.send(err)
				}
				
				var unique = true;
				var i = 0;
				var kod = getcode();
				var j = 0;
				var duplicate = 0;
				
                while (i < preorders.length ) {
					if(preorders[i].mail == req.body.mail) {
						unique = false;
					}
					if(preorders[i].code == undefined) {
						unique = true;
					}
					mailDuplicate = preorders[i].mail;
					while (j < preorders.length) {
						if (preorders[j] == mailDuplicate) {
							duplicate++;	
						}
						j++
					}
					if (duplicate > 1) {
						unique = false;
					}
					/*if(preorders[i].code==kod){
						unique=false;
						console.log("It is duplicate code..");
					}*/
					i++;
				}
				
				//var provjeri_kod=provjera(kod);
				var provjeri_paket=req.body.presaleMembership;
				if(provjeri_paket && unique){
					var generator = require('xoauth2').createXOAuth2Generator({
								user: "projektsportsluzbeni@gmail.com",
								clientId: "265241664139-lh2be1bs7ffk9p4lqugfs6eabis38jh8.apps.googleusercontent.com",
								clientSecret: "BeYNluy3ffD5FqBgn-JyURhr",
								refreshToken: "1/nj0dqNUAe3vLXGiQAyTTdFJn28sSFwbKvEvzJa35gog",
							});
							// listen for token updates
							// you probably want to store these to a db
							generator.on('token', function(token){
								console.log('New token for %s: %s', token.user, token.accessToken);
							});
							
							var smtpTransport = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									xoauth2: generator
								}
							});
							var salji=req.body.mail;
							var mailOptions = {
								to: salji,
								subject: 'Welcome to DUXBOARD',
								text: 'Project',
								html: '<!DOCTYPE html><html><head></head><body><p>Dear Subscriber,</p></br><p>Thank you for your interest in our <strong>DUXBOARD</strong> premium membership! Please use the code <strong>' + kod + '</strong> to access your unique premium price of <strong>EuroXX</strong>.</p></br><p>The membership will provide access to premium content including webinars and educational resources to drive our progress in the sports landscape.</p></br><p>We are ecstatic to embark upon the world’s first platform designed to provide support, opportunity, and education to the spots community. Stay tuned for our product launch!!</p></body></html>'
							};

							smtpTransport.sendMail(mailOptions, function(error, info) {
							  if (error) {
								console.log(error);
							  } else {
								console.log('Message sent: ' + info.response);
							  }
							  smtpTransport.close();
							});
				}
				if(!provjeri_paket && unique){
					var generator = require('xoauth2').createXOAuth2Generator({
								user: "projektsportsluzbeni@gmail.com",
								clientId: "265241664139-lh2be1bs7ffk9p4lqugfs6eabis38jh8.apps.googleusercontent.com",
								clientSecret: "BeYNluy3ffD5FqBgn-JyURhr",
								refreshToken: "1/nj0dqNUAe3vLXGiQAyTTdFJn28sSFwbKvEvzJa35gog",
							});
							// listen for token updates
							// you probably want to store these to a db
							generator.on('token', function(token){
								console.log('New token for %s: %s', token.user, token.accessToken);
							});
							
							var smtpTransport = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									xoauth2: generator
								}
							});
							var salji=req.body.mail;
							var mailOptions = {
								to: salji,
								subject: 'Welcome to DUXBOARD',
								text: 'Project',
								html:'<!DOCTYPE html><html><head></head><body><p>Dear Subscriber,</p></br><p>Thank you for following the progress and development of <strong>DUXBOARD</strong> the world’s first digital environment catered to the success and development of sport professionals.</p></br><p>You’ll receive updated information regarding product launches, promotions, and news related to our innovative new platform.</p></br><p>We are excited to share our progress with you and look forward to revealing the surprises we have created for you.</p></br><p>Thanks again for your support and welcome to <strong>DUXBOARD</strong></p></body></html>'
							};

							smtpTransport.sendMail(mailOptions, function(error, info) {
							  if (error) {
								console.log(error);
							  } else {
								console.log('Message sent: ' + info.response);
							  }
							  smtpTransport.close();
							});
				}
				
				if (unique) {
					if(req.body.presaleMembership){
						Preorder.create({
							//ToDo definirati
							mail : req.body.mail,
							code: kod,
						});
					}
					else {
						Preorder.create({
						//ToDo definirati
						mail : req.body.mail,
					});
					}
						
					console.log("File name entered..");
				}
				else {
					console.log("It is duplicate..");
				}
				/*
				function provjera(kod){
				var provjera = true;
				var j=0;
				for(j=0; j<preorders.length; j++){
						if(preorders[j].code == kod){
							provjera=false;
							console.log("error..");
							kod = getcode();
							j=0;
						}
						else{
							return kod;
						}
					}			
				}
				*/
				
/*
				function check_mail(email){
					var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
					return emailPattern.test(email); //vratiti ce true ako je mail adresa ispravna 
				}
*/

            });
			
app.delete('/api/sport/pre-order/:email', function(req, res) {
	Preorder.remove({
			//ToDo definirati
            mail : req.params.mail
        }, function(err, preorder) {
            if (err)
                res.send(err);
			else {
				console.log("Deleted..");
			}
        });
    });
});

// start route
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

function getcode(){
	var lozinka = "";
    var kombinacija = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        lozinka += kombinacija.charAt(Math.floor(Math.random() * kombinacija.length));

    return lozinka;

}

