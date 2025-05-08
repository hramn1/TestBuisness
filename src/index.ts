import {App} from "./components/App";

const form = document.querySelector(".form-tree");
const inputText = form?.querySelector(".form-tree__input");
const buttonRender = form?.querySelector(".form-tree__btn");
const renderTree = document.querySelector(".render-tree")
const app = new App(form as HTMLFormElement, renderTree as HTMLDivElement);
app.init();
