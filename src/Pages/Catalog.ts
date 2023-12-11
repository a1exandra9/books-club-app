import { compareAsc } from "date-fns";
import { th } from "date-fns/locale";
import { Component } from "../Abstract/Component";
import { TCriteria, TGood, TServices } from "../Abstract/Type";
import { BookCard } from "../Common/BookCard";

export class Catalog extends Component {
  criteria: TCriteria = {
    genre: "all",
    limit: 25
  }
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["catalog"]);

    new Component(this.root, 'p', ["page__title"], 'Каталог')

    new Component(this.root, 'p', ["catalog__title"], "Выбрать жанр")
    const divGenreRow = new Component(this.root, 'div', ["catalog__genre-row"])
    const divFantasy = new Component(divGenreRow.root, 'div', ["catalog__genre-column"]);
    new Component(divFantasy.root, 'img', ['catalog-img'], null, ['src', 'alt'], ['./assets/fantasy.png', 'gfd']);
    const btnF = new Component(divFantasy.root, 'input', ["catalog__input"], null, ['value', 'type', 'data-genre'], ['Фэнтези', 'button', 'фэнтези']);
    const divNovel = new Component(divGenreRow.root, 'div', ["catalog__genre-column"]);
    new Component(divNovel.root, 'img', ['catalog-img'], null, ['src', 'alt'], ['./assets/novel.png', 'sdfg']);
    const btnN = new Component(divNovel.root, 'input', ["catalog__input"], null, ['value', 'type', 'data-genre'], ['Романы', 'button', 'романы']);
    const divDetective = new Component(divGenreRow.root, 'div', ["catalog__genre-column"]);
    new Component(divDetective.root, 'img', ['catalog-img'], null, ['src', 'alt'], ['./assets/detective.png', 'dfg']);
    const btnD = new Component(divDetective.root, 'input', ["catalog__input"], null, ['value', 'type', 'data-genre'], ['Детективы', 'button', 'детективы']);
    divGenreRow.root.onclick = (event) => {
      const param = (event.target as HTMLInputElement).dataset;
      if (!param.genre) return;
      if (param.genre) {
        this.criteria.genre = param.genre;
        if ((btnF.root as HTMLElement).dataset.genre === this.criteria.genre) {
          (btnF.root as HTMLElement).classList.add("catalog__input-active")
        } else {
          (btnF.root as HTMLElement).classList.remove("catalog__input-active")
        }
        if ((btnD.root as HTMLElement).dataset.genre === this.criteria.genre) {
          (btnD.root as HTMLElement).classList.add("catalog__input-active")
        } else {
          (btnD.root as HTMLElement).classList.remove("catalog__input-active")
        }
        if ((btnN.root as HTMLElement).dataset.genre === this.criteria.genre) {
          (btnN.root as HTMLElement).classList.add("catalog__input-active")
        } else {
          (btnN.root as HTMLElement).classList.remove("catalog__input-active")
        }
      }

      services.dbService.getAllGood(this.criteria).then((goods) => {
        divCards.root.innerHTML = '';
        this.putBookOnPage(divCards, goods);
      });
    }
    new Component(this.root, 'p', ["catalog__title"], "Количество посещений");
    const divButtons = new Component(this.root, 'div', ["catalog__buttons"]);
    new Component(divButtons.root, 'input', ["catalog-btn"], null, ['value', 'type', 'data-limit'], ['1', 'button', '1'])
    new Component(divButtons.root, 'input', ["catalog-btn"], null, ['value', 'type', 'data-limit'], ['2', 'button', '2'])
    new Component(divButtons.root, 'input', ["catalog-btn"], null, ['value', 'type', 'data-limit'], ['3', 'button', '3'])
    new Component(divButtons.root, 'input', ["catalog-btn"], null, ['value', 'type', 'data-limit'], ['4', 'button', '4'])
    new Component(divButtons.root, 'input', ["catalog-btn"], null, ['value', 'type', 'data-limit'], ['5', 'button', '5'])
    divButtons.root.onclick = (event) => {
      const param = (event.target as HTMLInputElement).dataset;
      if (!param.limit) return;
      if (param.limit) {
        this.criteria.limit = Number(param.limit);
        Array.from(divButtons.root.children).forEach((el) => {
          if (Number((el as HTMLElement).dataset.limit) === this.criteria.limit) {
            (el as HTMLElement).classList.add("catalog-btn-active")
          } else {
            (el as HTMLElement).classList.remove("catalog-btn-active")
          }
        })
      }

      services.dbService.getAllGood(this.criteria).then((goods) => {
        divCards.root.innerHTML = '';
        this.putBookOnPage(divCards, goods);
      });
    }
    new Component(this.root, 'p', ["catalog__title"], "Событие")

    const divCards = new Component(this.root, 'div', [])
    services.dbService.getAllGood(this.criteria).then((book) => {
      divCards.root.innerHTML = '';
      this.putBookOnPage(divCards, book);
    });

    const btnInBasket = new Component(this.root, 'input', ['catalog__btn'], null, ['value', 'type'], ['В корзину', 'button']);
    btnInBasket.root.onclick = () => {
      window.location.hash = '#basket';
    }
  }
  putBookOnPage(teg: Component, book: TGood[]) {
    book.forEach((good) => {
      new BookCard(teg.root, this.services, good);
    })
  }
}