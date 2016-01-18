# vr-lightsaber

Use orientation data from one smartphone to animate a lightsaber in another smartphone inside Google Cardboard.

It's being hosted on Heroku free tier which only stays up for 18 hours a day - try your luck.

[http://vrlightsaber.herokuapp.com/](http://vrlightsaber.herokuapp.com/)

## What is this?

This experiment was inspired by [lightsaber.withgoogle.com](lightsaber.withgoogle.com), but takes the idea a step further. You will be able to use one smartphone as a control for the lightsaber and the other one to view the immersive VR experience with Google Cardboard. It all runs on a webkit enabled browser such as Safari or Chrome. I'm using free hosting for a rather high bandwidth application so you may notice significant delays. For the best experience, follow the instructions on Github to get the app running locally on your machine.

## How do I use it?

First get two smartphones which have the latest versions of Safari or Google Chrome. Choose one to use as the Viewer and one to use as the Lightsaber. Open this website on the Viewer device, and you will see a shortlink above. Open the shortlink on the Lightsaber device, and you will see a button appear on the Viewer device. Turn the Viewer sideways, press the button, and insert it into your Google Cardboard. The phone acting as the Lightsaber will control a 3D rendered Lightsaber on the Viewer. Deflect some laser ball things.

## What technologies are used?

Both components of this experiment, the Lightsaber and the Viewer, run on the web. They use the latest HTML5 technologies as well as some modern backends. Below is a list of some of the main parts of this application.

Node.js - Serves web pages, manages the socket.io server

Socket.io - WebSocket wrapper used to transmit realtime orientation and calibration data from the Lightsaber to Node.js to the Viewer. It also creates unique player sessions which are then mapped to the shortlink.

THREE.js - WebGL abstraction used for programming the 3D graphics, animations, and collision detection. Data from Socket.io is sent to meshes in THREE.js

DeviceOrientation Event - Browser API for accessing alpha (z), beta(x), gamma(y) orientation values from device.

If you want to poke around the source code or even contribute to the project, check it out on Github.

## Who made this?

This experiment was built by Ajay Ramesh. I love Star Wars almost as much as I love the Web.

---

# Install vr-lightsaber locally

In order to run and build this project you will need [Node.js](https://nodejs.org/en/) and [Ngrok](https://ngrok.com/) installed.

1. `git clone https://github.com/Carpetfizz/vr-lightsaber.git` or download `.zip`

2. Navigate to `vr-lightsaber/` and `npm install`

3. Navigate to `vr-lightsaber/` and `node server.js`

4. `ngrok http 3000` will start a secure tunnel to your localhost. Navigate to the `Forwarding` URL

# Contributing

If you'd like to help make this more awesome please feel free to contribute! The only real dev dependency is [browserify](http://browserify.org/) or [watchify](https://github.com/substack/watchify) which I use to bundle the modules.

1. Navigate to `vr-lightsaber/public/js`

2. `browserify viewer.js -o bundle.js`

# Technical Overview

On the serverside, vr-lightsaber is a standard Node.js / socket.io app. It uses sockets to signal events such as `lightsaberjoin` or `sendorientation`. [server.js](https://github.com/Carpetfizz/vr-lightsaber/blob/master/server.js) has comments detailing what each of the events do.

Things get more exciting on the client. There are two main Javascript files, [viewer.js](https://github.com/Carpetfizz/vr-lightsaber/blob/master/public/js/viewer.js) and [lightsaber.js](https://github.com/Carpetfizz/vr-lightsaber/blob/master/public/js/lightsaber.js). 

The `lightsaber` listens for orientation changes in the phone's gyroscope. You can read about the `DeviceOrientation Event` [here](http://w3c.github.io/deviceorientation/spec-source-orientation.html). Essentially, it reports rotation about alpha (z), beta (x), and gamma (y) axes relative to the phone placed flat on its back. it was a little tricky to interpret these values when the phone is right side up but you can see the math for that done [here](https://github.com/Carpetfizz/vr-lightsaber/blob/master/public/js/viewer.js#L175-L208). The `lightsaber` is also responsible for playing the "hit" audio when the lightsaber collides with an enemy. Since Safari has become the "IE of mobile" I had to write a [workaround](https://github.com/Carpetfizz/vr-lightsaber/blob/master/public/js/lightsaber.js#L45-L72) to play the audio files. It essentially creates multiple `<audio />` tags and loads them upon user interaction - so that I can play them programatically.

The `viewer` is a typical THREE.js game with a few minor differences. I'm using `require`'s to load [assets](https://github.com/Carpetfizz/vr-lightsaber/tree/master/assets) and add them to the scene. The reasoning for this was mostly to cut down the size of `viewer.js` and to maintain readibility. This pattern works well and I will be using it in the future. The [assets](https://github.com/Carpetfizz/vr-lightsaber/tree/master/assets) are just THREE.Mesh's and their respective constructors. 
