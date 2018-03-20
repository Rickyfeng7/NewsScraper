// Grab the articles as a json
$.getJSON("/articles", function(data) {
  	// For each one
  	for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "<br />" + data[i].summary + "</p>" + "<br />" + "<button>" + "Save" + "</button>" );
  	}
});



$(document).on("click", function() {
  	// Empty the notes from the note section
  	$("#note").empty();
  	// Save the id from the p tag
  	var thisId = $(this).attr("data-id");

  	// Now make an ajax call for the Article
  	$.ajax({
    	method: "GET",
    	url: "/articles/" + thisId
  	})
    // With that done, add the note information to the page
    .done(function(data) {
      	console.log(data);
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
    	// Value taken from title input
    	title: $("#titleinput").val(),
    	// Value taken from note textarea
    	body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#note").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});