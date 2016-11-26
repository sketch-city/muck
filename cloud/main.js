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
cardQuery.get(request.params.cardID, {
success:function(card)
{
var databaseQuery = new Parse.Query("Database");
databaseQuery.first({
success: function(database) {
//give the card an ID
var idNumber = database.get("cardIdCounter");
database.increment("cardIdCounter");
card.set("idNumber", idNumber);

var sale = new Parse.Object("Sale");
sale.set("cardID", idNumber);
sale.set("likes", 0);
sale.set("seller", card.get("creator"));
sale.set("stock", 10);
sale.set("card", card);
sale.set("name", card.get("name"));
sale.set("tags", card.get("tags"));

//TODO go through each tag and increment tag counters

request.user.increment("blankCards", -1);
setOwnedCard(request.user, idNumber, true);

Parse.Object.saveAll([request.user, card, database, sale], {
success: function(list) {
//assumes all are saved
response.success();
},
error: function(error) {
response.error("Couldn't save");
}
});
},
error: function() {
response.error(-1);
}
});
},
error: function() {
response.error("Couldn't find card");
}
})
});
