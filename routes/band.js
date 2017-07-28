var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Band = mongoose.model('Band');
var Genre = mongoose.model('Genre');
//var fs = require('fs');
var BandManager = mongoose.model('BandManager');

//Used for routes that must be authenticated.
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

//Register the authentication middleware
//router.use('/bandpost', isAuthenticated);

/*
router.route('/createBand')
	.post(function(req, res){

		var imgPath = 'E:/project3/public/images/1488978894081_guitarist.png';
		var band = new Band();
		//band.band_img.data = fs.readFileSync(imgPath);
		//band.band_img.contentType = 'image/png';
		band.band_name = req.body.band_name;
		band.x_factor = req.body.x_factor;
		band.genre = req.body.genre;
		band.band_manager = req.body.band_manager;
		band.save(function(err, band){
			console.log("................."+err);
			if (err){
				//console.log("................."+err);
				return res.send(500, err);
			}
			else{
				console.log(".................");
				console.dir(band);
				return res.json({band,status:'success'});
					
			}
			

		});

		console.log("mmmmmmmmmmmmmmmmmmmmmmmmm");
		console.log(band);
		//var bandmanager = new BandManager();
		console.log("before...");
		BandManager.findOneAndUpdate({_id:req.body.band_manager},{$set:{band_name:band._id}},function(err, band_manager){
			console.log("after...");
			if(err){
				console.log(err);
				//res.json(err);
			}
			console.log(band_manager);
			
		});		
	});
 */


router.route('/createBand')
	.post(function(req, res){
		var band = new Band();
		band.band_name = req.body.band_name;
		band.x_factor = req.body.x_factor;
		band.genre = req.body.genre;
		band.band_manager = req.body.band_manager;
		band.save(function(err, band){
			if (err){
				return res.send(500, err);
			}
			else{
				return res.json({band,status:'success'});
					
			}
			

		});

		console.log("mmmmmmmmmmmmmmmmmmmmmmmmm");
		console.log(band);
		//var bandmanager = new BandManager();
		console.log("before...");
		BandManager.findOneAndUpdate({_id:req.body.band_manager},{$set:{band_name:band._id}},function(err, band_manager){
			console.log("after...");
			if(err){
				console.log(err);
				//res.json(err);
			}
			console.log(band_manager);
			
		});		
	});


router.route('/genre')
	.get(function(req,res){
		Genre.find(function(err,genre){
			if(err){
				res.send(500,err);
			}
			res.json(genre);
		})
	});


router.route('/bandGet/:username')
	.get(function(req,res){
		var username = req.params.username;
		Band.findOne({'band_manager':username}).populate('genre').populate('band_manager').exec(function(err, band){
			if(err){
				return res.send(500,err)
			}
			return res.json(band);
		})
	});


router.route('/bandGetAll')
	.get(function(req,res){
		Band.find(function(err, band){
			if(err){
				return res.send(500,err)
			}
			return res.json(band);
		})
	});


/*
router.route('/bandGetOne/:band_name')
	.get(function(req,res){
		Band.findById(req.params.band_name,function(err, band){
			if(err){
				return res.send(500,err)
			}
			return res.json(band);
		})
	});	

*/
module.exports = router;