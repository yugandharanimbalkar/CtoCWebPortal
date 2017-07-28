var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Event = mongoose.model('Event');


function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

router.route('/createEvent')
	.post(function(req,res){
		var event = new Event();
		event.event_name=req.body.event_name;
		event.eventId =req.body.eventId,
		event.event_organiser =req.body.username,
		event.location = req.body.location,
		event.eventdate = req.body.eventdate,
		//event.time = req.body.time,
		event.description = req.body.description,
		console.log("hhhhhhhhhh");
		console.log(req.body.username);
		event.save(function(err,event){
			if(err){
				console.log("ERRRRRRR: ",err);
				return res.send(500, err);
			}
			return res.json(event);
		});

	});

router.route('/getEvents/:organiserId')
	.get(function(req,res){
		var organiserId = req.params.organiserId;
		/*var query = Event.find({});

		query.where('event_organiser',organiserId);
		query.exec(function(err,doc){
			if(err){
				return res.send(500,err);
			}
			return res.send(200,doc);
		});*/

		
		Event.find({'event_organiser':organiserId},function(err, events){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,events);
		});
	})


router.route('/getEventDetails/:eventId')
	.get(function(req,res){
		var eventId = req.params.eventId;
		Event.find({'event_name':eventId},function(err,event){
			if(err){
				return res.send(500,err);
			}
			return res.send(200,event);
		});
	});

module.exports = router;