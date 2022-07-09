import _ from 'lodash';
import html from "./index.html";

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = html;

  return element;
}

document.body.appendChild(component());