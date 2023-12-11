import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class Header extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'header', ["header"])
    new Component(this.root, 'img', ['header__logo'], null, ['src', 'alt'], ['./assets/logo.png', 'logo'])

    const divColumn = new Component(this.root, 'div', ['header__column'])
    const divNavigation = new Component(divColumn.root, 'div', ['header__navigation']);
    new Component(divNavigation.root, 'a', ["header__menu"], 'Главная', ['href'], ["#"]);
    new Component(divNavigation.root, 'a', ["header__menu"], 'Каталог', ['href'], ["#catalog"]);
    new Component(divNavigation.root, 'a', ["header__menu"], 'Корзина', ['href'], ["#basket"]);
    new Component(divNavigation.root, 'a', ["header__menu"], 'Войти', ['href'], ["#account"]);
    new Component(divColumn.root, 'img', ['header__image'], null, ['src', 'alt'], ['./assets/ImageHeader.png', 'image']);

  }
}