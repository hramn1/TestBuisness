import {App} from "./components/App";

const form = document.querySelector(".form-tree");
const renderTree = document.querySelector(".render-tree")
const app = new App(form as HTMLFormElement, renderTree as HTMLDivElement);
app.init();
