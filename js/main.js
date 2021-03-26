const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];
//Функция для формирования верстки каждого товара
const renderProduct = (title = "Notebook", price = '2000') => {
    return `<div class="product-item">
                <img class="photos" src="img/images.jpg">
                <h3>${title}</h3>
                <p>${price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
};
const renderPage = list => {
    //если использовать forEach, то не нужно использовать .join(""), чтобы убрать запятые
    // let productsList = "";
    // products.forEach(function(item){
    //     productsList += renderProduct(item);
    // })
    const productsList = list.map(item => renderProduct(item.title, item.price));
    document.querySelector('.products').innerHTML = productsList.join("");
};

renderPage(products);