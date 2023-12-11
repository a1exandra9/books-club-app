import { Timestamp } from "firebase/firestore";
import { AuthService } from "../Services/AuthService";
import { DBService } from "../Services/DBService";
import { LogicService } from "../Services/LogicService";

export type TServices = {
  authService: AuthService;
  logicService: LogicService;
  dbService: DBService;
}


export type TGood = {
  name: string,
  price: number,
  genre: string,
  date: Timestamp,
  url: string,
  id: string
}
export type TGoodBasket = {
  book: TGood
}
export type TDataBasket = {
  summa: number,
  count: number
}
export type TDataHistory = {//переменная для оформленного заказа
  basket: TGoodBasket[],
  dataBasket: TDataBasket,
  date: Timestamp,
  id: string
}
export type TDataGraph = {
  x: Date,
  y: number
}
export type TCriteria = {//переменная для критерий фильтрации и сортировки
  genre: string,
  limit: number
}

export type TDataUser = {
  name: string,
  fotoUrl: string,
  email: string,
  basket: TGoodBasket[];
}