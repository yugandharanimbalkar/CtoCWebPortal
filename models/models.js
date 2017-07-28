var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var uniqueValidator = require('mongoose-unique-validator');

var postSchema = new mongoose.Schema({
	_id: Schema.ObjectId,
	//created_by: { type: Schema.ObjectId, ref: 'User' },		//should be changed to ObjectId, ref "User"
	created_by : String,
	created_at: {type: Date, default: Date.now},
	text: String
});
mongoose.model('Post', postSchema,"posts");

var userSchema = new mongoose.Schema({
	username: {type:String, required:true},
	password: {type:String, required:true}, //hash created from password
	role : {type:String, required:true},
	created_at: {type: Date, default: Date.now},
	
});
mongoose.model('User', userSchema,"users");
//userSchema.plugin(uniqueValidator,{message:'Error!!!'});

var genreSchema = new mongoose.Schema({
	genre_name : String
});
mongoose.model('Genre',genreSchema,"genre");

var bandManagerSchema = new mongoose.Schema({
	username :{type:String,ref:'User'},
	role : String,
	band_name : {type :Schema.ObjectId,ref :'Band'},
	created_at: {type: Date, default: Date.now},
});
mongoose.model('BandManager',bandManagerSchema,'band_manager');

var bandSchema = new mongoose.Schema({	
	created_at: {type: Date, default: Date.now},
	band_name : String,
	x_factor : String , 
	band_manager : {type:Schema.ObjectId, ref: 'BandManager'},
	genre : {type:Schema.ObjectId,ref :'Genre'},
	//band_img: { data: Buffer, contentType: String }
	//members:[userSchema]
	/*
	choice:[{
		choice:String,
		name:String
	}]*/
});
mongoose.model('Band', bandSchema,"bands");
//bandSchema.plugin(uniqueValidator,{message:'Error!!!!!!'});

var instrumentSchema = new mongoose.Schema({
	instrument_name : String,
});
mongoose.model('Instrument',instrumentSchema,"instruments");

var bandMemberSchema = new mongoose.Schema({
	username: {type:String,ref:'User'},
	role : String,
	created_at: {type: Date, default: Date.now},
	band_name : { type: Schema.ObjectId, ref: 'Band' },
	instrument_played : { type: Schema.ObjectId, ref: 'Instrument' },
	style : String,
	image : String
});
mongoose.model('BandMember', bandMemberSchema,"band_members");

var adminSchema = new mongoose.Schema({
	username: {type:String,ref:'User'},
	role : String,
	created_at: {type: Date, default: Date.now},
	//image : 
});
mongoose.model('Admin', adminSchema,"admin_users");

var eventOrganiserSchema = new mongoose.Schema({
	username: {type:String, ref:'User'},
	role : String,
	created_at: {type: Date, default: Date.now},
	//created_at : {type: Date, default: Date.now},
	//name : String,
	contact_number : String,
	//created_event_number:[eventSchema]
});
mongoose.model('EventOrganiser', eventOrganiserSchema,"event_organiser");

var eventSchema = new mongoose.Schema({
	created_at: {type: Date, default: Date.now},
	event_name : String,
	event_organiser :{type: Schema.ObjectId , ref:'EventOrganiser'},
	location : String,
	eventdate : Date,
	description : String
});
mongoose.model('Event', eventSchema,"events");

var invitationSchema = new mongoose.Schema({
	inviter_organiser : {type :Schema.ObjectId, ref:'EventOrganiser'},
	invitee_band : {type:Schema.ObjectId, ref:'Band'},
	invited : {type: Boolean},
	invitation_accepted : {type: Boolean},
	sent_at:{type: Date, default: Date.now},
	event_name:{type:Schema.ObjectId,ref:'Event'}
});
mongoose.model('Invitation', invitationSchema,"invitations");



