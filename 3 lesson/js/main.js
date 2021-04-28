const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
    constructor(url, container, list = list2) {
        this.container = container; // это переменная которая принимает в качестве параметра селектор. в какой элемент верстки мы будем помещать наши товары
        this.list = list;
        this.url = url; // адрес файла json  где хранятся файлы товоров
        this.goods = []; // массив товаров
        this.allProducts = []; // массив объектов классов товаров
        this._init();
    }
    getJson(url) { // Метод для получения данных из внешнего API
        return fetch(url ? url : `${API + this.url}`) // делаем ajax запрос. если url передается , то мы коннектимся к нему, если нет, то api + url
        .then(result => result.json()) //возвращает промис , поэтому при выхову нежно снова ставить обработчик then.
        .catch(error => {
            console.log(error);
        })
    }
    handleData(data) { // на вход принимаем наш массив товаров
        this.goods = [...data]; //распаковываем его 
        this.render(); // вызываем 
    }
    render() { // общий метод для вывода товаров и каталога и корзинки 
        const block = document.querySelector(this.container);
        for (let product of this.goods) { // в цикле обходим массив товаров 
            const productObj = new this.list[this.constructor.name](product); // вызываем конструктор: сделали объект товара либо CartItem, либо ProductItem this.list - это наш объект[свойтсва this.constructor.name - это имя класса, который вызывает наш товар, либо каталог, либо корзинка](на вход принимаем объект товар). каждый товар передаем в качестве параметра в конструктор класса товар
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render()); // с помощью объекта вызываем render
        }
    }
    _init(){
        return false // заглушка для наследования в других классах чтобы можно было переопределять/ далее это регистрация события
    }
    calcSum(){
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
}

class Item { //класс товара
    constructor(el, img = "https://placehold.it/200x150"){ //el - объект со свойтсвами товара???
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }
    render(){ // генерация товара для каталога товаров. в верстку кнопке мы добавили data-атрибуты id, name, price
        return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}" 
                    data-name=${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
        </div>`
    }
}


class ProductsList extends List {
    // cart объект список товаров корзины, container в какой элемент будем помещать наши товары, url то, что парсим
    constructor(cart, container = '.products', url = '/catalogData.json') { 
        super(url, container) // вызываем  конструктор базового класса
        this.cart = cart; //
        this.getJson() // вызывается из базового класса List. получаем объект js и запускается обработчик then
            .then(data => this.handleData(data)); //объект data полученый из getJson мы передаем в качестве параметра в функцию handleData
    }
    _init() { //как только мы вызываем конструктор вызывается Init
        document.querySelector(this.container).addEventListener('click', e => { //привязываем событие клик к кнопке купить
            if (e.target.classList.contains('buy-btn')) { // по клику на кнопку купить
                this.cart.addProduct(e.target); //с помощью объекта cart вызываем из класса cart метод добавить товар в корзинку и на вход передаем кнопку на которую нажали
            }
        });
    }
}


class ProductItem extends Item{}

class Cart extends List { //корзинка потомок класса List
    constructor(container = ".cart-block", url = '/getBasket.json') {
        super(url, container) //вызывае базовый конструткор
        this.getJson() // парсим файлик с товарами
            .then(data => { //
                this.handleData(data.contents); //вывели все товары в корзине
            });
    }
    addProduct(element) { // на входд принимает кнопку
        this.getJson(`${API}/addToBasket.json`) // парсит файл для связи с сервером (в файле одна инструкция result:1)
            .then(data => {
                if(data.result === 1) { //если полуаем 1, то связь есть
                    let productId = +element.dataset['id']; //получаем id товара
                    let find = this.allProducts.find(product => product.id_product === productId);// find - перебираем массив пока не выполнится функция возращаем true . ищем в массиве товаров корзины совпадение (каждый товар массива => берем id каждого товара массива === к id добавляемого товара)
                    if(find) { //если товар нашелся, то мы добавляем количество
                        find.quantity++;
                        this._updateCart(find); //обновляем цену
                    } else { // если нет товара, то создаем 
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],//извлекаем из кнопки
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product]; //перемещаем в массив goods созданный элемент
                        this.render(); // вызываем render для отрисовки
                    }
                } else {
                    alert('Error')
                }
            })
    }
    removeProduct(element) { // на вход принимаем кнопку
        this.getJson(`${API}/deleteFromBasket.json`) // проверяем на связь с сервером
            .then(data => {
                if(data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if(find.quantity > 1) { //если такого товара больше 1 , то уменьшаем количество на 1
                        find.quantity--;
                        this._updateCart(find); //обновляем верстку
                    } else { // если 1 товар
                        this.allProducts.splice(this.allProducts.indexOf(find), 1); //находим первый элемент и удалем товар из массива  (с какого индекса(с первого вхождения в наш массив), сколько удаляем)
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();//стираем из верстки
                    }
                }else {
                    alert('Error');
                }
            })
    }
    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`); //получаем блок с товаром корзинки
        block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `$${product.quantity*product.price}`;//обновляем поле цена товара (умножаем общее кол-во на стоимость)
    }
    _init(){
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible'); //либо показываем, либо скрываем корзинку
        });
        document.querySelector(this.container).addEventListener('click', e => { // при нажатии на кнопку с id - del-btn
            if(e.target.classList.contains('del-btn')){
                this.removeProduct(e.target); //запускаем из текущего класса removeProduct
            }
    })
}
}

class CartItem extends Item {
    constructor(el, img = "https://placehold.it/50x100") { //вызываем конструктор
        super(el, img); // на вход даем el -  объект товаров и получаем все свойства name, id и тд
        this.quantity = el.quantity; // количество
    }
    render(){
        return `<div class="cart-item" data-id="${this.id_product}">
            <div class="product-bio">
            <img src="${this.img}" alt="Some image">
            <div class="product-desc">
            <p class="product-title">${this.product_name}</p>
            <p class="product-quantity">Quantity: ${this.quantity}</p>
        <p class="product-single-price">$${this.price} each</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">$${this.quantity*this.price}</p>
            <button class="del-btn" data-id="${this.id_product}">&times;</button>
        </div>
        </div>`
    }
}



const list2 = {
    ProductsList: ProductItem, // список товара кталога : товар каталога
    Cart: CartItem // список товаров корзинки : каждый товар корзинки
};


let cart = new Cart(); //первым мы  делаем объект класса Cart
let products = new ProductsList(cart); // вызываем конструктор список товаров (если мы хотим использовать в классе методы другого класса, то удобнее всего в конструктор передать объект класса, методы которого нам нужны в данном классе)