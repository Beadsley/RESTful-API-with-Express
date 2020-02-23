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
};

const updateDocument = (db, id, obj) => {
    return new Promise((resolve, reject) => {

        const collection = db.collection('documents');
        const myquery = { _id: new mongodb.ObjectID(id) };

        collection.updateOne(myquery
            , { $set: obj }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(`Updates with ${obj.name}`);
                    resolve(result);
                }
            });
    })
};

const insertDocuments = function (db, obj) {

    const collection = db.collection('documents');

    collection.insertOne(
        obj
        , function (err, result) {
            if (!err) {
                console.log(`Inserted "${obj.name}" document into the collection`);
            }
        });
};

const removeAll = function (db) {

    const collection = db.collection('documents');

    collection.deleteMany({}, function (err, result) {
        if (!err) {
            console.log("Removed everything");
        }
    });
};

const remove = function (db, id) {

    const collection = db.collection('documents');
    const myquery = { _id: new mongodb.ObjectID(id) };

    collection.deleteOne(myquery, function (err) {
        if (!err) {
            console.log(`Removed ${id}`);
        }
    });
};

module.exports = {
    getDocuments,
    insertDocuments,
    removeAll,
    remove,
    updateDocument
};