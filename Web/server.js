/**
 * Created by Will on 2017-03-03.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://will:willy@ds147797.mlab.com:47797/star-wars-quotes',
    function (err, database)
    {
        if (err) return console.log(err);
        db = database;
        app.listen(process.env.PORT || 3000, function ()
        {
            console.log('listening on 3000');
        })
    });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));  // make public folder accessible to the public


app.get('/', function (req, res)
{
    // res.sendFile(__dirname + '/index.html');
    db.collection('quotes').find().toArray(function (err, result)
    {
        if (err) return console.log(err);
        // render index.ejs
        res.render('index.ejs', {quotes: result});
        // console.log(result);
    })
});

app.post('/quotes', function (req, res)
{
    // console.log(req.body);
    db.collection('quotes').save(req.body, function (err, result)
    {
        if (err) return console.log(err);

        console.log('saved to database');
        res.redirect('/');
    })
});

app.put('/quotes', function (req, res)
{
    // Handle put request
    db.collection('quotes').findOneAndUpdate
    (
        {name: 'Yoda'},
        {$set:
            {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {sort: {_id: -1},
            upsert: true
        },
        function (err, result)
        {
            if (err) return res.send(err);
            res.send(result);
        }
    )
});

app.delete('/quotes', function (req, res)
{
    // Handle delete request
    db.collection('quotes').findOneAndDelete
    (
        {name: req.body.name},
        function (err, result)
        {
            if (err) return res.send(500, err);
            res.send('A darth quote get deleted');
        }
    )
});









