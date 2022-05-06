# LoRaWAN Demo Application using The Things Stack

## How to run

### Prerequisites

Both [Node.JS](https://nodejs.org/) and [NPM](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/)) need to be installed on your machine. You can find installation instructions on their respective websites.

### Install dependencies

Run `yarn install` to install the dependencies.

### Configuration

You can use the following environment variables to set the demo application up to integrate with The Things Stack. You will need do provide:

- `TTN_APP_ID`: The ID of the app that is sending the uplinks you want to track
- `TTN_API_KEY`: The API Key that allows writing downlink traffic
- `TTN_WEBHOOK_ID`: The ID of the webhook used to schedule downlinks
- `TTN_DEVICE_ID`: The ID of the end device that you want the downlinks to be sent to
- `PORT`: The port that the http server will run on (default 3000)

### Run

Start the server via `node index.js`. It will then expose the http server on port 3000 (unless configured otherwise).

## Understanding the application

The simple Node.JS application does a couple of things:

1. Expose a website that shows the latest temperature and humidity values as well as live data in a chart
2. Expose a websockets service to communicate with the client to update the newest data as it is coming in
3. Listen for requests on the `/webhooks` endpoint and storing the results in memory
4. Using a TTS configured webhook to schedule downlinks to an end device, when an uplink has been received

The application is assuming that you are using an end device that is set up to send (decoded) uplinks including a `temperature` and `humidity` prop. It also assumes that you use a Kuando Busylight end device, so that it toggles it on and off via the downlinks sent by the application. It is however easy to modify the application to do different things if your setup differs.

I've tried to keep the application as simple as possible so it does not use any transpilation or frontend framework and can be started right away. You can find the backend code in `index.js`, the client code in `public/main.js`.

You can watch me walking through the setup of this application [here](https://youtu.be/EckkLpaP7Q8?t=9816). I also explain how to set up your application in The Things Stack to run this application.
