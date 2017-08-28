function helloMyParse()
{
    alert("attempting save");
    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("cardforgegame"); // Your App Name
    Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL
    //parse.useMasterKey = true;

    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.set("whatev",: "whatwwhat");

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
