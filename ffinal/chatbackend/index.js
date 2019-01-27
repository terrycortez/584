// EXPRESS INITIALIZATION
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser'); // form data, JSON basically just in case

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SOCKET IO INITIALIZATION
// node index.js
var server = require('http').createServer(app);
var io = require('socket.io')(http);

// MONGODB INITILIZATION
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name for users and conversations
const userDataBase = 'users';
const convosDataBase = 'conversations';

// REGISTER
app.post('/register', (req, res) => {
    // users and their passwords
    // console.log(req.body); 
    var usernames = req.body.usernames;
    var password = req.body.password;

    // send it to the respective DBs
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(userDataBase);
        // insert user
        const insertUser = function(db, callback) {
            const collection = db.collection('documents');
            collection.insertMany([
                {
                    usernames: usernames,
                    password: password
                }
            ], function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.ops.length);
                console.log("new user" + " " + usernames + " " + "added in the collection");
                callback(result);
            });
        };
        insertUser(db, function() {
            res.status(200).send( usernames );
            client.close();
        });

    });

});

// LOGIN
app.post('/login', function(req, res) {
    var usernames = req.body.usernames;
    var password =  req.body.password;

    // gotta find users to make sure it's in the database

    var users;
    const findUser = function(db, callback) {
        const collection = db.collection('documents');
        collection.find(
            { usernames : usernames }
            ).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("found record: " + docs.length);
            users = docs;
            console.log(docs);
            callback(docs);
        });
    };


    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(userDataBase);
        findUser(db, function() { 
                if(users[0].usernames == usernames && users[0].password == password ){
                // successfully logged in
                res.status(200).send(usernames);
                client.close();
            } else {
                // wrong username wrong password lol
                res.status(401).send('wrong username or wrong password');
                client.close();
            }
        });
    });
});

// MESSAGING
io.on('connection', function(socket) {
    app.post('/newconversation', function(req, res) {
        var sender = req.body.sender;
        var reciever = req.body.reciever;
        var txt = req.body.txt;

        const pushConversations = function(db, callback) {
            const collection = db.collection('documents');
            collection.insertMany([
                {
                    sender: sender,
                    reciever: reciever,
                    txt: txt
                }
            ], function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.ops.length);
                console.log("INSERT CONVERSATIONS PLS");
                callback(result);
            });
        };

        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const usersDB = client.db(userDataBase);
            const convoDB = client.db(convosDataBase);

            pushConversations(convoDB, function() {
                res.status(200).send({
                    sender: sender,
                    reciever: reciever,
                    txt: txt
                });
                client.close();
            });
        });
    });
});

io.on("disconnect", function() {
    console.log("User disconnected, like everyone else");
});

server.listen(3000, () => {
   console.log("Ready for connections");
});