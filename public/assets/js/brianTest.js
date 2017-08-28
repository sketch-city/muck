$(function() {

    Parse.$ = jQuery;

    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("texasRescue"); // Your App Name
    Parse.serverURL = 'https://cardforge.herokuapp.com/parse'; // Your Server URL

    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({foo: "barian test here now"}).then(function(object) {
      alert("yay! it worked");
    });

});
