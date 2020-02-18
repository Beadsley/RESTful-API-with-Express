const assert = require('assert');
const mongodb = require('mongodb');

const getDocuments = (db) => {
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

const insertDocuments = function (db, obj) {
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
        });
}

const removeAll = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteMany({}, function (err, result) {
        assert.equal(err, null);
        console.log("Removed everything");
        callback(result);
    });
}

const remove = function (db, id) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    console.log(id);
    
    const myquery = { _id: new mongodb.ObjectID(id) };
    collection.deleteOne(myquery, function (err) {
        assert.equal(err, null);
        console.log("Removed element");
    });
}



// TODO use promises instead of callbacks
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

module.exports = {
    getDocuments, 
    insertDocuments, 
    removeAll, 
    remove,
    findDocuments
};