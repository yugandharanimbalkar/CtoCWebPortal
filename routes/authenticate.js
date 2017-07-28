var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var bCrypt = require('bcrypt-nodejs');
var User = mongoose.model('User');
var BandMember = mongoose.model('BandMember');
var BandManager = mongoose.model('BandManager');
var EventOrganiser = mongoose.model('EventOrganiser');
var Admin =  mongoose.model('Admin');

var createHash = function(password){
		console.log("into hash password");
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};


module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup',function(req,res) {
		var username = req.body.username;
		var password = req.body.password;
		var role = req.body.role;
		console.log("Check");
		req.checkBody('username','Username is required').notEmpty();
		req.checkBody('password','Password is required').notEmpty();
		req.checkBody('role','Role is required').notEmpty();
		var errors = req.validationErrors();
		console.log("Error: ",errors);
		if(errors){
			res.render('signup',{
				errors : errors
			});

			console.log("Error occurred");
		}
		else{

			var newUser = new User();
			newUser.username = req.body.username;
			var password = req.body.password
			newUser.password = createHash(password);
			newUser.role = req.body.role;
			newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log(newUser.username + ' Registration successful');    
						
					});

			if (req.body.role==="Band_Member"){
				var newBandMember = new BandMember();
				newBandMember.username = req.body.username;
				newBandMember.role = req.body.role;
				newBandMember.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log('New Band Member: '+newBandMember.username); 	
					});
				var user = newBandMember;
				res.json({user,status:'success'});
			}
			else if(req.body.role==="Event_Organiser"){
				var newEventOrganiser = new EventOrganiser();
				newEventOrganiser.username = req.body.username;
				newEventOrganiser.role = req.body.role;
				newEventOrganiser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log('New Event Organiser: '+newEventOrganiser.username); 	
					});
				var user = newEventOrganiser;
				res.json({user,status:'success'});
			}
			else if(req.body.role==="Admin"){
				var newAdmin = new Admin();
				newAdmin.username = req.body.username;
				newAdmin.role = req.body.role;
				newAdmin.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log('New Admin: '+newAdmin.username); 	
					});
				var user = newAdmin;
				res.json({user,status:'success'});
			}
			else if(req.body.role==="Band_Manager"){
				var newBandManager = new BandManager();
				newBandManager.username = req.body.username;
				newBandManager.role = req.body.role;
				newBandManager.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log('New Band Manager: '+newBandManager.username); 	
					});
				var user = newBandManager;
				res.json({user,status:'success'});
			}
			

			console.log("Successful without errors");
			


		}
		
	});

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}