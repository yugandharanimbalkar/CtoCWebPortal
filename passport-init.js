var mongoose = require('mongoose');   
var User = mongoose.model('User');
var BandMember = mongoose.model('BandMember');
var BandMember = mongoose.model('BandMember');
var EventOrganiser = mongoose.model('EventOrganiser');
var Admin =  mongoose.model('Admin'); 
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password,done) { 
			// check in mongo if a user with username exists or not
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					// In case of any error, return using the done method
					//console.log("PASSWORD: ",createHash(password));
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with username '+username);
						return done(null, false);                 
					}
					// User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					//console.log("User_name : ",user_name);
					/*if (role ==="Band_Member"){
						BandMember.findOne({'username':user_name},function(error,bandmember_user){
								if(error){
									return done(error)
								}
								else if (!user){
									console.log('Band Member not Found with username ',user_name);
									return done(null, false);                 
								}
								console.log("Band member details : ",bandmember_user);
								user = bandmember_user;
								return done(null,user);
							});

					}
					else if (role ==="Band_Manager"){
						BandManager.findOne({'username':user_name},function(error,bandmanager_user){
								if(error){
									return done(error)
								}
								else if (!user){
									console.log('Band Manager not Found with username ',user_name);
									return done(null, false);                 
								}
								console.log("Band member details : ",bandmanager_user);
								user = bandmanager_user;
								return done(null,user);
							});

					}
					else if (role ==="Admin"){
						Admin.findOne({'username':user_name},function(error,admin){
								if(error){
									return done(error)
								}
								else if (!user){
									console.log('Band Manager not Found with username ',user_name);
									return done(null, false);                 
								}
								console.log("Admin details : ",admin);
								user = admin;
								return done(null,user);
							});
					}
					else if (role ==="Event_Organiser"){
						EventOrganiser.findOne({'username':user_name},function(error,event_organiser){
								if(error){
									return done(error)
								}
								else if (!user){
									console.log('Event Organiser not Found with username ',user_name);
									return done(null, false);                 
								}
								console.log("Event Organiser details : ",event_organiser);
								user = event_organiser;
								return done(null,user);
							});
					}*/

					return done(null,user);
					
				}
			);
		}
	));

	//console.log("Global name:  ",global.user_name);
	/*
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			// find a user in mongo with provided username
			User.findOne({ 'username' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err);
				}
				// already exists
				if (user) {
					console.log('User already exists with username: '+username);
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.username = username;
					newUser.password = createHash(password);
					//newUser.role = role;
					// save the user
					newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log(newUser.username + ' Registration successful');    
						return done(null, newUser);
					});
				}
			});
		})
	);
	*/
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};