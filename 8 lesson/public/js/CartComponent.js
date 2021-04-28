// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data(){
      return {
          cartUrl: '/getBasket.json',
          cartItems: [],
          imgCart: 'https://placehold.it/50x100',
          showCart: false
      }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    this.$data.cartItems.push(item);
                }
            });
    },
    methods: {
        addProduct(item){
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++
                        }
                    })
            } else {
                const prod = Object.assign({quantity: 1}, item);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.cartItems.push(prod)
                        }
                    })
            }

            // this.$parent.getJson(`${API}/addToBasket.json`)
            //     .then(data => {
            //         if(data.result === 1){
            //             let find = this.cartItems.find(el => el.id_product === item.id_product);
            //             if(find){
            //                 find.quantity++;
            //             } else {
            //                 const prod = Object.assign({quantity: 1}, item);
            //                 this.cartItems.push(prod)
            //             }
            //         }
            //     })
        },
        remove(item){
            this.$parent.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if(item.quantity>1){
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    }
                })
        },
    },
    template: `<div>
<button class="btn-cart" type="button" @click="showCart = !showCart">My Account<i class="fas fa-caret-down fa_white"></i></button>
        <div class="cart-block" v-show="showCart">
            <cart-item v-for="item of cartItems" :key="item.id_product" :img="imgCart" :cart-item="item" @remove="remove">
            </cart-item>
        </div>
        </div>
    `
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template: `
    <div class="mini__productCart">
                            <img class="mini_img" :src="cartItem.img" alt="">
                            <div class="mini_description">
                                <h2 class="mini_h2">{{ cartItem.product_name }}</h2>
                                <div class="mini_star"><i class="fas fa-star mini-star"></i><i class="fas fa-star mini-star"></i><i class="fas fa-star mini-star"></i><i class="fas fa-star mini-star"></i><i class="fas fa-star mini-star"></i></div>
                                <span class="mini_price">{{ cartItem.quantity }} x {{ cartItem.price }}</span> 
                            </div>
                           <button class="mini_btn" @click="$emit('remove', cartItem)"><i class="fas fa-times-circle close-mini"></i></button> 
                           <div class="total__price">
                           <span>{{cartItem.quantity*cartItem.price}}$</span>
                       </div> 
                        </div>    
                         
    `
})