var express = require("express");
var router = express.Router();

const contacts = [];
let currentContactId = 1;

router.get("/api/contacts", function (request, response) {
    const term = (request.query.term || "").toUpperCase();

    if (term.trim().length === 0) {
        response.send(contacts);
    } else {
        response.send(contacts.filter(c => c.firstName.toUpperCase().includes(term)) || c.lastName.toUpperCase().includes(term) || c.phone.toUpperCase().includes(term));
    }
});

router.post("/api/contacts", function (request, response) {
    const contact = request.body;

    if (contact.firstName.trim().length === 0) {
        response.send({
            success: false,
            message: "firstNameInvalidError"
        });
        return;
    }

    if (contact.lastName.trim().length === 0) {
        response.send({
            success: false,
            message: "lastNameInvalidError"
        });
        return;
    }

    if (contact.phone.trim().length === 0) {
        response.send({
            success: false,
            message: "phoneInvalidError"
        });
        return;
    }

    if (isNaN(Number(contact.phone.trim()))) {
        response.send({
            success: false,
            message: "phoneIncorrectFormatError"
        });
        return;
    }

    const phone = contact.phone.toUpperCase();

    if (contacts.some(c => c.phone.toUpperCase() === phone)) {
        response.send({
            success: false,
            message: "phoneExistError"
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

router.put("/api/contacts", function (request, response) {
    const contact = request.body;

    if (contact.firstName.trim().length === 0) {
        response.send({
            success: false,
            message: "firstNameInvalidErrorà"
        });
        return;
    }

    if (contact.lastName.trim().length === 0) {
        response.send({
            success: false,
            message: "lastNameInvalidError"
        });
        return;
    }

    if (contact.phone.trim().length === 0) {
        response.send({
            success: false,
            message: "phoneInvalidError"
        });
        return;
    }

    if (isNaN(Number(contact.phone.trim()))) {
        response.send({
            success: false,
            message: "phoneIncorrectFormatError"
        });
        return;
    }

    const phone = contact.phone.trim().toUpperCase();

    if (contacts.some(c => c.id !== contact.id && c.phone.toUpperCase() === phone)) {
        response.send({
            success: false,
            message: "phoneExistError"
        });
        return;
    }

    const contactIndex = contacts.findIndex(c => c.id === contact.id);

    if (contactIndex < 0) {
        response.send({
            success: false,
            message: "contactNotFoundError"
        });
        return;
    }

    contacts[contactIndex] = contact;

    response.send({
        success: true,
        message: null
    });
});

router.delete("/api/contacts", function (request, response) {
    const contactsId = request.body;

    contactsId.forEach(id => {
        const index = contacts.findIndex(c => c.id === Number(id));
            if (index >= 0) {
                contacts.splice(index, 1);
            }
    });

    response.send({
        success: true,
        message: null
    });
});

router.delete("/api/contacts/:id", function (request, response) {
    const contactId = Number(request.params.id);
    const contactIndex = contacts.findIndex(c => c.id === contactId);

    if (contactIndex >= 0) {
        contacts.splice(contactIndex, 1);
    }

    response.send({
        success: true,
        message: null
    });
});

module.exports = router;