const express = require('express');
const bodyParser = require('body-parser');

const password = 'vKTjwkvxlckdG3aP';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://organicUser:vKTjwkvxlckdG3aP@cluster0.pf9xm.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get("/products", (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('okay paisi');
                res.send('success')
            })
    });

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    });

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price);
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
        {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
        .then(result => {
            console.log(result);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
            })
    });
});



app.listen(5500);