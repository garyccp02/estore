'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const admin = require('./enrollAdmin.js');
const user = require('./registerUser.js');
const query = require('./query.js');

async function init() {
    app.use(cors());
    app.use(express.json());

    await connect();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/unsold', (req, res) => unsoldRoute(req, res));

    app.get('/view', (req, res) => viewProductRoute(req, res));

    app.post('/release', (req, res) => releaseProductRoute(req, res));

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

async function connect() {
    await admin.enroll();
    await user.register();
}

async function unsoldRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.viewUnsold();
	res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on unsoldRoute: ${error}`);
    }
}

async function viewProductRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.viewProduct(req.query.vendor, req.query.name);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on viewProductRoute: ${error}`);
    }
}

async function releaseProductRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.releaseProduct(req.body.vendor, req.body.name, req.body.price);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on releaseProductRoute: ${error}`);
    }
}

init();
