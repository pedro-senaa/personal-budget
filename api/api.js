const express = require('express');
const { envelopeChecker, addEnvelopeToDatabase, envelopesDatabase, findEnvelopeById, updateEnvelope } = require('../database');
const apiRouter = express.Router();


// apiRouter.post('', (req, res, next) => {
//     console.log('router set and running!')
// })


apiRouter.param('envelopeId', (req, res, next, id) => {
    // console.log('running through param router...')
    const envelope = findEnvelopeById(Number(id));
    // console.log(envelope, id, req.body, req.query, envelopesDatabase);
    if (envelope) {
        req.body.envelope = envelope;
        next();
    } else {
        res.status(404).send();
    }
});

apiRouter.post('', (req, res, next) => {
    // console.log('running post request...')
    const isValidEnvelope = envelopeChecker(req.body);
    if (isValidEnvelope) {
        addEnvelopeToDatabase(req.body);
        res.status(201).send(envelopesDatabase);
    } else {
        res.status(400).send();
    };
});

apiRouter.get('/', (req, res, next) => {
    res.status(200).send(envelopesDatabase);
});

apiRouter.get('/:envelopeId', (req, res, next) => {
    // console.log('running after param router...')
    res.status(200).send(req.body.envelope);
});

apiRouter.put('/:envelopeId', (req, res, next) => {
    // const updatedEnvelope = updateEnvelope(req.body)
    const { name, amount } = req.body;
    const id = Number(req.params.envelopeId);
    const updatedEnvelope = updateEnvelope({ name: name, amount: amount, id: id });
    if (updatedEnvelope) {
        // console.log('running this line')
        res.status(200).send(updatedEnvelope);
    } else {

        res.status(400).send();
    }
    // console.log(name, amount);
});




module.exports = apiRouter;