# WordCount Worker

The purpose of this project is the following:

* Sample App to integrate with node-cloudq
* Parses a url and does a word count
* Posts the word count & url to a couch database

To install

```
npm install
```

To run

```
npm start
```

To test

```
npm test
```

### To run on ...



### Environment variables

Name                   | Default                                              | Description
---------------------- |----------------------------------------------------- |-------------
`WORKER_NAME`          | wordCountWorker                                      | name used in call to DingBot and for logging


### Node.js worker requirements

* Monitor process - `forever`
* Verbose logging - `bunyan`
* Heartbeat - `NewRelic` _( Respond with 200 at url `/health` )_
* Reverse heartbeat - `Dingbot` _( Check in every minute )_
