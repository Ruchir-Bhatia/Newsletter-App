const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const client = require('@mailchimp/mailchimp_marketing')

const app = express();

client.setConfig({apiKey: "25c409c394cf2c7c3a0c34fdfd451a5a-us21",  server: "us21",});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName, 
        lastName: lastName, 
        email: email
    }

    const run = async () => {
        try {
            const response = await client.lists.addListMember("33b694fb11", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname + "/success.html");
        } 
        catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html");
        }
    };
    
    run();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
});