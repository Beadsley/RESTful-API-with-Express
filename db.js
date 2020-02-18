const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'presidents';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, { id: "dan" })
    findDocuments(db, (files) => { console.log(files) });
    //client.close()

    // removeDocument(db, () => { client.close() });

});

const insertDocuments = function (db, obj, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertOne(
        obj
        , function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted document into the collection");
            //callback(result);
        });
}

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs.length)
        callback(docs);
    });
}

const indexCollection = function (db, callback) {
    db.collection('documents').createIndex(
        { "a": 1 },
        null,
        function (err, results) {
            console.log('results: ', results);
            callback();
        }
    );
};

const removeDocument = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteMany({}, function (err, result) {
        assert.equal(err, null);
        console.log("Removed everything");
        callback(result);
    });
}

const getDocuments = () => {
    return new Promise((resolve, reject) => {
       const collection = db.collection('documents');
       collection.find({}).toArray(function (err, docs) {
         if (err) {
           reject(err);
         }
         resolve(docs);
       });
     })
   }

module.exports = {
    getDocuments
  };