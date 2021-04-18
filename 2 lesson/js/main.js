class ProductsList{
    constructor(container = '.products'){ 
        this.container = container; 
        this.goods = []; 
        this._fetchProducts();  
    } 
    
    _fetchProducts(){ 
        this.goods = [
            {id: 1, title: 'Notebook', price: 2000},
            {id: 2, title: 'Mouse', price: 20},
            {id: 3, title: 'Keyboard', price: 200},
            {id: 4, title: 'Gamepad', price: 50},
        ];
    }
    render() {
        const block = document.querySelector(this.container); 
        for(let product of this.goods){ 
            const productObj = new ProductItem(product); 
            // this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend',productObj.render()) 
        }
    }

    sumAllProducts() {
        let sum = 0;
        for(let product of this.goods) {
          sum += product.price;
        }
        return sum;
    }
    // let res = this.allProducts.reduce((sum, item) => += item.price, 0);
    
}


class ProductItem{
	constructor(product, img = 'https://placehold.it/200x150'){ 
		this.title = product.title; 
		this.price = product.price;
		this.id = product.id;
		this.img = img;
		
	}
	
	render(){ 
		 return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
	}
}

class ShopBasket {
    constructor(product, img) {
        this.title = product.title; 
		this.price = product.price;
		this.id = product.id;
		this.img = img; 
    }

    addGoods() {

    }

    removeGoods() {

    }

    changeGoods(){

    }

    render(){

    }

}

class ItemShopBasket {
   render(){
       
   }
}


let list = new ProductsList();
list.render(); 
console.log(list.sumAllProducts());




    



