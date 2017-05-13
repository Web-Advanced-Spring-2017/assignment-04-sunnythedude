  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA74Lhts9mbFybUtO6d8QQzrTvgO3HBGCM",
    authDomain: "ns-bulletin-board.firebaseapp.com",
    databaseURL: "https://ns-bulletin-board.firebaseio.com",
    projectId: "ns-bulletin-board",
    storageBucket: "ns-bulletin-board.appspot.com",
    messagingSenderId: "332802312142"
  };
  firebase.initializeApp(config);


var sellItemsRef = firebase.database().ref('sell-items');


sellItemsRef.once('value').then(function(snapshot) {
  console.log(snapshot.toJSON());
  snapshot.forEach(function(childSnapshot, i) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      console.log('key:', key);
      console.log('i:', i)
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      console.log('thisChild:', childData);
      console.log('name: ', childData.name);
      console.log('description:', childData.description);
      $('#product-name').replaceWith('<h3>'+childData.name+'</h3>');
      $('#product-price').replaceWith('<p>'+'$' + childData.price+'.00'+'</p>');
      $('#product-img').replaceWith('<img src="' + childData.image + '">');
  });

});

$('#image').on("change", function(event) {
	selectedFile = event.target.files[0];
});

    function post_stuff(){
        //document.write(bfp + "</br>");
        console.log(document.getElementById("item-name").value);
        console.log(document.getElementById("price").value);
        console.log(document.getElementById("description").value);
        console.log(document.getElementById("image").value);

        var newItemRef = sellItemsRef.child(Date.now());

        var filename = selectedFile.name;
        var storageRef = firebase.storage().ref('img/' + filename);
        var uploadTask = storageRef.put(selectedFile);



        // console.log(document.getElementById("address").value);
        // console.log(document.getElementById("email").value);

		        // Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on('state_changed', function(snapshot){
		  // Observe state change events such as progress, pause, and resume
		  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		  console.log('Upload is ' + progress + '% done');
		  switch (snapshot.state) {
		    case firebase.storage.TaskState.PAUSED: // or 'paused'
		      console.log('Upload is paused'); 
		      break;
		    case firebase.storage.TaskState.RUNNING: // or 'running'
		      console.log('Upload is running');
		      break;
		  }
		}, function(error) {
		  // Handle unsuccessful uploads
		}, function() {
		  // Handle successful uploads on complete
		  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		  var downloadURL = uploadTask.snapshot.downloadURL;
		  console.log(downloadURL);
		  newItemRef.set({
	          name: document.getElementById("item-name").value, 
	          price: document.getElementById("price").value,
	          description: document.getElementById("description").value,
	          // image: document.getElementById("image").value,
	          image: downloadURL,
	          timestamp: Date.now()
	        }).then(function(){
	          console.log('success: save newItem');
	        }).catch(function(err){
	          console.log('error: ', err);
	        });
		});
        
    }