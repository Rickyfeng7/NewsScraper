$(document).on("click", "#scrape", function(event) {
  event.preventDefault(event);
  $.ajax({
    method:"GET",
    url:"/scrape"
  })
  .done(function(){
    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" 
        + data[i].headline + "<br />" 
        + data[i].url + "<br />" 
        + data[i].summary + "</p>" + "<br />" 
        + "<button id='save' data-id='" + data[i]._id + "'>" + "save article" + "</button>" );
        };
    });
  })
})

$(document).on("click", "#save", function(event) {
  console.log("hello", event);
  var savedId = $(this).attr("data-id");
  console.log(savedId);
    $.ajax({
        method: "POST",
        url: "/savedArticles/" + savedId
    });
});

$(document).on("click", "#favorites", function(event) {
  console.log("hello from line 34", event);
    $.ajax({
        method: "get",
        url: "/saved"
    });
});
