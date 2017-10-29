// Node module imports needed to run the functions

var fs = require("fs"); //file sys 
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var Spotify = require('node-spotify-api');
var liriArgument = process.argv[2];


// commands for this liri app
switch (liriArgument) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
        // Instructions displayed in terminal to the user
    default:
        console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
            "1. my-tweets 'any twitter name' " + "\r\n" +
            "2. spotify-this-song 'any song name' " + "\r\n" +
            "3. movie-this 'any movie name' " + "\r\n" +
            "4. do-what-it-says." + "\r\n" +
            "Be sure to put the movie or song name in quotation marks if it's more than one word.");
};

// Tweet function, uses the Twitter module to call the Twitter api
function myTweets() {
    var client = new twitter({
        consumer_key: 'aGFytlRgwdyC56hp7uuAL2zT3',
        consumer_secret: 'DZq87UGYCSReY3UKcNhcqcl5mYCp8IwWqKZ9eKqkKDPpzZjLkz',
        access_token_key: '924323213336858624-id5oKlNbKC4Je74vjg9hvvkSKVNS0GU',
        access_token_secret: 'BQp1s506mLrT9vZAOow4ngbey9XvxIhu4jNFaH9U1Cn7c',
    });
    var twitterUsername = process.argv[3];
    if (!twitterUsername) {
        twitterUsername = "BarackObama";
    }
    params = { screen_name: twitterUsername };
    client.get("statuses/user_timeline/", params, function(error, data, response) {
        if (!error) {
            for (var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + "\r\n" +
                    data[i].created_at + "\r\n" +
                    "----------------------- " + i + " -----------------" + "\r\n";
                console.log(twitterResults);
                log(twitterResults); // calling log function
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
}

// Spotify function, uses the Spotify module to call the Spotify api
function spotifyThisSong(songName) {
    var spotify = new Spotify({
        id: '128d40c272774296bf479af406f23b35',
        secret: '9714013db8f04d4b8f8b0efdddd87c79'
    });

    var songName = process.argv[3];
    if (!songName) {
        songName = "What's my age again";
    }
    params = songName;

    spotify

        .search({ type: 'track', query: params })
        .then(function(data) {
            for (var i = 0; i < 10; i++) {

                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Track: " + data.tracks.items[i].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Preview Song: " + data.tracks.items[i].preview_url);
                console.log("------------------------------------");
            }
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err);
        });
};


// Movie function, uses the Request module to call the OMDB api
function movieThis() {
    var movie = process.argv[3];
    if (!movie) {
        movie = "mr nobody";
    }
    params = movie
    request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true&apikey=40e9cece", function(error, response, body) {


        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);


            console.log("Title: " + movieObject.Title);
            console.log("Year: " + movieObject.Year);
            console.log("Imdb Rating: " + movieObject.imdbRating);
            console.log("Country: " + movieObject.Country);
            console.log("Language: " + movieObject.Language);
            console.log("Plot: " + movieObject.Plot);
            console.log("Actors: " + movieObject.Actors);
            console.log("Rotten Tomatoes Rating: " + movieObject.tomatoRating);
            console.log("Rotten Tomatoes URL: " + movieObject.tomatoURL);
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};



// Do What It Says function
//reads and writes module to access the random.txt file and do what's written in it

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};


// Do What It Says function
//reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
        if (error) {
            throw error;
        }
    });
}