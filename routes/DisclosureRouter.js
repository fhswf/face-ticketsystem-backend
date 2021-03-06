let express = require('express');
let router = express.Router();
const VisitorDisclosure = require('../persistence/ticketsystem/disclosures/VisitorDisclosure');
const ContractorDisclosure = require('../persistence/ticketsystem/disclosures/ContractorDisclosure');

/**
 * Create a new visitor disclosure.
 */
router.post('/createVisitorDisclosure', (req, res, next) => {
    if (req.body) {
        let disclosureObj = req.body;
        let disclosure = new VisitorDisclosure(disclosureObj);
        disclosure.save(disclosureObj)
            .then(result => {
                res.status(200).send({
                    visitorDisclosure: result
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({ message: err.toString() })
            });
    }
    else {
        res.status(400).send({ message: 'Missing body.' })
    }
});

/**
 * Get all visitor disclosures of a user.
 */
router.post('/visitorDisclosures', (req, res, next) => {
    if (req.body && req.body.hasOwnProperty('userId')) {
        let userId = req.body.userId;
        VisitorDisclosure.find({ visitor: userId })
            .then(disclosures => {
                res.status(200).send({
                    visitorDisclosures: disclosures
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({ message: err.toString() })
            });
    }
    else {
        res.status(400).send({ message: 'Missing body.' })
    }
});

/**
 * Create a new visitor disclosure.
 */
router.post('/createContractorDisclosure', (req, res, next) => {
    if (req.body) {
        let disclosureObj = req.body;
        let disclosure = new ContractorDisclosure(disclosureObj);
        disclosure.save(disclosureObj)
            .then(result => {
                res.status(200).send({
                    contractorDisclosure: result
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({ message: err.toString() })
            });
    }
    else {
        res.status(400).send({ message: 'Missing body.' })
    }
});

/**
 * Get all visitor disclosures of a user.
 */
router.post('/contractorDisclosures', (req, res, next) => {
    if (req.body && req.body.hasOwnProperty('userId')) {
        let userId = req.body.userId;
        ContractorDisclosure.find({ contractor: userId })
            .then(disclosures => {
                res.status(200).send({
                    contractorDisclosures: disclosures
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({ message: err.toString() })
            });
    }
    else {
        res.status(400).send({ message: 'Missing body.' })
    }
});

module.exports = router;
