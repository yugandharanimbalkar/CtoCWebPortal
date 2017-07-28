var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var BandMember = mongoose.model('BandMember');
var BandManager = mongoose.model('BandManager');
var EventOrganiser = mongoose.model('EventOrganiser');
var Admin = mongoose.model('Admin');
var Instrument = mongoose.model('Instrument');
var Band = mongoose.model('Band');
var multer  = require('multer');
var upload = multer({ dest:'./public/images/'})
var fs =  require('fs');
/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {

  	if (!file.originalname.match(/\.(jpeg|png|jpg)$/)){
  		var err = new Error();
  		err.code = 'filetype';
  		return cb(err);
  	} else{
  		cb(null, Date.now() +'_'+ file.originalname);
  	}
  	
   // cb(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({
	storage: storage,
	limits: {fileSize : 100000000}

}).single('profile'); */

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
router.use('/profileGet/:username/:role', isAuthenticated);
router.use('/instruments', isAuthenticated);
//router.use('/profileUpdate/:id', isAuthenticated);


router.route('/profileGet/:username/:role')
	.get(function(req,res){
		var role = req.params.role;
		//var role = "Band_Member";
		var username = req.params.username
		if (role=="Band_Member")
		{
			/*BandMember.findOne({'username':username},function(err,bandmember){
				if(err){
					return res.send(500,err);
				}
				console.log("Inside band member");

				return res.json(bandmember);
			})*/
			
			BandMember.findOne({'username':username}).populate('instrument_played').exec(function(err,bandmember){
				if(err){
					return res.send(500,err);
				}
				console.log("Inside band member");

				return res.json(bandmember);
			});

		}
		else if(role=="Event_Organiser"){
			EventOrganiser.findOne({'username':username},function(err,eventorganiser){
				if(err){
					return res.send(500,err);
				}
				console.log("Inside event organiser");
				return res.json(eventorganiser);
			});
		}
		else if(role=="Band_Manager"){
			BandManager.findOne({'username':username}).populate('band_name').exec(function(err,bandmanager){
				if(err){
					return res.send(500,err);
				}
				console.log("Inside Band Manager");
				return res.json(bandmanager);
			});
		}

		else if(role=="Admin"){
			Admin.findOne({'username':username},function(err,admin){
				if(err){
					return res.send(500,err);
				}
				console.log("Inside admin");
				return res.json(admin);
			});
		}
		//return res.send({username:username,role:role});
	});

router.route('/instruments')
	.get(function(req,res){
		Instrument.find(function(err,instruments){
			if(err){
				res.send(500,err);
			}
			if(!instruments){
				res.send(404,'Not Found');
			}
			res.json(instruments);
		})
	});

/*router.route('/profileUpdate/:id')
	.put(function(req,res){
		
		var id = req.params.id;
		var role=req.body.role;
		console.log(role);
		if(role=='Band Member'){
			BandMember.findOne({_id:id},function(err,doc){

				if(req.body.instrument_played){
					console.log(req.body.instrument_played);
					doc.instrument_played = req.body.instrument_played;
				}
				if(req.body.style){
					doc.style = req.body.style;
				}
				doc.save(function(err,updatedUser){
					if(err){
						res.send(500,err);
					}
					res.json(updatedUser);
					console.log(updatedUser);
				})
				//console.log(doc);
			}); */

			/*
			BandMember.findAndModify({query:{_id:mongoose.ObjectId(id)},
				update:{$set:{instrument_played:req.body.instrument_played,style:req.body.instrument_played}},
				new:true},function(err,doc){
					console.log(doc);
					res.json(doc); 

			});*/
	/*	}
		else if(role=='Event_Organiser'){

		}
		else if(role=='Band_Manager'){
			Bandmanager.findOne({_id:id},function(err,doc){

				if(req.body.band_name){
					doc.band_name = req.body.band_name;
				}
				
				doc.save(function(err,updatedUser){
					if(err){
						res.send(500,err);
					}
					res.json(updatedUser);
					console.log(updatedUser);
				});
				//console.log(doc);
			});
		}
	}); */

