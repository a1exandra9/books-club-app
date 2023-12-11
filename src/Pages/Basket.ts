import { Component } from "../Abstract/Component";
import { TGoodBasket, TServices } from "../Abstract/Type";
import { CardBasket } from "../Common/CardBasket";

export class Basket extends Component {
  fullBasket: Component;
  nullBasket: Component;
  divBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["basket"])
    const user = services.authService.user;
    services.dbService.calcDataBasket(user);

    let isBasketClear = false;//переменная для проверки пустоты корзины
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }
    this.nullBasket = new Component(this.root, 'div', ['nullBasket']);//блок для пустой корзины
    new Component(this.nullBasket.root, 'p', ["page__title"], 'Каталог');
    new Component(this.nullBasket.root, 'p', ["basket__null__text"], 'Корзина пуста');
    const btnCatalog = new Component(this.nullBasket.root, 'input', ['catalog__btn'], null, ['value', 'type'], ['Каталог', 'button']);
    btnCatalog.root.onclick = () => {
      window.location.hash = '#catalog';
    }

    this.fullBasket = new Component(this.root, 'div', ['fullBasket']);//блок для полной корзины
    this.toggleBasket(isBasketClear);
    new Component(this.fullBasket.root, 'p', ["page__title"], 'Корзина')

    this.divBasket = new Component(this.fullBasket.root, 'div', ["basket__books"]);
    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => { //то для каждого элемента в корзине
        this.putBooksInBasket(this.divBasket, el); //вызвать функцию, которая добавляет карточку товара на страницу корзины
      });
    }
    const btnOplata = new Component(this.fullBasket.root, 'input', ['catalog__btn'], null, ['value', 'type'], ['Заказать', 'button']);
    btnOplata.root.onclick = () => {
      const user = services.authService.user;
      services.dbService.addBasketInHistory(user);
    }
    services.dbService.addListener('bookInBasket', (tovar) => {//при команде "bookInBasket"
      this.putBooksInBasket(this.divBasket, tovar as TGoodBasket);
      this.toggleBasket(true);
    });
    services.dbService.addListener("clearBasket", () => {//очистить корзину
      this.divBasket.root.innerHTML = '';
      this.toggleBasket(false);
    })
  }

  putBooksInBasket(teg: Component, tovar: TGoodBasket) {
    new CardBasket(teg.root, this.services, tovar);
  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.nullBasket.remove();
      this.fullBasket.render();
    } else {
      this.nullBasket.render();
      this.fullBasket.remove();
    }
  }
}