module.exports = class ImageStore {
    constructor(db) {
        this.db = db;
        this.collection = db.collection('images');
    }

    findImages(callback) {
        let cursor = this.collection.find({});
        cursor.toArray((error, documents) => {
            callback(documents);
        });
    }

    addImage(imageObject, callback) {
        this.collection.insertOne(imageObject, (error, result) => {
            if (error) return console.error(error);
            callback();
        });
    }

}