router.route('/profileUpdate/:id')
	.put(function(req,res){
		var id = req.params.id;
		var role=req.body.role;
		console.log("Role: "+role);
		if(role=='Band_Member'){
			BandMember.findOne({_id:id},function(err,doc){

				if(req.body.instrument_played){
					console.log("inside instruent");
					doc.instrument_played = req.body.instrument_played;
				}
				if(req.body.style){
					console.log("inside style");
					doc.style = req.body.style;
				}
				doc.save(function(err,updatedUser){
					if(err){
						res.send(500,err);
					}
					res.json(updatedUser);
					console.log(updatedUser);
				})
				//console.log(doc);
			});
		}
	});


router.post('/profileImageUpdate',upload.any(), function(req,res){
	var id = req.body._id;
	BandMember.findOne({_id:id},function(err,doc){
		console.log("1");
		if(req.files){
			console.log("2");
		req.files.forEach(function(file){
			console.log("file");
			console.log(file);

			var filename = (new Date).valueOf()+"-"+file.originalname;
			fs.rename(file.path,'./public/images/'+filename, function(err){
				console.log("3");
				if(err){
					console.log("4");
					res.json(500,err);
				}
				console.log("5");
				console.log("file uploaded");
				console.log("Filename::::::::::"+filename);
				doc.image = filename;

				doc.save(function(err,updatedUser){
				console.log("6");
				if(err){
					console.log("7");
					console.log("Err: "+err);
					//res.send(500,err);
				}
				res.json(updatedUser);
				console.log("LLLLLLLLLLLLLLLLLLLLLLL");
				console.log(updatedUser);
			});


				})
			});
		}

	//console.log(doc);
	}); 
});

router.route('/getBandMember/:username')
	.get(function(req,res){
		console.log(username);
		var username= req.params.username;
		BandMember.findOne({username : username},function(err,bandmember){
			if(err){
				res.json(500,err);
			}
			console.log(bandmember);
			res.json(bandmember);
		});
	});

router.route('/getBandManager/:username')
	.get(function(req,res){
		console.log(username);
		var username= req.params.username;
		BandManager.findOne({username : username},function(err,bandmanager){
			if(err){
				res.json(500,err);
			}
			console.log(bandmanager);
			res.json(bandmanager);
		});
	});

router.route('/getEventOrganiser/:username')
	.get(function(req,res){
		console.log(username);
		var username= req.params.username;
		EventOrganiser.findOne({username : username},function(err,eventorganiser){
			if(err){
				res.json(500,err);
			}
			console.log(eventorganiser);
			res.json(eventorganiser);
		});
	});

router.route('/getAdmin/:username')
	.get(function(req,res){
		console.log(username);
		var username= req.params.username;
		Admin.findOne({username : username},function(err,admin){
			if(err){
				res.json(500,err);
			}
			console.log(admin);
			res.json(admin);
		});
	});


router.route('/upload')
	.post(function (req, res) {
	  upload(req, res, function (err) {
	    if (err) {
	      if(err.code === 'LIMIT_FILE_SIZE'){
	      	res.json({success:false,message:'File size is too large. Maximum size is 10 MB'});
	      }
	      else if(err.code === 'filetype'){
	      	res.json({success:false,message:'File type is invalid'});
	      }
	      else{
	      	console.log(err);
	      	res.json({success:false,message:'File was not uploaded properly'});
	      }
	    }
	    else{
	    	if(!req.file){
	    		res.json({success:false,message:'No file is uploaded'});
	    	}
	    	else{
	    		res.json({success:true,message:'File uploaded successfully'});
	    	}
	    }

	  })
	});

router.route('*')
	.get(function(req,res){
		res.sendFile(path.join(__dirname+'/public/editProfile.html'));
	})
module.exports = router;
	