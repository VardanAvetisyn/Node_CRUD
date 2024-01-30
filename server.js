// server.js

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
            res.redirect('/users'); // Redirect to the /users page after successful user insertion
        } catch (error) {
            console.error('Error inserting user:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});

// Add a new route to display user data with update and delete links
app.get("/users", async function (req, res) {
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let users = await mongoose.connection.db.collection('users').find({}).toArray();
            res.render('../public/users.ejs', { users });
        } catch (error) {
            console.error('Error retrieving users:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});

// Add routes for updating and deleting users
app.get("/users/update/:id", async function (req, res) {
    const userId = req.params.id;
    res.render('../public/updateUser.ejs', { userId });
});

app.post("/users/update/:id", upload.single('newImage'), async function (req, res) {
    const userId = req.params.id;
    const newName = req.body.newName;
    const newEmail = req.body.newEmail;
    const newAge = req.body.newAge;
    const newPassword = req.body.newPassword;
    const newImage = req.file ? req.file.buffer.toString('base64') : null; // Convert new image to base64

    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            // Create an object to hold the updated fields
            const updateFields = {
                UserName: newName,
                Email: newEmail,
                Age: newAge
                // You can add more fields to update as needed
            };

            // Include password and image in the update only if they are provided
            if (newPassword) {
                updateFields.Password = newPassword;
            }

            if (newImage) {
                updateFields.image = newImage;
            }

            // Update user information by ID
            await mongoose.connection.db.collection('users').updateOne(
                { _id: new mongoose.Types.ObjectId(userId) },
                { $set: updateFields }
            );

            res.redirect('/users'); // Redirect to the /users page after successful update
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});

app.get("/users/delete/:id", async function (req, res) {
    const userId = req.params.id;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            // Find and delete the user by ID
            await mongoose.connection.db.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
            res.redirect('/users'); // Redirect to the /users page after successful deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            mongoose.connection.close();
        }
    });
});

app.listen(3000, function () {
    console.log("Example is running on port 3000");
});
