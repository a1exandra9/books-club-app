import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class Authorization extends Component {
  regButton: Component;
  outButton: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["authorization"]);


    new Component(this.root, 'p', ["page__title"], 'Вход в личный кабинет')
    new Component(this.root, 'p', ["basket__text"], 'После входа вы сможете оформить заказ и произвести оплату удобным для вас способом. Также у вас появится возможность следить за своей статистикой посещений клуба.')

    this.regButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Войти"]);
    this.regButton.root.onclick = () => {
      this.services.authService.authWidthGoogle();
    }

    this.outButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Выйти"]);
    this.outButton.root.onclick = () => {
      this.services.authService.outFromGoogle();
    }
    const user = this.services.authService.user;
    if (user) {
      this.toggleButton(true);
    } else {
      this.toggleButton(false);
    }

    this.services.authService.addListener('userAuth', (isAuthUser) => {
      if (isAuthUser) {
        this.toggleButton(true)
      } else {
        this.toggleButton(false)
      }
    })
  }


  toggleButton(isAuthUser: boolean): void {
    if (isAuthUser) {
      this.regButton.remove();
      this.outButton.render();
    } else {
      this.regButton.render();
      this.outButton.remove();
    }
  }
}