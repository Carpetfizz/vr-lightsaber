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
