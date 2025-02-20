import axios from "axios";

export default class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }

    static #get(url, params) {
        return axios.get(url, { params }).then(response => response.data);
    }

    static #post(url, data) {
        return axios.post(url, data).then(response => response.data);
    }

    static #delete(url, data) {
        return axios.delete(url, { data }).then(response => response.data);
    }

    static #put(url, data) {
        return axios.put(url, data).then(response => response.data);
    }

    getContacts(term) {
        return PhoneBookService.#get(this.baseUrl, { term });
    }

    createContact(contact) {
        return PhoneBookService.#post(this.baseUrl, contact);
    }

    deleteContact(id) {
        return PhoneBookService.#delete(`${this.baseUrl}/${id}`);
    }

    deleteSelectedContacts(contactsId) {
        return PhoneBookService.#delete(this.baseUrl, contactsId);
    }

    editContact(contact) {
        return PhoneBookService.#put(this.baseUrl, contact);
    }
}