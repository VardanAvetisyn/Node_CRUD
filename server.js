const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const multer = require('multer'); // Add multer for handling file uploads

const app = express();

const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://VardanAvetisyan:V20080711_v@cluster0.pukcmgx.mongodb.net/TumoUsers';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');

const { Schema } = mongoose;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const SchemaProduct = new Schema({
    UserName: String,
    Email: String,
    Password: String,
    Age: Number,
    image: String
});

const Products = mongoose.model('Products', SchemaProduct);

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB!');
    try {
        const accProgm = await Products.createCollection();
    } catch (error) {
        console.error('Error retrieving data:', error);
    } finally {
        mongoose.connection.close();
    }
});

app.get("/", function (req, res) {
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let result = await mongoose.connection.db.collection('theaters').find({ 'location.address.city': 'Bloomington' }).toArray()
            res.render('../public/form.ejs', {
                obj: result
            });
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});

// Modified endpoint to handle user registration
app.post('/addUser', upload.single('image'), async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const age = req.body.age;
    const region = req.body.region;
    const image = req.file ? req.file.buffer.toString('base64') : null; // Convert image to base64

    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        console.log('Connected to MongoDB!');
        try {
            let result = await mongoose.connection.db.collection('users').insertOne({
                UserName: name,
                Email: email,
                Password: password,
                Age: age,
                image: image
            });
            res.json(result);
        } catch (error) {
            console.error('Error inserting user:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});


//  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
//  const db = mongoose.connection;
//  db.on('error', console.error.bind(console, 'Connection error:'));
//  db.once('open', async () => {
//      console.log('Connected to MongoDB!');
//      try {
//         let result = await mongoose.connection.db.collection('users').deleteOne({ name: { $gte: "Robert Baratheon" } })
//         //  res.json(result);
//      } catch (error) {
//          console.error('Error retrieving movies:', error);
//      } finally {
//          mongoose.connection.close();
//      }
//  })

app.listen(3000, function () {
    console.log("Example is running on port 3000");
});
