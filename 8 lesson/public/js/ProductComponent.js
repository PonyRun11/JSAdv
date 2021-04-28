Vue.component('products', {
   data(){
       return {
           catalogUrl: '/catalogData.json',
           filtered: [],
           products: [],
           imgProduct: 'https://placehold.it/200x150'
       }
   },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let item of data){
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    },
    methods: {
        filter(userSearch){
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
   template: `<div class="products container">
                <product v-for="item of filtered" 
                :product="item"
                @add-product="$parent.$refs.cart.addProduct"></product>
               </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: `
    <div class="product">
    <div class="product__overlay">
        <button class="product__overlay_btn" @click="$emit('add-product', product)"><img src="/img/basket_white.png" alt=""> Add to Cart</button>
    </div>
    <a href="#"><img :src="product.img" alt=""></a>
    <p class="product__description">{{product.product_name}}</p>
    <div class="star__price"><p class="product__price">{{product.price}}$</p>
    <div class="star"><i class="fas fa-star product-star"></i><i class="fas fa-star product-star"></i><i class="fas fa-star product-star"></i><i class="fas fa-star  product-star"></i><i class="fas fa-star product-star"></i></div></div>
</div>
    `
})