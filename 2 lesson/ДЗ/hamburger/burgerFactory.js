class Param{
    // element - это объект, весь наш input полученный из _select
    constructor(element){    
        this.name = element.value;
        this.price = +element.dataset['price'];
        this.calories = +element.dataset['calories'];
    }
}

class Burger{
    constructor(size,add,topping){//add - начинка
        // вызываем конструктор Param(передаем как параметр результат функции). Вложенная конструкция объектов
        this.size = new Param(this._select(size)); 
        this.add = new Param(this._select(add)); 
        this.toppings = this._getToppings(topping);
    }
    
    _getToppings(name){
        // на вход принимаем имя нашего элемента toppings, готовим пустой массив
        let result = [];
        // запускаем _selectAll, получаем массив инпутов с отмеченными чекбоксами, перебираем его с помощью forEach (каждый отмеченный чекбокс => добавляем в наш пустой массив result объекты класса Param как после _select)
        this._selectAll(name).forEach(el => result.push(new Param(el)))
        return result;
    }
    
    _select(name){
        // возвращаем элемент у которого название совпадает с нашим name отмеченным checked
        return document.querySelector(`input[name=${name}]:checked`);
    }
    
    _selectAll(name){
        // на вход даем имя toppings, и получаем массив с отмеченными inputaми, распаковываем и возвращаем в виде массива
        return [...document.querySelectorAll(`input[name=${name}]:checked`)];
   }
    
    _sumPrice(){
        //console.log(this.toppings);
        // берем цену размера бургера и прибавляем цену начинки бургера
        let result = this.size.price + this.add.price;
        // обращаемся к массиву toppings , обхоим в цикле и к result добавляем все price, которые есть в массиве
        this.toppings.forEach(el => result += el.price);
        // возвращаем 
        return result;
    }
    
    _sumCalories(){
        // берем калории размера бургера и прибавляем калории начинки бургера
        let result = this.size.calories + this.add.calories;
        // обращаемся к массиву toppings , обхоим в цикле и к result добавляем все calories, которые есть в массиве
        this.toppings.forEach(el => result += el.calories);
        return result;
    }
    
    showSum(price, calories){
        // по id мы получаем доступ к тэгу span берем textContent и записывам = результат метода  _sumPrice
        document.querySelector(price).textContent = this._sumPrice();
        // тоже самое 
        document.querySelector(calories).textContent = this._sumCalories();
    }
}