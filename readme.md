# Hyperledger Shipment Demo

*For a more detailed overview of the demo, please refer to https://github.com/m2hofi94/hyperledger_shipment-business_network*

This project is a small Ionic-App, that highlights the functionality of the Business Network, where a shipment is shipped by multiple shippers while being monitored with a IoT-Device.

# Installation
The demo is completely platform independent and can be run locally, on a webserver, or on a smartphone. 

First, you need to install the [Ionic-CLI](https://ionicframework.com/docs/cli/), which in turn requires Node 6 LTS and NPM 3+:
```
npm install -g ionic@latest
```

Then simple clone or download the repository and install the dependencies using node package manager:
```
git clone git@github.com:m2hofi94/hyperledger_shipment-demo.git
cd hyperledger_shipment-demo
npm install
```

Finally, you might want to take a look at the config file (```src/app/app.config.ts```) and change the URLs, before running your local test environment:
```
ionic serve
```
