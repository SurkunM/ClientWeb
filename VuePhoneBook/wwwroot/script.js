class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }
    // 1:56 (express.js)


    getContacts(term) {

    }
}

const app = Vue.createApp({
    data() {
        return {
            contacts: [],
            firstName: "",
            lastName: "",
            phone: ""
        };
    },

    methods: {
        createContact() {
            
        }
    }
});

app.mount("#app");