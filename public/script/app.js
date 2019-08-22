console.log("Loaded")

$(window).on("load", function() {
    renderArticles();
})

//RENDER SCRAPED ARTICLES IN CARDS TO INDEX PAGE
function renderArticles() {
$.getJSON("/articles", function(data) {
    for( var i = 0 ; i < data.length ; i++ ) {
        if(data[i].saved === false) {
            $("#articles").append('<div class="row"><div class="card mb-3 artCard" style="max-width: 100%; min-width: 100%;"><div class="row no-gutters"><div class="col-md-4 picCol"><img src="' + data[i].image + '" class="card-img artImg" alt="..."></div><div class="col-md-8"><div class="card-body"><h5 class="card-title artTitle">' + data[i].title + '</h5><a class="artLink" href="' + data[i].link + '">Link to Metal Injection Article</a><br><br><a href="#" class="btn btn-success savButton" data-id="' + data[i]._id + '">Save Article</a></div></div></div></div>');
        }
    }
})
}

//RENDER SAVED ARTICLES IN CARDS TO SAVED PAGE
$.getJSON("/articles", function(data) {
    for( var j = 0 ; j < data.length ; j++ ) {
        if(data[j].saved === true) {
            $("#savedArticles").append('<div class="row"><div class="card mb-3 artCard" style="max-width: 100%; min-width: 100%;"><div class="row no-gutters"><div class="col-md-4 picCol"><img src="' + data[j].image + '" class="card-img artImg" alt="..."></div><div class="col-md-8"><div class="card-body"><h5 class="card-title artTitle">' + data[j].title + '</h5><a class="artLink" href="' + data[j].link + '">Link to Metal Injection Article</a><br><br><button class="btn btn-danger unSaveButton" data-id="' + data[j]._id + '">Unsave</button><button data-toggle="modal" data-target="#noteModal" class="btn btn-primary notesButton" data-id="' + data[j]._id + '">See/Add Notes</button></div></div></div></div>');
        }
    }
})

var savedArticleID;

//GET REQUEST TO SCRAPE ARTICLES AND THEN RELOAD INDEX PAGE
$(document).on("click", "#scrButton", function(event) {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url:"/scrape",
        success: function(data) {
            console.log("success");
            location.reload();
        }
    })
})

//POST REQUEST TO DELETE ALL SAVED ARTICLES AND RELOAD INDEX PAGE
$(document).on("click", "#purButton", function(event) {
    event.preventDefault();
    $.ajax({
        method: "POST",
        url:"/purge",
        success: function(data) {
            console.log("success");
            location.reload();
        }
    })
})

//POST REQUEST TO SAVE ARTICLE UPON CLICKING SAVBUTTON
$(document).on("click", ".savButton", function() {
    savedArticleID = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: "/articles/save/" + savedArticleID
    }).then(function(data) {
        console.log(data);
        location.reload();
    })
})

//POST REQUEST TO UNSAVE SAVED ARTICLES
$(document).on("click", ".unSaveButton", function() {
    savedArticleID = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: "/articles/unsave/" + savedArticleID
    }).then(function(data) {
        console.log(data);
    })
})

//GET REQUEST TO DISPLAY ALL EXISTING NOTES FOR SPECIFIED ARTICLE IN MODAL
$(document).on("click", ".notesButton", function() {
    savedArticleID = $(this).attr('data-id');
    $(".modal-title").text("Notes for article: " + savedArticleID);
    $.ajax({
        method: "GET",
        url: "/articles/" + savedArticleID
    }).then(function(data) {
        if(data) {
            $("#notesMessage").empty();
            $("#currNotes").html("");
            $("#currNotes").append("<li class='savedNotes'>" + data.body + "<button class='delNote' id="+ savedArticleID + ">X</button></li>");
        }
    })
})

//POST REQUEST TO DELETE A SINGLE NOTE FROM AN ARTICLE
$(document).on("click", ".delNote", function() {
    savedNoteID = $(this).attr('id');
    console.log(savedNoteID);
    $.ajax({
        method: "POST",
        url: "/articles/delnote/" + savedNoteID,
        success: function() {            
            console.log("note deleted")
            location.reload();
        }        
    })
})

//POST REQUEST TO SAVE NEW NOTE AND ASSOCIATE WITH ARTICLE
$(document).on("click", ".savNote", function() {
    $.ajax({
        method: "POST",
        url: "/articles/savenote/" + savedArticleID,
        data: {
            body: $("#newNoteText").val()
        }
    }).then(function(data) {
        console.log(data);
    })
})

