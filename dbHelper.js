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

module.exports = {
    getDocuments
  };