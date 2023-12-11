import { Component } from "../Abstract/Component";
import { TDataHistory, TServices } from "../Abstract/Type";
import { CardHistory } from "../Common/CardHistory";
import { Graph } from "../Common/Graph";

export class Account extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["account"])

    const divAccount = new Component(this.root, 'div', ['account__person']);
    new Component(divAccount.root, 'p', ["page__title"], 'Личный кабинет')
    const divPerson = new Component(divAccount.root, 'div', ["account__information"]);
    new Component(divPerson.root, 'span', ['account__name'], `Имя: ${services.dbService.dataUser?.name}`)
    new Component(divPerson.root, 'p', ['account__email'], `email: ${services.dbService.dataUser?.email}`)


    const divStat = new Component(this.root, 'div', ['account__person']);
    new Component(divStat.root, 'p', ["page__title"], 'Статистика')
    const divGraph = new Component(divStat.root, "div", ["stat__graph"]);
    const graph = new Graph(divGraph.root);

    const user = services.authService.user;
    services.dbService.getAllHistory(user).then((historys) => {
      graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
      graph.graphik.update();
      // this.putHistoryOnPage(this.divHistory, historys);
    });

    const divHistory = new Component(this.root, 'div', ['account__person']);
    new Component(divHistory.root, 'p', ["page__title"], 'История заказов');


    services.dbService.calcCountDocsHistory(user);

    services.dbService.getAllHistory(user).then((historys) => {
      // graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
      // graph.graphik.update();
      this.putHistoryOnPage(divHistory, historys);
    });

    services.dbService.addListener('addInHistory', (history) => {
      const user = services.authService.user;
      services.dbService.getAllHistory(user).then((historys) => {
        graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
        graph.graphik.update();
      });
      this.putHistoryOnPage(divHistory, [history as TDataHistory]);
    });

  }
  putHistoryOnPage(teg: Component, historys: TDataHistory[]) {
    historys.forEach((history) => {
      new CardHistory(teg.root, this.services, history);
    })
  }
}