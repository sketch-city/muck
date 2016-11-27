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
var updatedObjects = new Array();

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
       console.log(idNumber);

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
      updatedObjects.push(sale);
      updatedObjects.push(retrievedDatabase);
      updatedObjects.push(retrievedCard);
      updatedObjects.push(request.user);

      console.log ("got to saving!")
      Parse.Object.saveAll(updatedObjects, {
       useMasterKey: true,
      success: function(list) {
      //assumes all are saved
      response.success("saved all the stuff!");
      },
      error: function(error) {
      response.error("Couldn't save");
      }
      });

     },
     error: function(error) {
     response.error("Couldn't query database");
     }
   });
 });

 });

 /**
 * Finishes a multiplayer match, function sent by winner of match
 * User1 - ParseUserID of Winner
 * User2 - ParseUserID of Loser
 * MatchType--Ladder or Casual
 **/
 Parse.Cloud.define("mpMatchComplete", function(request, response) {
   var matchWinner = request.params.User1;
   var matchLoser = request.params.User2;

   console.log(matchWinner);
   console.log(matchLoser);

   var matchWinnerEloRating = request.params.User1Rating;
   var matchLoserEloRating = request.params.User2Rating;

   console.log(matchWinnerEloRating);

   console.log(matchLoserEloRating);

   //calculate elo changes
   //elo depends upon a table illustrated as such
   //ELO difference  Expected score:
   //  0 0.50
   //  20  0.53
   //  40  0.58
   //  60  0.62
   //  80  0.66
   //  100 0.69
   //  120 0.73
   //  140 0.76
   //  160 0.79
   //  180 0.82
   //  200 0.84
   //  300 0.93
   //  400 0.97
   //
   //The formula to calculate a player's new rating based on his/her previous one is:
   //Rn = Ro + C * (S - Se)      (1)
   //where:
   //Rn = new rating
   //Ro = old rating
   //S  = score  --this is usually 1, representing the "weight" of the match
   //Se = expected score
   //C  = constant --this represents the speed/volatility at which ratings will change, we'll use a value of 30

   var C = 30;
   var eloDifference = Math.abs(matchWinnerEloRating-matchLoserEloRating);
   console.log("eloDiff");
   console.log(eloDifference);

   var playerOneNewRating;
   var playerTwoNewRating;
   var scoreRatio;
   if(eloDifference <=20 && eloDifference >=0)
   {
     playerOneNewRating = matchWinnerEloRating + C *(0.51);
   }
   else
   if(eloDifference <=40)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.53);
   }
   else
   if(eloDifference <=60)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.58);
   }
   else
   if(eloDifference <=80)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.62);
   }
   else
   if(eloDifference <=100)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.66);
   }
   else
   if(eloDifference <=120)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.69);
   }
   else
   if(eloDifference <=140)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.73);
   }
   else
   if(eloDifference <=160)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.76);
   }
   else
   if(eloDifference <=180)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.79);
   }
   else
   if(eloDifference <=200)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.82);
   }
   else
   if(eloDifference <=300)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.87);
   }
   else
   if(eloDifference <=400)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.93);
   }
   else
   if(eloDifference >=401)
   {
     playerOneNewRating = matchWinnerEloRating + C *(1-0.95);
   }

   //subtract the difference of playerOneNewRating to set playerTwoNewRating
   var player1EloChange = playerOneNewRating-matchWinnerEloRating;
   playerTwoNewRating = matchLoserEloRating-player1EloChange;

   playerOneNewRating = Math.ceil(playerOneNewRating);
   playerTwoNewRating = Math.ceil(playerTwoNewRating);

   console.log("player1NewRating");
   console.log(playerOneNewRating);
   console.log("player2NewRating");
   console.log(playerTwoNewRating);

   var parseUserPointers = new Array();
   var updatedUserObjects = new Array();
   parseUserPointers.push(matchWinner);
   parseUserPointers.push(matchLoser);

   console.log("players ids:");
   console.log(parseUserPointers);
   console.log("player1 ID: ");
   console.log(matchWinner);
   console.log("player2 ID: ");
   console.log(matchLoser);

   //query for the two PFUser Objects based on the parameters
   var userQuery = new Parse.Query(Parse.User);
   userQuery.containedIn("objectId",parseUserPointers);
   userQuery.find({
     useMasterKey: true,
     success: function(results) {
       console.log(results.count);

       var userObject1 = results[0];
       var userObject2 = results[1];
       if(userObject1.objectId ==matchWinner)
       {
         userObject1.set("eloRating",playerOneNewRating);
         userObject2.set("eloRating",playerTwoNewRating);
       }
       else
       {
         userObject2.set("eloRating",playerOneNewRating);
         userObject1.set("eloRating",playerTwoNewRating);

       }
       updatedUserObjects.push(userObject1);
       updatedUserObjects.push(userObject2);

     },
     error: function() {
       response.error("Query Failed");
     }
   }).then(function(saveObjects)
   {
     Parse.Object.saveAll(updatedUserObjects, {
       useMasterKey:true,
       success: function(list) {
       //assumes all are saved
         response.success("user EloRatings Saved Successfully");
       },
       error: function(error) {
         response.error("Couldn't save");
         console.error("Got an error " + error.code + " : " + error.message);
       }
     });
   });
 });

 /**
 //afterSave function for notifying user about a like received on their cards
 //client will open a notification and bring the user to the editing screen to increase the power level of their card
 //notification will send out on first, 10th, and 50th likes
 //notification will contain separate data indicating when the card
 has reached a new tier in rarity and the player can modify its stats

 //get cardID from cardLike
 //query for card object
 //check number of likes
 //
 **/

 Parse.Cloud.afterSave("cardLike", function(request) {
   console.log ("afterSaveEvent Firing");

   var cardID = request.params.cardID;

   cardQuery = new Parse.Query("Card");
   query.get(request.params.cardID, {
     useMasterKey:true,
   success:function(card)
   {

       var originalLikes = card.get("likes");
       //add to card likes
       card.increment("likes");

       if(originalLikes==0)
       {
         //send a message for the first like notification
         console.log("first");
       }
       elseif(originalLikes==9)
       {
         console.log("10th");
         //send a message for the 10th like notification
       }
       elseif(originalLikes==49)
       {
         //send a message for the 50th like notification
       }

   },
     error: function(error) {
       console.error("Got an error " + error.code + " : " + error.message);
   }
   });
 });

 /**
 * Like a card. Needs both Card and Sale objects for updating
 *
 * cardID - Card's objectID
 * saleID - Sale's objectID
 *
 **/
 Parse.Cloud.define("likeCard", function(request, response) {
 //console.log("start");
   var cardQuery = new Parse.Query("Card");
   var retrievedCard;

   cardQuery.get(request.params.cardID, {
     useMasterKey:true,
     success:function(card)
     {
       console.log("retrieved card for like");
       retrievedCard = card;
     },
     error:function() {
      response.error("Couldn't find Card");
     }
   }).then(function(getSale)
   {
      console.log("getting sale");

       var saleQuery = new Parse.Query("Sale");
       saleQuery.get(request.params.saleID, {
         useMasterKey:true,
         success:function(sale)
         {
           console.log("retrieved card for sale");
           var userLikes = request.user.get("likes");
           if (userLikes <= 0)
             response.error("User has no likes left");
           else if (getLikedCard(request.user, retrievedCard.get("idNumber")))
             response.error("User already liked card");
           else
           {
             //console.log("enough likes");
             request.user.increment("likes", -1);
             var originalLikes = retrievedCard.get("likes");

             retrievedCard.increment("likes", 1);
             sale.increment("likes", 1);

             //TODO can do a push later
             request.user.increment("gold", 5);

             var cardname = retrievedCard.get("name");
             var fullString;
             var doUpdate = "NO"

             console.log("originalLikes:" +originalLikes);

             if(originalLikes ==0)
             {
               fullString = "Your Card " +cardname + " received its first like!  Get more likes to increase the card's power & rarity."
               doUpdate = "YES";
             }
             if(originalLikes ==9)
             {
               fullString = "Your Card " +cardname + " received its tenth like!  Get more likes to increase the card's power & rarity."
               doUpdate = "YES";
             }
             if(originalLikes ==50)
             {
               fullString = "Your Card " +cardname + " received its 50 like!  Look at you, Mr/Ms popular!"
               doUpdate = "YES";
             }
             //get the userID of the card owner to notify them about the like

             if(doUpdate =="YES")
             {


               var parseUserID = retrievedCard.get("creator");
               console.log("creator:" +parseUserID);
               //notify the parseUserID

               /*
               commenting out nov 29, need to put back in eventually
               Parse.Cloud.run('pushNotificationForUser', { userID: parseUserID, messageText:fullString, messageType:"likeNotification" }, {
                 success: function(userNotified) {
                   // ratings should be 4.5
                   console.log("user successfully notified");
                 },
                 error: function(error) {
                   console.log("error notifying user");
                 }
               });
               */

               Parse.Cloud.run('createMessageForUser', { userID: parseUserID, messageTitle:"Card Like!",messageText:fullString, messageType:"likeNotification" }, {
                 success: function(userNotified) {
                   // ratings should be 4.5
                   console.log("user message created");
                 },
                 error: function(error) {
                   console.log("error creating user message");
                   console.log(error.code);

                 }
               });

             }

             //saves user
             setLikedCard(request.user, retrievedCard.get("idNumber"), true);
             console.log("liked: " + getLikedCard(request.user, retrievedCard.get("idNumber")));


             Parse.Object.saveAll([request.user, retrievedCard, sale], {
               useMasterKey:true,
               success: function(list) {
               console.log("saved card likes");
               //assumes all are saved
                 response.success();
               },
               error: function(error) {
                 response.error("Couldn't save");
               }
             });
           }
         },
         error:function() {
           response.error("Couldn't find sale");
         }
       });
     });
 });



 Parse.Cloud.define('createMessageForUser', function(request, response)
 {
      console.log("attempting to create message");
     var ParseUserPointer = request.params.userID;
     var msgTxt = request.params.messageText;
     var msgType = request.params.messageType;
     var msgTitle = request.params.messageTitle;
     var rareCardID = request.params.rareCardID;

     console.log(ParseUserPointer);
     console.log(msgTxt);
     console.log(msgType);

     var userMsg = new Parse.Object("Message");
     userMsg.set("userPointer", ParseUserPointer);
     userMsg.set("body",msgTxt);
     userMsg.set("title",msgTitle);
     userMsg.set("msgType",msgType);
     if(rareCardID === null || rareCardID === "null")
     {

     }
     else
     {
       console.log("rare card ID for Message");
       console.log(rareCardID);
       userMsg.set("rareCardID",rareCardID);
     }
     userMsg.save(null, { useMasterKey: true ,
     success: function() {
     response.success();
     },
     error: function(error) {
     response.error("Failed to create message");
     }
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

 /***************************************************
 Functions for getting user's interacted cards
 ***************************************************/

 function getLikedCard(user, cardID)
 {
 return getCardInteraction(user, cardID, 0);
 }

 function getEditedCard(user, cardID)
 {
 return getCardInteraction(user, cardID, 1);
 }

 function getOwnedCard(user, cardID)
 {
 return getCardInteraction(user, cardID, 2);
 }

 function getReportedCard(user, cardID)
 {
   return getCardInteraction(user, cardID, 3);
 }

 function getCardInteraction(user, cardID, atBit){
 var interactionDic = user.get("interactedCards");

 if (interactionDic == null)
 return false;

 var interaction = interactionDic[cardID+""];
 if (interaction == null)
 return false;
 else
 {
 if ((interaction >> atBit) % 2 == 1)
 return true;
 }

 return false;
 }
