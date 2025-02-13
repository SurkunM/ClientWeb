import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "../css/style.scss";

import { createApp } from "vue";
import PhoneBookVue from "../components/PhoneBook.vue";

createApp(PhoneBookVue).mount("#app");