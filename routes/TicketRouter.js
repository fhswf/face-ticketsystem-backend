let express = require('express');
let router = express.Router();
const Ticket = require('../persistence/ticketsystem/Ticket');

router.post('/createTicket', (req, res, next) => {
    if(req.body) {
        let ticketObj = req.body;
        let ticket = new Ticket(ticketObj);
        ticket.save(ticketObj)
            .then(result => {
                res.status(200).send({
                    ticket: result
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({message: err.toString()})
            });
    }
    else {
        res.status(400).send({message: 'Missing body.'})
    }
});

router.get('/tickets', (req, res, next) => {
    Ticket.find({})
        .then(result => {
            res.status(200).send({
                tickets: result
            })
        })
        .catch(err => {
            console.error(err);
            res.status(400).send({message: err.toString()})
        });
});

module.exports = router;
