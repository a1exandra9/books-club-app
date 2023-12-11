import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";

export class BookCard extends Component {
  btnBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
    super(parrent, 'div', ["bookcard"]);
    new Component(this.root, 'img', [], null, ['src', 'alt'], [data.url, data.name])

    const divDate = new Component(this.root, 'div', ["bookcard__dates"])
    new Component(divDate.root, 'span', [], data.date.toDate().toLocaleDateString('ru'));
    new Component(divDate.root, 'span', [], data.date.toDate().toLocaleTimeString('ru'));

    new Component(this.root, 'span', ["bookcard__genre"], data.genre);

    new Component(this.root, 'span', ["bookcard__name"], data.name);

    this.btnBasket = new Component(this.root, 'input', ["bookcard__btn"], null, ['type', 'value'], ['button', 'Добавить'])
    this.btnBasket.root.onclick = () => {
      this.addBookInBasket();
      (this.btnBasket.root as HTMLInputElement).value = 'Добалено';
    }
    if (services.dbService.dataUser) {
      const index = services.dbService.dataUser.basket.findIndex((el) => el.book.id === data.id);
      if (index >= 0) {
        (this.btnBasket.root as HTMLInputElement).value = 'Добалено';
      }
    }
    services.dbService.addListener('delBookFromBasket', (idBook) => {
      if (idBook === data.id) {
        (this.btnBasket.root as HTMLInputElement).value = 'Добавить';
      }
    });
  }
  addBookInBasket() {
    const user = this.services.authService.user;
    this.services.dbService.addBookInBasket(user, this.data)
      .catch(() => {
        (this.btnBasket.root as HTMLInputElement).value = 'Добавить';
      })
  }
}