function helloMyParse()
{
    alert("attempting save");
    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("cardforgegame","brian"); // Your App Name
    Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL
    Parse.useMasterKey = true;

    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.set("whatev", "whatwwhat");

    testObject.save(null, {
    success: function(testObject) {
      alert('New object created with objectId: ' + testObject.id);
    },
    error: function(testObject, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
})

};


function createNewGPSMarker (name, description, positionData)
{
  alert("attempting save gps marker");
  // Replace this line with the one on your Quickstart Guide Page
  Parse.initialize("cardforgegame","brian"); // Your App Name
  Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL
  Parse.useMasterKey = true;



  var TestObject = Parse.Object.extend("GPSMarkerObject");
  var testObject = new TestObject();

  var postACL = new Parse.ACL(Parse.User.current());
  postACL.setPublicReadAccess(true);
  postACL.setPublicWriteAccess(false);
  testObject.setACL(postACL);
  testObject.set("name", name);
  testObject.set("description",description);
  testObject.set("positionData",positionData);
  testObject.save(null, {
  success: function(testObject) {
    alert('New object created with objectId: ' + testObject.id);
  },
  error: function(testObject, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  }
})
}

function retrieveGPSMarkers (callbackFunction)
{
  alert("querying list of gps markers");

  Parse.$ = jQuery;
  Parse.initialize("cardforgegame","brian"); // Your App Name
  Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL
  Parse.useMasterKey = true;

  var gpsMarker = Parse.Object.extend("GPSMarkerObject");
  var query = new Parse.Query(gpsMarker);
  query.find({
    success: function(results) {
      alert("Successfully retrieved " + results.length + " gps markers.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        //alert(object.id + ' - ' + object.get('name'));

      }
        callbackFunction(results);
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      callbackFunction(error);
    }
  });
}

function deleteGPSMarker (callbackFunction)
{
  alert("querying list of gps markers");

  Parse.$ = jQuery;
  Parse.initialize("cardforgegame","brian"); // Your App Name
  Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL
  Parse.useMasterKey = true;

  var gpsMarker = Parse.Object.extend("GPSMarkerObject");
  var query = new Parse.Query(gpsMarker);
  query.find({
    success: function(results) {
      alert("Successfully retrieved " + results.length + " gps markers.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        //alert(object.id + ' - ' + object.get('name'));

      }
        callbackFunction(results);
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      callbackFunction(error);
    }
  });
}
