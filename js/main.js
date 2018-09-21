var storage = firebase.storage();
var storageRef = storage.ref();
var db = firebase.database();

var blocksRef = db.ref("blocks/");
var tagsRef = db.ref("tags/");
// var colorsRef = db.ref("colors/")

var img = [];
var mobileView = false;

window.onload = function() {
    generateWall();
}

function checkHeight() {
  if (window.innerHeight < 600) {
    $("#sort-group").removeClass("mb-5", 1000);
  }
}


function generateWall() {
  img = [];
  $("#wall").empty();
  // document.getElementById("wall").empty;

  blocksRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var info = {url:childSnapshot.val().block_img, key:childSnapshot.key}
      img.push(info);
    });
  }).then(() => {
    while (img.length > 0) {
      var ran = Math.round(Math.random() * (img.length-1));
      var url = img[ran].url;
      var key = img[ran].key;
      
      document.getElementById("wall").innerHTML += ("<img src='" + url + "' id='" + key + "' + class='brick hvr-grow' onclick='showDetails(" + JSON.stringify(key) + ")' >");
      
      img.splice(ran, 1);
    }

  });
    
}

function sortByYear() {
  $("#rand-sort").removeClass("active");
  $("#abc-sort").removeClass("active");
  $("#year-sort").addClass("active");
  $("#wall").removeClass("columns");
  img = [];
  $("#wall").empty();


  var yearOrder = firebase.database().ref('blocks').orderByChild('grad_year');

  yearOrder.once('value',function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      console.log(childSnapshot.val().grad_year);
      var info = {url:childSnapshot.val().block_img, key:childSnapshot.key, yr:childSnapshot.val().grad_year}
      img.push(info);
    });
  }).then(() => {
    var startYear = img[0].yr;
    while (img.length > 0) {
      if (img[0].yr == startYear && img.length > 0) {
        document.getElementById("wall").innerHTML += ("<h3 class='ml-2 mb-1'>" + startYear + "</h3>");
        document.getElementById("wall").innerHTML += ("<div class='line px-3 mb-2'></div>");
        document.getElementById("wall").innerHTML += ("<div id='" + startYear + "-div' class='year-div columns mb-4'>");
        while(img.length > 0 && startYear == img[0].yr) {
          var url = img[0].url;
          var key = img[0].key;
          document.getElementById(startYear + "-div").innerHTML += ("<img src='" + url + "' id='" + key + "' + class='brick hvr-grow' onclick='showDetails(" + JSON.stringify(key) + ")' >");
          img.splice(0, 1);
        }
        document.getElementById("wall").innerHTML += ("</div>");
        
        
      } else if (img[0].yr == "[year]") {
        break;
      }else{
        startYear++;
      }
    }

  });
}

function alphabetize() {
  $("#rand-sort").removeClass("active");
  $("#abc-sort").addClass("active");
  $("#year-sort").removeClass("active");
  $("#wall").removeClass("columns");
  img = [];
  $("#wall").empty();

  var nameOrder = firebase.database().ref('blocks').orderByChild('last_name');

  nameOrder.once('value',function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      console.log(childSnapshot.val().grad_year);
      var info = {url:childSnapshot.val().block_img, key:childSnapshot.key, ln:childSnapshot.val().last_name}
      img.push(info);
    });
  }).then(() => {
    var firstLetter = img[0].ln.charAt(0);
    while (img.length > 0) {
      if (img[0].ln.charAt(0) == firstLetter && img.length > 0) {
        document.getElementById("wall").innerHTML += ("<h3 class='ml-2 mb-1'>" + firstLetter + "</h3>");
        document.getElementById("wall").innerHTML += ("<div class='line px-3 mb-2'></div>");
        document.getElementById("wall").innerHTML += ("<div id='" + firstLetter + "-div' class='year-div columns mb-4'>");
        while(img.length > 0 && firstLetter == img[0].ln.charAt(0)) {
          var url = img[0].url;
          var key = img[0].key;
          document.getElementById(firstLetter + "-div").innerHTML += ("<img src='" + url + "' id='" + key + "' + class='brick hvr-grow' onclick='showDetails(" + JSON.stringify(key) + ")' >");
          img.splice(0, 1);
        }
        document.getElementById("wall").innerHTML += ("</div>");
      } else if (firstLetter == "") {
        firstLetter = 'A';
      }else{
        if (firstLetter == "Z") {
          break;
        }
        firstLetter = String.fromCharCode(firstLetter.charCodeAt(0) +1);
      }
    }
  });
}

function randomize() {
  $("#rand-sort").addClass("active");
  $("#abc-sort").removeClass("active");
  $("#year-sort").removeClass("active");
  $("#wall").addClass("columns");

  generateWall();
}