const express = require('express');
const { envelopeChecker, addEnvelopeToDatabase, envelopesDatabase, findEnvelopeById, updateEnvelope, subtractEnvelopeAmount, deleteEnvelopeById, addEnvelopeAmount } = require('../database');
const { checkForSubtractParam } = require('../utils');
const apiRouter = express.Router();

apiRouter.param('envelopeId', (req, res, next, id) => {
    const envelope = findEnvelopeById(Number(id));
    if (envelope) {
        req.body.envelope = envelope;
        next();
    } else {
        res.status(404).send();
    }
});

apiRouter.param('from', (req, res, next, id) => {
    const envelopeFrom = findEnvelopeById(Number(id));
    if (envelopeFrom) {
        req.body.envelopeFrom = envelopeFrom;
        next();
    } else {
        res.status(404).send();
    };
});

apiRouter.param('to', (req, res, next, id) => {
    const envelopeTo = findEnvelopeById(Number(id));
    if (envelopeTo) {
        req.body.envelopeTo = envelopeTo;
        next();
    } else {
        res.status(404).send();
    };
});


// to create new envelope
apiRouter.post('', (req, res, next) => {
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
    res.status(200).send(req.body.envelope);
});

// to change information
apiRouter.put('/:envelopeId', (req, res, next) => {
    const { name, amount } = req.body;
    const id = Number(req.params.envelopeId);
    const updatedEnvelope = updateEnvelope({ name: name, amount: amount, id: id });
    if (updatedEnvelope) {
        res.status(200).send(updatedEnvelope);
    } else {

        res.status(400).send();
    }
});

// to subtract money from envelope (expect req.query.subtract);
apiRouter.post('/:envelopeId', checkForSubtractParam, (req, res, next) => {
    const updatedEnvelope = subtractEnvelopeAmount(req.query.subtract, findEnvelopeById(Number(req.params.envelopeId)));
    res.status(200).send(updatedEnvelope);
});

// to delete envelope from database
apiRouter.delete('/:envelopeId', (req, res, next) => {
    const id = Number(req.params.envelopeId);
    const deleted = deleteEnvelopeById(id);
    if (deleted) {
        res.status(200).send(envelopesDatabase)
    } else {
        res.status(400).send();
    }
});


// transfer amount from one envelope to another. expects only from and to and body with amount set to number
apiRouter.post('/transfer/:from/:to', (req, res, next) => {
    const { envelopeFrom, envelopeTo } = req.body;
    const amount = req.body.amount;
    if (!amount || typeof amount !== 'number' || amount < 0) {
        res.status(400).send('no amount key property');
    };
    const subtracted = subtractEnvelopeAmount(amount, envelopeFrom);
    if (!subtracted) {
        res.status(500).send('unable to update');
        return;
    };

    const added = addEnvelopeAmount(amount, envelopeTo);
    if (!added) {
        addEnvelopeAmount(amount, envelopeFrom);
        res.status(500).send('unable to update');
        return;
    }
    res.status(200).send([subtracted, added]);
});




module.exports = apiRouter;