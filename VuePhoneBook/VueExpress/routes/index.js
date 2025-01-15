var express = require('express');
var router = express.Router();

let contacts = [];
let currentContactId = 1;

router.get("/api/contacts", function (request, response) {
    const term = (request.query.term || "").toUpperCase();

    if (term.length === 0) {
        response.send(contacts);
    } else {
        response.send(contacts.filter(c => c.firstName.toUpperCase().includes(term)) || c.lastName.toUpperCase().includes(term) || c.phone.toUpperCase().includes(term));
    }

    request.send(contacts);
});

router.post("/api/contacts", function (request, response) {
    const contact = request.body;

    if (!contact.firstName) {
        response.send({
            success: false,
            message: "Необходимо указать имя"
        });
        return;
    }

    if (!contact.lastName) {
        response.send({
            success: false,
            message: "Необходимо указать фамилию"
        });
        return;
    }

    if (!contact.phone) {
        response.send({
            success: false,
            message: "Необходимо указать телефон"
        });
        return;
    }

    const phone = contact.phone.toUpperCase();

    if (contacts.any(c => c.phone.toUpperCase() === phone)) {
        response.send({
            success: false,
            message: "Такой телефон уже существует"
        });
        return;
    }

    contact.id = currentContactId;
    currentContactId++;
    contacts.push(contact);

    response.send({
        success: true,
        message: null
    });
});

module.exports = router;
