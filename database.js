let id = 0;
let envelopesDatabase = [];

class Envelope {
    constructor(name, amount) {
        this.id = id++;
        this.name = name;
        this.amount = amount;
    }
}


function envelopeChecker(envelope) {
    if (!envelope.name || !envelope.amount || typeof envelope.name !== 'string' || typeof envelope.amount !== 'number') {
        return false;
    } else {
        return true;
    }
};

function addEnvelopeToDatabase(envelope) {
    const isValidEnvelope = envelopeChecker(envelope);
    if (isValidEnvelope) {
        envelope.id = id++;
        envelopesDatabase.push(envelope);
    } else {
        return null
    }
};

function findEnvelopeById(id) {
    const envelopeById = envelopesDatabase.find(envelopeObj => (envelopeObj.id === id));
    if (envelopeById) {
        return envelopeById;
    } else {
        return null;
    };
};

function deleteEnvelopeById(id) {
    const index = envelopesDatabase.findIndex(envelopeObj => envelopeObj.id === id);
    if (index !== -1) {
        envelopesDatabase.splice(index, 1);
        return true;
    } else {
        return false;
    };
};


// expects envelope to have .id key!!!!!!!!!
function updateEnvelope(envelope) {
    const index = envelopesDatabase.findIndex(envelopeObj => envelopeObj.id === envelope.id);
    if (index !== -1) {
        envelopesDatabase[index].name = envelope.name;
        envelopesDatabase[index].amount = envelope.amount;
        return envelopesDatabase[index];
    } else {
        return false;
    };
    ;
}

module.exports = { id, envelopesDatabase, Envelope, envelopeChecker, addEnvelopeToDatabase, findEnvelopeById, deleteEnvelopeById, updateEnvelope };