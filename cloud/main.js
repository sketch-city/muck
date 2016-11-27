/**
* Not actually any secure, but having function in cloud prevents errors in updating.
* In future can store level costs in cloud code
*
* levelID - string
* gold - integer
* blankCards - integer
*
*/



Parse.Cloud.define("levelComplete", function(request, response) {
var completedLevels = request.user.get("completedLevels");

if (completedLevels.indexOf(request.params.levelID) == -1)
{
request.user.increment("gold", request.params.gold);
request.user.increment("blankCards", request.params.goldReward);
completedLevels.push(request.params.levelID);

request.user.save({},{
success: function() {
response.success();
},
error: function(error) {
response.error("Couldn't save");
}
});
}
else{
response.error("Level already completed");
}
});


/**
* Publishes the card
* cardID - Card's objectID
*/
Parse.Cloud.define("publishCard", function(request, response) {
if (request.user.get("blankCards") <= 0)
{
response.error("No blank cards left");
return;
}
var cardQuery = new Parse.Query("Card");
var retrievedCard;
var retrievedDatabase;
var createdSale;
cardQuery.equalTo("objectId", request.params.cardID);

cardQuery.first({
       useMasterKey: true, // <--- here
       success: function(card) {
         console.log("got to card query yo");
         retrievedCard = card;
       },
       error: function(error) {
       response.error("Couldn't query database");
     }
   }).then(function(donextstuff)
   {
     console.log("got here too!");
     var databaseQuery = new Parse.Query("Database");
     databaseQuery.first({useMasterKey: true,
     success: function(database) {
       //give the card an ID
       retrievedDatabase = database;
       var idNumber = retrievedDatabase.get("cardIdCounter");
       retrievedDatabase.increment("cardIdCounter");
       retrievedCard.set("idNumber", idNumber);
       var sale = new Parse.Object("Sale");
       sale.set("cardID", idNumber);
       sale.set("likes", 0);
       sale.set("seller", retrievedCard.get("creator"));
       sale.set("stock", 10);
       sale.set("card", retrievedCard);
       sale.set("name", retrievedCard.get("name"));
       sale.set("tags", retrievedCard.get("tags"));
       createdSale = sale;
       //TODO go through each tag and increment tag counters

       request.user.increment("blankCards", -1);
       setOwnedCard(request.user, idNumber, true);
       /*




       */

     },
     error: function(error) {
     response.error("Couldn't query database");
     }
   });
 }).then(function(savethestuff)
 {
   console.log ("got to saving!")
   Parse.Object.saveAll([request.user, retrievedCard, retrievedDatabase, createdSale], {

   success: function(list) {
   //assumes all are saved
   response.success("saved all the stuff!");
   },
   error: function(error) {
   response.error("Couldn't save");
   }
   });
 });

 });

 /***************************************************
 Functions for setting user's interacted cards
 ***************************************************/

 function setLikedCard(user, cardID, state)
 {
 return setCardInteraction(user, cardID, 0, state);
 }

 function setEditedCard(user, cardID, state)
 {
 return setCardInteraction(user, cardID, 1, state);
 }

 function setOwnedCard(user, cardID, state)
 {
 return setCardInteraction(user, cardID, 2, state);
 }

 function setReportedCard(user, cardID, state)
 {
   return setCardInteraction(user, cardID, 3, state);
 }

 /** NOTE that this does NOT save the user */
 function setCardInteraction(user, cardID, atBit, state){
 var interactionDic = user.get("interactedCards");

 if (interactionDic == null)
 interactionDic = [];

 var interaction = interactionDic[cardID+""];
 if (interaction == null)
 {
 if (state)
 interaction = 1 << atBit;
 else
 interaction = 0;
 }
 else
 {
 if (state)
 interaction = interaction | (1 << atBit);
 else
 interaction = interaction & ~(1 << atBit);
 }

 interactionDic[cardID+""] = interaction;
 user.set("interactedCards", interactionDic);
 }
