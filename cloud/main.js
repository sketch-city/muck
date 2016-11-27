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
cardQuery.equalTo("objectId", request.params.cardID);

cardQuery.first({
       useMasterKey: true, // <--- here
       success: function(card) {
         console.log(card.objectId);
         response.success("holy cow success");
       },
       error: function(error) {
       response.error("Couldn't query database");
     }
   });
 });
