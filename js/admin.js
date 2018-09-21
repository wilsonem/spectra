var storage = firebase.storage();
var storageRef = storage.ref();
var db = firebase.database();

var blocksRef = db.ref("blocks/");
var tagsRef = db.ref("tags/");
//var colorsRef = db.ref("colors/")


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //alert(user.email);
        $("#add-data").show();
        $("#sign-in").hide();
    } else {
        alert("not logged in");
        $("#add-data").hide();
        $("#sign-in").show();
    }
});

function loginUser() {
    var email = $("#email").val();
    var password = $("#password").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        // Sign-in successful.
    }).catch(function(error) {
        alert(error.message);
    });
}

function logout() {
    //alert("logout clicked");
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
        alert(error.message);
    });
}

function addData() {
    var valid = true;
    
    // do connect blocks and tags later
    var toAdd = {};
  
    // gather name info
    var fname = $("#fname").val();
    var lname = $("#lname").val();
    if (fname == "" && lname == "") {
        fname = "[name]";
    } 
    toAdd.first_name = fname;
    toAdd.last_name = lname;
  
    // gather grad year
    var year = $("#year").val();
    if (year == "") {
        year = "[year]";
    }
    toAdd.grad_year = year;
  
    // gather email
    var email = $("#add-email").val();
    if (email != "") {
        toAdd.email = email;
    }
  
    // gather tags and colors
    var ts = $("#tags").val();
    //var cs = $("#colors").val();
  
    // gather file info
    var file = $("#chooseFile").get(0).files[0];
    var fileName = file.name;
    var fileType = file.type;
    var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
  
    // check for valid img file
    if ($.inArray(fileType, ValidImageTypes) < 0) {
        alert("Please choose a vaild image file");
    } else {
  
        // get standardized names for the img stuff
        var endIndex = fileName.indexOf(".");
        var filteredName = fileName.slice(0, endIndex);
    
        var nameAndDate = filteredName + '-' + +new Date;
        var metadata = {contentType: file.type};
        var task = storageRef.child("blocks/"+nameAndDate).put(file, metadata);
    
        // put the image in online storage
        task.then((data) => {
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
    
                // prep tagString and colorString
                var tagString = prepList(ts);
                var tagList = tagString.split(",");
                // var colorString = prepList(cs);
                // var colorList = colorString.split(",");
                toAdd.tags = tagString;
                // toAdd.colors = colorString;
    
                // add block info
                toAdd.block_img = downloadURL;
                toAdd.file_name = filteredName;
                toAdd.full_file_name = fileName;
                
    
                db.ref('blocks/' + nameAndDate).set(toAdd).then(() => {
                // add to tags stuff
                tagsRef.once('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        for (var i = 0; i < tagList.length; i++) {
                            if (childSnapshot.key == tagList[i]) {
                                var updates = {};
                                updates['tags/' + childSnapshot.key] = childSnapshot.val() + nameAndDate + ",";
                                db.ref().update(updates);
                                tagList.splice(i, 1);
                            }
                        }
                    });
                }).then(() => {
                    if (tagList.length != 0) {
                        for (var i = 0; i < tagList.length; i++) {
                            if (tagList[i] != '') {
                                var updates = {};
                                updates['tags/' + tagList[i]] = nameAndDate + ",";
                                db.ref().update(updates);
                            }
                        }
                    }

                    $("#fname").val("");
                    $("#lname").val("");
    
                    $("#year").val("");
                    $("#add-email").val("");

                    $("#tags").val("");
    
                    $("#chooseFile").val("");
    

                });
    
                // // add to colors stuff
                // colorsRef.once('value', function(snapshot) {
                //     snapshot.forEach(function(childSnapshot) {
                //         for (var i = 0; i < colorList.length; i++) {
                //             if (childSnapshot.key == colorList[i]) {
                //                 var updates = {};
                //                 updates['colors/' + childSnapshot.key] = childSnapshot.val() + nameAndDate + ",";
                //                 db.ref().update(updates);
                //                 colorList.splice(i, 1);
                //             }
                //         }
                //     });
                // }).then(() => {
                //     if (colorList.length != 0) {
                //         for (var i = 0; i < colorList.length; i++) {
                //             if (colorList[i] != '') {
                //             var updates = {};
                //             updates['colors/' + colorList[i]] = nameAndDate + ",";
                //             db.ref().update(updates);
                //             }
                //         }
                //     }
                // });
    
                }).catch((error) => {
                    alert(error.message);
                });
            });
        }).catch((error) => {
            alert(error.message);
        });
    }
}

function prepList(string) {
    string = string.toLowerCase();
    list = string.split(",");
    var newString = "";
    for (var i=0; i < list.length; i++) {
        list[i] = $.trim(list[i]);
        if (list[i] != "") {
            newString += list[i] + ",";
        }
    }
    return newString;
  }