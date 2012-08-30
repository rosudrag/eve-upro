var util = require('util');

var log4js = require('log4js');
var logger = log4js.getLogger();

var UuidFactory = require('../util/UuidFactory.js');
var Component = require('../components/Component.js');
var busMessages = require('../model/BusMessages.js');

var Group = require('./Group.js');
var PendingGroupDataProcessingState = require('./PendingGroupDataProcessingState.js');
var ActiveGroupDataProcessingState = require('./ActiveGroupDataProcessingState.js');

function GroupServiceComponent(services, groupFactory)
{
   GroupServiceComponent.super_.call(this);

   this.amqp = services['amqp'];
   this.mongodb = services['mongodb'];
   this.characterAgent = services['character-agent'];
   this.groupFactory = groupFactory;

   this.groupDataProcessingStatesById = {};

   /** {@inheritDoc} */
   this.start = function()
   {
      var self = this;

      this.characterAgent.on('CharacterOnline', function(character)
      {
         self.onCharacterOnline(character);
      });
      this.characterAgent.on('SessionAdded', function(character, sessionId)
      {
         self.onCharacterSessionAdded(character, sessionId);
      });
      this.characterAgent.on('CharacterOffline', function(character)
      {
         self.onCharacterOffline(character);
      });

      this.registerBroadcastHandler(busMessages.Broadcasts.ClientRequestCreateGroup.name);
      this.registerGroupBroadcastHandler(busMessages.Broadcasts.ClientRequestDestroyGroup.name);
      this.registerGroupBroadcastHandler(busMessages.Broadcasts.ClientRequestLeaveGroup.name);
      this.registerGroupBroadcastHandler(busMessages.Broadcasts.ClientRequestJoinGroup.name);
      this.registerGroupBroadcastHandler(busMessages.Broadcasts.ClientRequestAdvertiseGroup.name);

      this.mongodb.defineCollection(Group.CollectionName, [ 'members', 'adCharacter', 'adCorporation' ], function()
      {
         self.onStarted();
      });
   };

   this.registerBroadcastHandler = function(broadcastName)
   {
      var self = this;
      var handler = this['onBroadcast' + broadcastName];

      this.amqp.on('broadcast:' + broadcastName, function(header, body)
      {
         handler.call(self, header, body);
      });
   };

   this.registerGroupBroadcastHandler = function(broadcastName)
   {
      var self = this;

      this.amqp.on('broadcast:' + broadcastName, function(header, body)
      {
         self.onGroupBroadcast(header, body);
      });
   };

   this.setGroupDataProcessingState = function(groupId, state)
   {
      if (state)
      {
         this.groupDataProcessingStatesById[groupId] = state;
      }
      else
      {
         delete this.groupDataProcessingStatesById[groupId];
      }
   };

   /**
    * Character state handler
    */
   this.onCharacterOnline = function(character)
   {
      var self = this;
      var characterId = character.getCharacterId();
      var filter =
      {
         $or: [
         {
            "data.members": characterId
         },
         {
            "data.adCharacter": characterId
         },
         {
            "data.adCorporation": characterId
         } ]
      };

      this.mongodb.getData(Group.CollectionName, filter, function(err, id, data)
      {
         if (id)
         {
            self.onReferencedGroupFound(UuidFactory.fromMongoId(id));
         }
      },
      {
         _id: true
      });
   };

   this.onReferencedGroupFound = function(groupId)
   {
      this.ensureGroupDataProcessingState(groupId);
   };

   /**
    * Character state handler
    */
   this.onCharacterSessionAdded = function(character, sessionId)
   {
      var responseQueue = character.getResponseQueue(sessionId);
      var interest = [
      {
         scope: 'Session',
         id: sessionId
      } ];

      for ( var groupId in this.groupDataProcessingStatesById)
      {
         var state = this.groupDataProcessingStatesById[groupId];

         state.onCharacterSessionAdded(character, interest, responseQueue);
      }
   };

   /**
    * Character state handler
    */
   this.onCharacterOffline = function(character)
   {
      // TODO: iterate through all groups and see if this was the last one to go offline - remove it then
   };

   /**
    * Broadcast handler
    */
   this.onBroadcastClientRequestCreateGroup = function(header, body)
   {
      var character = this.characterAgent.getCharacterBySession(header.sessionId);

      if (character)
      {
         var characterId = character.getCharacterId();
         var group = this.groupFactory.create(body.name, [ characterId ]);

         logger.info('Character ' + character.toString() + ' creates group ' + group.toString());
         this.groupDataProcessingStatesById[group.getId()] = new ActiveGroupDataProcessingState(this, group);
         group.addMember(characterId);
         group.saveToStorage(this.mongodb);
         this.broadcastGroupMembersAdded(group, group.getMembers());
      }
   };

   /**
    * Broadcast handler
    */
   this.onGroupBroadcast = function(header, body)
   {
      var character = this.characterAgent.getCharacterBySession(header.sessionId);

      if (character)
      {
         var characterId = character.getCharacterId();
         var state = this.ensureGroupDataProcessingState(body.groupId);

         state.processBroadcast(characterId, header, body);
      }
   };

   this.ensureGroupDataProcessingState = function(groupId)
   {
      var state = this.groupDataProcessingStatesById[groupId];

      if (!state)
      {
         state = new PendingGroupDataProcessingState(this, groupId);
         state.activate();
      }

      return state;
   };

   /**
    * Process client request
    */
   this.processClientRequestDestroyGroup = function(group, characterId, body)
   {
      var character = this.characterAgent.getCharacterById(characterId);

      if (character && group.allowsControllingActionsFrom(character))
      {
         logger.info('Character ' + character.toString() + ' destroys group ' + group.toString());
         group.deleteFromStorage(this.mongodb);
         delete this.groupDataProcessingStatesById[group.getId()];

         this.broadcastGroupMembersRemoved(group, group.getMembers());
         this.broadcastGroupAdvertisements(group, false);
      }
   };

   /**
    * Process client request
    */
   this.processClientRequestLeaveGroup = function(group, characterId, body)
   {
      var character = this.characterAgent.getCharacterById(characterId);

      if (character && group.removeMember(characterId))
      {
         logger.info('Character ' + character.toString() + ' leaves group ' + group.toString());
         this.broadcastGroupMembersRemoved(group, [ characterId ]);
         if (group.isEmpty())
         {
            group.deleteFromStorage(this.mongodb);
            delete this.groupDataProcessingStatesById[group.getId()];
         }
         else
         {
            group.saveToStorage(this.mongodb);
         }
      }
   };

   /**
    * Process client request
    */
   this.processClientRequestJoinGroup = function(group, characterId, body)
   {
      var character = this.characterAgent.getCharacterById(characterId);

      if (character && group.isCharacterInvited(character) && group.addMember(characterId))
      {
         logger.info('Character ' + character.toString() + ' joins group ' + group.toString());
         group.saveToStorage(this.mongodb);
         this.broadcastGroupMembersAdded(group, [ characterId ]);
      }
   };

   /**
    * Process client request
    */
   this.processClientRequestAdvertiseGroup = function(group, characterId, body)
   {
      var character = this.characterAgent.getCharacterById(characterId);

      if (character && group.allowsControllingActionsFrom(character))
      {
         var change = false;

         body.interest.forEach(function(interest)
         {
            if (group.addAdvertisement(interest.scope, interest.id))
            {
               change = true;
            }
         });
         if (change)
         {
            group.saveToStorage(this.mongodb);
            this.broadcastGroupAdvertisements(group, true);
         }
      }
   };

   /**
    * Broadcasts all current group data
    * 
    * @param group the group to broadcast data about
    */
   this.broadcastGroupData = function(group)
   {
      this.broadcastGroupAdvertisements(group, true);
      this.broadcastGroupMembersAdded(group, group.getMembers());
   };

   /**
    * Broadcast membership message for added members
    * 
    * @param group the Group object
    * @param members the list of members to send
    * @param interest the interest for the broadcast message. if not given, the groups interest will be used
    * @param queueName optional specific queue name to send to
    */
   this.broadcastGroupMembersAdded = function(group, members, interest, queueName)
   {
      var header =
      {
         type: busMessages.Broadcasts.GroupMembership.name,
         interest: interest || group.getInterest()
      };
      var body =
      {
         groupId: group.getId(),
         added:
         {
            groupData: group.getGroupData(),
            members: members
         }
      };

      this.amqp.broadcast(header, body, queueName);
   };

   /**
    * Broadcast membership message for removed members
    * 
    * @param group the Group object
    * @param members the list of members to send
    * @param interest the interest for the broadcast message. if not given, the groups interest will be used
    * @param queueName optional specific queue name to send to
    */
   this.broadcastGroupMembersRemoved = function(group, members, interest, queueName)
   {
      var header =
      {
         type: busMessages.Broadcasts.GroupMembership.name,
         interest: interest || group.getInterest()
      };
      var body =
      {
         groupId: group.getId(),
         removed:
         {
            members: members
         }
      };

      this.amqp.broadcast(header, body, queueName);
   };

   this.broadcastGroupAdvertisements = function(group, invited, interest, queueName)
   {
      var header =
      {
         type: busMessages.Broadcasts.GroupAdvertisement.name,
         interest: interest || group.getAdvertisementInterest()
      };
      var body =
      {
         groupId: group.getId()
      };
      if (invited)
      {
         body.groupData = group.getGroupData();
      }

      this.amqp.broadcast(header, body, queueName);
   };
}
util.inherits(GroupServiceComponent, Component);

module.exports = GroupServiceComponent;