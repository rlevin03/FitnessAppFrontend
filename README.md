Welcome to the front end of my Fitness App. Please feel free to copy the repo and take a look at it.
A few issues to keep in mind:
1. You will need to make your own MongoDB account if you don't have one and feed the connection string into a .env file in the backend(Separate repo under a similar name)
2. The email verification doesn't work currently because I don't want to pay for AWS's Simple emailing service(SES). To get around this, access the table that should be created in Mongo and set verified to true
3. You will also need to set the default URL in the App.js file to be your **computer** IP address
4. Some other issues specific to the backend will be listed in the readme there


Other than that, just CD into the main folder and run npm install to download all the dependencies
You will also need to download the Expo app on your phone to access the app
Then run npm start to startup the front end and scan the QR code with the Expo app which will launch it on your device
