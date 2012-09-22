var util = require('util');

var log4js = require('log4js');
var logger = log4js.getLogger();

var DataStateFactory = require('../abstract-sharing-component/DataStateFactory.js');

/**
 * The state factory for group specific tasks
 */
function GroupDataStateFactory(owner)
{
   this.owner = owner;
   this.factory = new DataStateFactory(this.owner);

   /**
    * @returns a new LoadingDataState instance
    */
   this.createLoadingDataState = function(documentId)
   {
      var state = this.factory.createLoadingDataState(documentId);
      var superHandOverToNextState = state.handOverToNextState;
      var superOnNoDataFound = state.onNoDataFound;
      var pendingStates = [];

      state.registerSyncState = function(syncState)
      {
         pendingStates.push(syncState);
      };

      state.handOverToNextState = function(nextState)
      {
         superHandOverToNextState.call(state, nextState);
         pendingStates.forEach(function(syncState)
         {
            nextState.registerSyncState(syncState);
         });
      };

      state.onNoDataFound = function()
      {
         superOnNoDataFound.call(state);
         pendingStates.forEach(function(syncState)
         {
            syncState.onPendingGroupLoaded(documentId);
         });
      };

      state.removeMemberIfNotInterest = function(character)
      {
         return false;
      };

      return state;
   };

   /**
    * @returns a new ActiveDataState instance
    */
   this.createActiveDataState = function(dataObject)
   {
      var state = this.factory.createActiveDataState(dataObject);
      var superActivate = state.activate;
      var superOnCharacterSessionAdded = state.onCharacterSessionAdded;
      var superRemoveShares = state.removeShares;

      state.activate = function()
      {
         var owner = this.getOwner();

         superActivate.call(this);

         this.removeAllMembersWithoutInterest(false);
         owner.getBroadcaster().broadcastGroupMembership(dataObject, dataObject.getMembers(), []);
      };

      state.registerSyncState = function(syncState)
      {
         syncState.onPendingGroupLoaded(dataObject.getDocumentId());
      };

      state.onCharacterSessionAdded = function(character, interest, responseQueue)
      {
         superOnCharacterSessionAdded.call(this, character, interest, responseQueue);

         if (dataObject.isCharacterMember(character))
         {
            this.getOwner().getBroadcaster().broadcastGroupMembership(dataObject, dataObject.getMembers(), [],
                  interest, responseQueue);
         }
      };

      state.removeShares = function(interest)
      {
         superRemoveShares.call(this, interest);

         this.removeAllMembersWithoutInterest(true);
      };

      state.addMember = function(character)
      {
         var owner = this.getOwner();

         if (dataObject.addMember(character))
         {
            dataObject.saveToStorage(owner.getStorage());
            owner.getBroadcaster().broadcastGroupMembership(dataObject, [ character.getCharacterId() ], []);
         }
      };

      state.removeMember = function(character)
      {
         var owner = this.getOwner();

         if (dataObject.removeMember(character))
         {
            dataObject.saveToStorage(owner.getStorage());
            owner.getBroadcaster().broadcastGroupMembership(dataObject, [], [ character.getCharacterId() ]);
         }
      };

      state.removeMemberIfNotInterest = function(character)
      {
         var rCode = false;

         if (!dataObject.isInterestForCharacter(character) && dataObject.removeMember(character))
         {
            logger.info("Character " + character + " does not have an interest for group " + dataObject
                  + " anymore, removing membership");
            rCode = true;
         }

         return rCode;
      };

      state.removeAllMembersWithoutInterest = function(sendBroadcast)
      {
         var owner = this.getOwner();
         var removed = [];
         var self = this;

         owner.forEachSynchronizedCharacter(function(character)
         {
            if (self.removeMemberIfNotInterest(character))
            {
               removed.push(character.getCharacterId());
            }
         });
         if (removed.length > 0)
         {
            dataObject.saveToStorage(owner.getStorage());
            if (sendBroadcast)
            {
               owner.getBroadcaster().broadcastGroupMembership(dataObject, [], removed);
            }
         }
      };

      return state;
   };

}

module.exports = GroupDataStateFactory;
