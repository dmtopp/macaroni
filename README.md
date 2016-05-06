# Macaroni

_Macaroni_ is a web application that lets users play music on their own or with their friends!  _Macaroni_ uses socket.io and the web audio API to send musical 'messages' from computer to computer.

![App Screenshot](https://raw.githubusercontent.com/dmtopp/macaroni/master/public/images/app_screenshot.png)

#### Initial concept

Please see the [outline]('https://github.com/dmtopp/macaroni/blob/master/public/docs/OUTLINE.md) for the initial concept and wireframes.

_Screenshot of my initial prototype in vanilla js :)_

![Prototype Screenshot](https://raw.githubusercontent.com/dmtopp/macaroni/master/public/images/prototype_screenshot.png)

#### Technologies used

As stated before, _Macaroni_ uses socket.io and the Web Audio API to allow users to play music together. The _Macaroni_ is built with Node.js and Express, and the front end uses the React framework.  Additionally, _Macaroni_ stores its user data in a MongoDB database.

#### General Approach

**Sockets and Audio**

The general concept of _Macaroni_ was to bind all user interactions with the musical instruments to a socket.io message.  When a user plays a note or triggers a sound, the socket sends a message to the server that tells all machines connected to the 'room' to generate the sound at the same time.  Using the same method, users can also send chat messages to everyone in the 'room' and change which 'room' they belong to.

**React Structure**

In order to prevent sockets from disconnecting ever time react components are re-rendered, all of the socket transmissions and audio generation happens in the parent component for the application.  Each child component that needs to send messages or generate audio calls a function in the container component in order to do so.  Each instrument as well as the chat and login/register functionality are broken down into their own component, often made up of other components.  


#### Installation instructions

This application is live on the web!  To run it locally, first make sure that you have a current version of node.js and the node package manager on your machine, as well as MongoDB.  `git clone` this repository and `npm install` to install any required dependencies.  Then `sudo mongod` to start the database and `npm start` to start the server.  Then navigate to `http://localhost:5000` and tha app should be running!

#### Unsolved Problems

I was able to solve most of the problems that arose when building this app, however, there are still some issues that need to be addressed:

+ Glitchy Audio - after several minutes of playing the audio becomes glitchy and distorted if the page is not refreshed.  This is most likely an issue with the way I have my Web Audio API pieces structured and is something that will require more research in order to fix.

+ UI issues - Instructions and labels need to be added to make the interface easier to use.

+ Responsive design - due to the complexity of the components I was not able to achieve a design that was flexible to different screen sizes or device types within my timeframe.  Future iterations should be more friendly different screen sizes.

+ General Cleanup and DRY-ing of code - this is something that I consider ~80-90% done, but some things still need to be condensed and/or re-written more clearly.

#### Future Goals

There were lots of features that I was unable to add to this project in the time I had to complete it!  In future versions, I would like to experiment with:

+ Web MIDI API - Letting users connect their hardware to this application would greatly increase the app's usability.  It's a lot more fun to play keyboard on a real (musical) keyboard.

+ Users upload their own samples - I would eventually like to implement a way for users to upload their own samples and have them stored in the database with their account data.

+ Exporting drum loops - wouldn't it be cool if users could download a sample of the drum loop they made with macaroni?

+ Looping keyboard - right now it's only possible to make loops with the drum machine component.  I'd like to add the ability to loop the other instruments as well so users can create a whole song in their browser.
