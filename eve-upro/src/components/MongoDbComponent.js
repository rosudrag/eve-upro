var util = require('util');

var log4js = require('log4js');
var logger = log4js.getLogger();
var mongodb = require('mongodb');

var Component = require("./Component.js");

function MongoDbComponent(options)
{
   MongoDbComponent.super_.call(this);

   this.options = options;

   this.db = null;

   /** {@inheritDoc} */
   this.start = function()
   {
      this.requestServer();
   };

   /** {@inheritDoc} */
   this.tearDown = function()
   {
      if (this.db)
      {
         this.db.close();
         this.db = null;
      }
   };

   this.requestServer = function()
   {
      var self = this;
      var port = this.options.port || mongodb.Connection.DEFAULT_PORT;
      var dbOptions = {};

      this.server = new mongodb.Server(this.options.hostname, port, this.options.serverOptions);

      var dbConnector = new mongodb.Db(this.options.db, this.server, dbOptions);

      dbConnector.open(function(err, db)
      {
         if (err)
         {
            throw new Error('failed to open: ' + err);
         }
         self.db = db;
         if (self.options.username)
         {
            db.authenticate(self.options.username, self.options.password, {}, function(err)
            {
               self.onStartProgress();
            });
         }
         else
         {
            self.onStartProgress();
         }
      });
   };

   this.onStartProgress = function()
   {
      if (this.db)
      {
         this.onStarted();
      }
   };

   this.onError = function(message)
   {
      this.emit('error', message);
   };

   this.getDatabase = function()
   {
      return this.db;
   };

   this.collections = {};

   /**
    * Defines a collection - ensures its existence
    */
   this.defineCollection = function(collectionName, indexDef, callback)
   {
      var options = {};
      var self = this;

      this.db.collection(collectionName, options, function(err, collection)
      {
         if (err)
         {
            callback(err);
         }
         else
         {
            self.onCollection(collection, callback);
         }
      });
   };

   /**
    * Sets data in a collection
    */
   this.setData = function(collectionName, id, data, callback)
   {
      var collection = this.collections[collectionName];

      if (collection)
      {
         var document =
         {
            _id: id,
            entryTime: new mongodb.Timestamp(),
            data: data
         };

         collection.save(document,
         {
            safe: 1
         }, function(err, updated)
         {
            callback(err);
         });
      }
      else
      {
         process.nextTick(function()
         {
            callback('Collection <' + collectionName + '> not initialized');
         });
      }
   };

   /**
    * Retrieves data from a collection
    */
   this.getData = function(collectionName, filter, callback)
   {
      var collection = this.collections[collectionName];

      if (collection)
      {
         var self = this;

         var cursor = collection.find(filter);

         cursor.each(function(err, document)
         {
            self.onDocument(collection, document, callback);
         });
      }
      else
      {
         process.nextTick(function()
         {
            callback('Collection <' + collectionName + '> not initialized');
         });
      }
   };

   /**
    * Callback handler for ensuring existence of a collection.
    * 
    * @param collection the collection object
    * @param callback the user callback to call
    */
   this.onCollection = function(collection, callback)
   {
      this.collections[collection.collectionName] = collection;

      callback(null);
   };

   /**
    * Callback handler for a found document
    * 
    * @param collection the original collection
    * @param document the found document
    * @param callback the user callback
    */
   this.onDocument = function(collection, document, callback)
   {
      process.nextTick(function()
      {
         if (document)
         {
            callback(null, document.id, document.data);
         }
         else
         {
            callback(null, null, null);
         }
      });
   };

   /**
    * Deletes the document with given id in given collection
    * 
    * @param collection the collection to work in
    * @param id id of the document to delete
    */
   this.deleteDocument = function(collection, id)
   {
      collection.findAndModify(
      {
         _id: id
      }, {}, null,
      {
         remove: true
      }, function(err, document)
      {
         if (err)
         {
            logger.error('Failed to delete document ID [' + id + '] from [' + collection.collectionName + ']: ' + err);
         }
      });
   };

}
util.inherits(MongoDbComponent, Component);

module.exports = MongoDbComponent;