
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongo = require('mongodb')
  , MongoClient = mongo.MongoClient
  , ObjectID = mongo.ObjectID;

var mongoUri =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/mydb';

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'thisisaverybadkey' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/api/comments',
        function (req, res){
            MongoClient.connect(mongoUri, function (err, db) {
                if(err)throw err;
                db.collection('comments', function(er, collection) {
                    collection.find().toArray(function(er,rs) {
                        res.send(rs);
                    });
                });
            });
        });


app.get('/api/comments/:id',
        function (req, res){
            MongoClient.connect(mongoUri, function (err, db) {
                if(err)throw err;
                db.collection('comments', function(er, collection) {
                    collection.findOne({"_id": new ObjectID(req.params.id)}, function(er,rs) {
                        if(er) {res.statusCode = 500; return;}
                        res.send(rs);
                    });
                });
            });
        });

app.post('/api/comments', 
         function (req, res){
             if(req.body.content){
                 MongoClient.connect(mongoUri, function (err, db) {
                     if(err)throw err;
                     db.collection('comments', function(er, collection) {
                         collection.insert(req.body, {safe: true}, function(er,rs) {
                             res.send(rs);
                         });
                     });
                 });
             }
         });

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
