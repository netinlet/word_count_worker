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

Name                            | Default               | Description
---------------------- | -------------------------------| ----------------------------------------------
`WORKER_NAME`          | word_count_worker_dev          | name used in call to DingBot and for logging
`DINGBOT_URL`          | http://localhost:1234          | Location of the dingbot
`HEALTH_STATUS_PORT`   | 3000                           | port to run the health check
`CLOUDQ_URL`           | http://foo:bar@localhost:8000  | Location of the cloudq
`WORD_COUNT_DB`        | http://localhost:5984          | location of couchdb service

### Node.js worker requirements

* Monitor process - `forever`
* Verbose logging - `bunyan`
* Heartbeat - `NewRelic` _( Respond with 200 at url `/health` )_
* Reverse heartbeat - `Dingbot` _( Check in every minute )_
