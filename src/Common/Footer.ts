import { Component } from "../Abstract/Component";

export class Footer extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, 'footer', ["footer"]);

    const divContact = new Component(this.root, 'div', ['footer__contact']);
    new Component(divContact.root, 'span', ["footer__text"], "+375 33 333 33 33");
    new Component(divContact.root, 'span', ["footer__text"], `we/read@gmail.com`);
    new Component(divContact.root, 'img', ['footer__contact-img'], null, ['src', 'alt'], ['./assets/footerContact.png', 'image'])

    const divMenu = new Component(this.root, 'div', ["footer__menus"]);
    new Component(divMenu.root, 'a', ["footer__menu"], 'Главная', ['href'], ["#"]);
    new Component(divMenu.root, 'a', ["footer__menu"], 'Каталог', ['href'], ["#catalog"]);
    new Component(divMenu.root, 'a', ["footer__menu"], 'Корзина', ['href'], ["#basket"]);
    new Component(divMenu.root, 'a', ["footer__menu"], 'Личный кабинет', ['href'], ["#account"]);

    new Component(this.root, 'img', ['footer__author'], null, ['src', 'alt'], ['./assets/footerAuthor.png', 'image'])


  }
}