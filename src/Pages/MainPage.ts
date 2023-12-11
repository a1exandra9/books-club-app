import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class MainPage extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["mainpage"]);

    const divColumn = new Component(this.root, 'div', ['mainpage__column']);
    new Component(divColumn.root, 'p', ['mainpage__text'], 'Добро пожаловать!');
    new Component(divColumn.root, 'p', ['mainpage__text'], 'we/read это книжный клуб для всех желающих обсудить любимые произведения.');
    new Component(divColumn.root, 'img', ['mainpage__image'], null, ['src', 'alt'], ['./assets/ImageMainPage.png', 'img']);

    const divAbout = new Component(this.root, 'div', ['mainpage__about']);
    const divAboutUs = new Component(divAbout.root, 'div', ['mainpage__aboutus']);
    new Component(divAboutUs.root, 'span', ["mainpage__title"], "О нас");
    new Component(divAboutUs.root, 'img', ['mainpage__image-text'], null, ['src', 'alt'], ['./assets/Text1.png', 'text']);

    const divAboutWie = new Component(divAbout.root, 'div', ['mainpage__aboutwie']);
    new Component(divAboutWie.root, 'span', ["mainpage__title"], "Как сделать заказ");
    new Component(divAboutWie.root, 'img', ['mainpage__image-text'], null, ['src', 'alt'], ['./assets/Text2.png', 'text']);

    const btn = new Component(divAbout.root, 'input', ['mainpage__btn'], null, ['type', 'value'], ['button', 'Каталог'])
    btn.root.onclick = () => {
      window.location.hash = '#catalog';
    }
  }
}