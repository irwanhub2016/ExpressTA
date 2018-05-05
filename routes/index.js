var express = require('express');
var router = express.Router();
var modul = require('../modul/modul');
var authentication_mdl = require('../middlewares/authentication');
var moment = require('moment');
var apiKey = 'pd-rA0kgBEZ5jGgnAS_EePIGmhnY-yZTCTVZZAFxviR'; //untuk IFTTT
var IFTTTMaker = require('iftttmaker')(apiKey);
var session_store;
var orm    = require('orm');
var PDFDocument = require('pdfkit');
var multer  = require('multer');

var x;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
        console.log(file.originalname);
        global.y=file.originalname;
        x=y;
  }
})

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', upload.single('imageupload'),function(req, res) {

var valuePhoto = {
			photo:x
		}

		var update_lampu = 'update admin SET ? where id_admin=5';

		req.getConnection(function(err,connection){
			var queryPengisian = connection.query(update_lampu, valuePhoto, function(err, result){
				if(err)
				{
				console.log("Gagal ambil dan simpan data Photo");
				}
				else
				{
				res.json(
				  {
				    status : true,
				    message : "Succesfully upload",
				    photo : x
				  }
				);
				console.log("Sukses ambil dan simpan data Photo");
				}		
			});
		});

console.log({status: true,
          message: "Succesfully upload"});
});

router.use(orm.express("mysql://root:@localhost:/monitoring_depot", {

  define: function (db, models, next) {

    models.news = db.define("admin", {

    username           : String,

    email        : String,

    password       : String,

  });

  next();

}

}));

router.get('/QueryOrm', function(req, res, next) {
  var result = req.models.news.find({
  }, function(error, news){
  
      if(error) throw error;
  
      res.render('findQuery', { news:news, title: 'Generate PDF using NodeJS' });
    });
});

router.get('/logout', function(req, res)
{ 
	req.session.destroy(function(err)
	{ 
		if(err)
		{ 
			console.log(err); 
		} 
		else 
		{ 
			res.redirect('/login'); 
		} 
	}); 
});

router.get('/login',function(req,res,next)
{

		if (req.session.is_login) 
		{ 
			console.log(req.session.is_login_email);
			return res.redirect('/depot'); 
		}
		else
		{
			console.log(req.session.v_email);
			res.render('main/login',{title:"Login | DAIM PINTAR"});} 
		//next(); 
});

router.post('/login',function(req,res,next){
	session_store=req.session;
	session_email=req.session;
	req.assert('txtEmail', 'Please fill the Username').notEmpty();
	req.assert('txtEmail', 'Email not valid').isEmail();
	req.assert('txtPassword', 'Please fill the Password').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		req.getConnection(function(err,connection){
			v_pass = req.sanitize( 'txtPassword' ).escape().trim(); 
			v_email = req.sanitize( 'txtEmail' ).escape().trim();
			
			var query = connection.query('select * from admin where email="'+v_email+'" and password=md5("'+v_pass+'")',function(err,rows)
			{


				console.log("Photo " + rows[0].photo);
				if(err)
				{

					var errornya  = ("Error Selecting : %s ",err.code );  
					console.log(err.code);
					req.flash('msg_error', errornya); 
					res.redirect('/login'); 
				}else
				{
					if(rows.length <=0)
					{

						req.flash('msg_error', "Wrong email address or password. Try again."); 
						res.redirect('/login');
					}
					else
					{	
						session_store.is_login = true;
						session_email.is_login_email = v_email;
						console.log("Photo " + rows[0].photo);
						res.redirect('/depot');
					}
				}

			});
		});
	}
	else
	{
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		console.log(errors_detail);
		req.flash('msg_error', errors_detail); 
		res.redirect('/login'); 
	}
});

router.get('/blankpage', function(req, res, next) {
var waktu = moment().format('MMMM Do YYYY, h:mm:ss a');	
  res.render('blankpage', { title: waktu }); 
});

module.exports = router;