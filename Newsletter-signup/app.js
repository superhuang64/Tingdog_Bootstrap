const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const client = require("@mailchimp/mailchimp_marketing");//get api root

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//setting up Mailchimp
client.setConfig({
    apiKey: "c1a95291de4c983f538bb055c4b3433b-us21",
    server: "us21"
});

const run = async () => {
    const response = await client.root.getRoot();
    //console.log(response);
};

run();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/sign-up.html");
});
//post information
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const emailAddress = req.body.emailAddress;
    const listId = "089b94177f";

    //add member to list/ upload the data to the server
    const run = async () => {
        const response = await client.lists.addListMember(listId, {
            email_address: emailAddress,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: secondName
            }
        });
        console.log(response);

        //set the success and failure page

        //if goes well then success page
        res.sendFile(__dirname + "/success.html");
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
        );

        //If there's any error, then failure page
        run().catch(function (error) {
            res.sendFile(__dirname + "/failure.html");
            console.log(`Sign up failed.`);
        });
    };
    run();
    //add member to list/ upload the data to the server
    // const run = async () => {
    //     const response = await client.lists.addListMember(
    //         Audience_ID,
    //         {
    //             email_address: emailAddress,
    //             status: "pending",
    //             merge_fields: {
    //                 FNAME: firstName,
    //                 LNAME: secondName
    //             }
    //         });
    // };

    // run();

    // res.sendFile(__dirname + "/success.html");
    // console.log(
    //     `Successfully added contact as an audience member. The contact's id is ${response.id
    //     }.`
    // );

    // run().catch(err => {
    //     res.sendFile(__dirname + "/failure.html");
    //     console.log(`Sign up failed.`);
    //     console.log(response.statusCode);
    // });
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("server is running on port 3000");
});


//apikey: c1a95291de4c983f538bb055c4b3433b-us21

//apiurl(endpoint): https://us21.api.mailchimp.com/3.0/

//listid: 089b94177f

