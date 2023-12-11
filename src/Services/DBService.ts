import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, limit, query, setDoc, Timestamp, where } from "firebase/firestore";
import { Observer } from "../Abstract/Observer";
import { TCriteria, TDataBasket, TDataGraph, TDataHistory, TDataUser, TGood, TGoodBasket } from "../Abstract/Type";

export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: TDataUser | null = null;

  dataBasket: TDataBasket = {
    summa: 0,
    count: 0,
  };

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  async getAllGood(criteria: TCriteria): Promise<TGood[]> {
    const crit = [];
    if (criteria.genre != 'all') crit.push(where("genre", "==", criteria.genre));
    if (criteria.limit != 25) crit.push(limit(criteria.limit));
    const q = query(collection(this.db, 'books'), ...crit);
    // const q = query(collection(this.db, 'books'));

    const querySnapshot = await getDocs(q);
    const storage = getStorage();
    const goods = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const uri = ref(storage, data.url);
      const url = await getDownloadURL(uri);
      const good = {
        name: data.name as string,
        price: data.price as number,
        genre: data.genre as string,
        date: data.date as Timestamp,
        url: url,
        id: doc.id
      };
      return good;
    });
    return Promise.all(goods);
  }

  async getDataUser(user: User | null): Promise<void> {
    if (user === null) return;

    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.dataUser = docSnap.data() as TDataUser;
      // console.log(docSnap.data());
    } else {
      const data = {
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL,
        basket: [],
      };
      await setDoc(doc(this.db, "users", user.uid), data);
      const docSetSnap = await getDoc(docRef);
      this.dataUser = docSetSnap.data() as TDataUser || null;
      console.log("create documemt");
    }
  }
  async addBookInBasket(user: User | null, book: TGood): Promise<void> {
    if (!user || !this.dataUser) return;
    const index = this.dataUser.basket.findIndex(el => el.book.id === book.id);
    if (index >= 0) return;


    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);

    const bookBasket = {
      book: book,
    } as TGoodBasket;

    newUser.basket.push(bookBasket);

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket(user);
        this.dispatch('bookInBasket', bookBasket);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }

  async delBookFromBasket(user: User | null, book: TGoodBasket): Promise<void> {
    if (!user || !this.dataUser) return;

    const newBasket = this.dataUser.basket.filter((el) => el.book.id !== book.book.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket = newBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket(user);
        this.dispatch('delBookFromBasket', book.book.id);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }
  async calcDataBasket(user: User | null): Promise<void> { //высчитывает общую сумму корзины
    if (!user || !this.dataUser) return;
    let summa = 0;
    let count = 0;
    this.dataUser.basket.forEach(el => {
      summa += Number(el.book.price);
      count += 1;
    })

    this.dataBasket.summa = summa;
    this.dataBasket.count = count;
  }
  async addBasketInHistory(user: User | null): Promise<void> {//добавление корзины в историю
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser)
    newUser.basket = [];

    const dataHistory = {
      basket: this.dataUser.basket,
      dataBasket: this.dataBasket,
      date: Timestamp.now()
    };

    await addDoc(collection(this.db, 'users', user.uid, 'history'), dataHistory)
      .then(async () => {
        await setDoc(doc(this.db, 'users', user.uid), newUser)
          .then(() => {
            if (!this.dataUser) throw "БД отсутствует";
            this.dataUser.basket.forEach((el) => {
              this.dispatch('delBookFromBasket', el.book.id);
            })
            this.dispatch('addInHistory', dataHistory)
            this.dataUser = newUser;
            this.calcDataBasket(user);
            this.dispatch('clearBasket');
            this.dispatch('changeDataBasket', this.dataBasket);
            this.calcCountDocsHistory(user);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  async calcCountDocsHistory(user: User | null): Promise<void> {//считает количество документов в истории
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    querySnapshot.docs.forEach(el => {
      summa += el.data().dataBasket.summa;
    })
    this.dispatch('changeStat', count, summa.toFixed(2));
  }
  async getAllHistory(user: User | null): Promise<TDataHistory[]> {
    if (!user || !this.dataUser) return [];
    const querySnapshot = await getDocs(collection(this.db, 'users', user.uid, 'history'));
    const rez = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TDataHistory;
      data.id = doc.id;
      return data;
    })
    return rez;
  }
  updateDataGraph(histories: TDataHistory[]): TDataGraph[] {
    const data = {} as Record<string, number>;
    histories.forEach((el) => {
      const newDate = el.date.toDate()
      newDate.setDate(1)
      // dataString.toLocaleString();
      const dataString = newDate.toDateString()
      console.log(newDate.toDateString())
      if (data[dataString]) {
        data[dataString] += el.dataBasket.summa;
      } else {
        data[dataString] = el.dataBasket.summa;
      }
    });
    const sortData = [];
    for (const day in data) {
      sortData.push({
        x: new Date(day),
        y: data[day]
      });
    }
    return sortData.sort(
      (a, b) => a.x.getMilliseconds() - b.x.getMilliseconds()
    );
  }
}