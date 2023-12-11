import { Component } from "../Abstract/Component";
import { TDataHistory, TGood, TGoodBasket, TServices } from "../Abstract/Type";

export class CardHistory extends Component {
  constructor(parrent: HTMLElement, private services: TServices, private data: TDataHistory) {
    super(parrent, 'div', ["cardhistory"]);
    data.basket.forEach(book => {
      const divHistory = new Component(this.root, 'div', ["bookcard"])
      new Component(divHistory.root, 'img', [], null, ['src', 'alt'], [book.book.url, book.book.name])

      const divDate = new Component(divHistory.root, 'div', ["bookcard__dates"])
      new Component(divDate.root, 'span', [], book.book.date.toDate().toLocaleDateString('ru'));
      new Component(divDate.root, 'span', [], book.book.date.toDate().toLocaleTimeString('ru'));

      new Component(divHistory.root, 'span', ["bookcard__genre"], book.book.genre);

      new Component(divHistory.root, 'span', ["bookcard__name"], book.book.name);

      new Component(divHistory.root, 'span', ["bookcard__genre"], `${book.book.price} руб.`);
    });
  }
}