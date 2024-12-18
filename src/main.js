import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
	BiSunFill,
	BiMoonFill,
	BiGithub,
	BiBook,
	BiSearch,
	BiTrash,
	BiPlus,
	BiInfoCircle,
	BiPlusCircle,
	BiXLg,
	BiXCircle,
	BiExclamationCircle,
	OiGitCommit,
} from "oh-vue-icons/icons";

addIcons(
	BiSunFill,
	BiMoonFill,
	BiGithub,
	BiBook,
	BiSearch,
	BiTrash,
	BiPlus,
	BiInfoCircle,
	BiPlusCircle,
	BiXLg,
	BiXCircle,
	BiExclamationCircle,
	OiGitCommit
);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
