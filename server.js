import {createRequire} from 'module';

const require = createRequire(import.meta.url)
const express = require('express')
const app = express()

const args = require('minimist')(process.argv.slice(2));
const port = args.port || process.env.PORT || 5000

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

app.get('/app', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type' : 'text/plain' });
    res.status(res.statusCode).end(res.statusCode + ' ' + res.statusMessage)
})

app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.type('json')
    res.status(200).json({"flip": flip})
})

app.get('/app/flips/:number', (req, res) => {
    var flips = coinFlips(req.params.number)
    var count = countFlips(flips)
    res.type('json')
    res.json({"raw": flips, "summary": count})
})

app.get('/app/flip/call/heads', (req, res) => {
    res.type('json')
    res.json(flipACoin("heads"))
})

app.get('/app/flip/call/tails', (req, res) => {
    res.type('json')
    res.json(flipACoin("tails"))
})

// Default response for any other request
app.use(function(req, res) {
    res.type('text/plain')
    res.status(404).send('404 NOT FOUND')
})

// Coin Flip Functions
function coinFlip() {
    if (Math.random() < 0.5) {
        return 'heads';
    }
    return 'tails';
}

function coinFlips(flips) {
    let flipSet = new Array(flips);
    let x = 0;
    while (x < flips) {
        flipSet[x] = coinFlip();
        x = x + 1;
    }
    return flipSet;
}

function countFlips(array) {
    let headCount = 0;
    let tailsCount = 0;
    for (let x = 0; x < array.length; x++) {
        if (array[x] == 'heads') {
            headCount++;
        }
        else {tailsCount++;}
    }
    if (headCount == 0) {return {tails: tailsCount}}
    if (tailsCount == 0) {return {heads: headCount}}
    else {
        return {heads: headCount, tails: tailsCount};
    }
    
}

function flipACoin(call) {
    const flipResult = coinFlip();
    if (flipResult == call) {
        return {call: call, flip: flipResult, result: 'win'};
    }
    else {
        return {call: call, flip: flipResult, result: 'lose'}
    }
}