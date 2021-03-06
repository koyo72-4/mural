let ObjectId = require('mongodb').ObjectID;

module.exports = class ImageStore {
    constructor(db) {
        this.db = db;
        this.collection = db.collection('images');
    }

    findImages(callback) {
        let cursor = this.collection.find({}).sort([['createdAt', 1]]);
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

    updateColor(imageId, color, callback) {
        this.collection.updateOne(
            { "_id": ObjectId(imageId) },
            { $set:
                { "borderColor": color }
            },
            (error, result) => {
                if (error) return console.error(error);
                callback();
            }
        );
    }

    reset(callback) {
        this.collection.drop(() => {
            const images = require('../seed/images.js')
            this.collection.insertMany(images, (error, result)=>{
                callback();
            });
        });
    }

}