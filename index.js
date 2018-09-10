const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const ImageStore = require('./lib/imageStore');
let db;

var multer = require('multer');
var upload = multer();

// let images = [
//     {src: 'animal.jpg'},
//     {src: 'winter-hunting-dog.jpg'},
//     {src: 'cat-crossed-legs.jpg'},
//     {src: 'Labrador_Chocolate.jpg'},
//     {src: 'purple-pattern.jpg'},
//     {src: 'Wreath_icon.png'},
// ];
// {src: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Creative-Tail-Animal-dog.svg'}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var logRequests = function (req, res, next) {
    console.log(`${req.method} @ ${req.url}`);
    next();
}

app.use(logRequests);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/images', (req, res) => {
    imageStore.findImages((images) => {
        res.send(images);
    });
});

app.post('/images', upload.array(), (req, res) => {
    let imageObject = req.body;
    imageObject.createdAt = new Date();
    imageStore.addImage(imageObject, () => {
        res.redirect('/');
    });
});

app.post('/reset', (req, res) => {
    imageStore.reset(()=>{
        res.redirect('/')
    });
});

let db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

MongoClient.connect(db_uri, { useNewUrlParser: true }, (error, client) => {

    if (error) return console.error('Error connecting to MongoDB: ', error);

    db = client.db('mural');
    imageStore = new ImageStore(db);

    app.listen((process.env.PORT || 3000), () => {
        console.log('Listening on port ' + 3000);
    });
});
