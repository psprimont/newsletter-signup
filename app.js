//require installed node packages
const express = require("express");
const https = require ("https");
require("dotenv").config();

//create new express app
const app = express();

//enable express to parse URL-encoded body i.e. info from HTML form
app.use(express.urlencoded({extended: true})); 

//enable express to access static files in folder called "public"
app.use(express.static("public"))

//GET request
app.get ("/", function (req, res){
    res.sendFile(__dirname + "/signup.html");
});

//POST request
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName, lastName, email);
    console.log(res.status);

    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/4a1d66636a";
    const options = {
        method: "POST", 
        auth: "preston:" + process.env.MC_API_TOKEN
    };

    console.log (options.auth);

    const request = https.request(url, options, function(response){

        var status = response.statusCode;
            if (status === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            };

        response.on("data", function(data) {
            console.log(JSON.parse(data));
            
        });
    });

    request.write(jsonData);
    request.end();

});

//failure page redirect to try again
app.post ("/failure", function (req, res){
    res.redirect("/");
});

//success page redirect to homepage
app.post ("/success", function (req, res){
    res.redirect("/");
});

//use express app to listen on 3000 and log when it's working
app.listen(3000,function() {
    console.log("Server is running on port 3000.")
});
