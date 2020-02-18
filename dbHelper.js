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
            if(!err){
                console.log(`Inserted "${obj.name}" document into the collection`);
            }
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
    const myquery = { _id: new mongodb.ObjectID(id) };
    collection.deleteOne(myquery, function (err) {
        if (!err){
            console.log(`Removed ${id}`);
        }
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