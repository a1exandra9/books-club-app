import { Component } from "../Abstract/Component";
import { TGood, TGoodBasket, TServices } from "../Abstract/Type";

export class CardBasket extends Component {
  btnDel: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGoodBasket) {
    super(parrent, 'div', ["bookcard"]);
    new Component(this.root, 'img', [], null, ['src', 'alt'], [data.book.url, data.book.name])

    const divDate = new Component(this.root, 'div', ["bookcard__dates"])
    new Component(divDate.root, 'span', [], data.book.date.toDate().toLocaleDateString('ru'));
    new Component(divDate.root, 'span', [], data.book.date.toDate().toLocaleTimeString('ru'));

    new Component(this.root, 'span', ["bookcard__genre"], data.book.genre);

    new Component(this.root, 'span', ["bookcard__name"], data.book.name);

    new Component(this.root, 'span', ["bookcard__genre"], `${data.book.price} руб.`);
    this.btnDel = new Component(this.root, 'input', ["basket__delete"], null, ["type", 'value'], ['button', '+'])
    this.btnDel.root.onclick = () => {
      this.delBookFromBasket();
    }
  }
  delBookFromBasket() {
    const user = this.services.authService.user;
    this.services.dbService.
      delBookFromBasket(user, this.data)
      .then(() => {
        this.remove();
      })
      .catch(() => { });
  }
}