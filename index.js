let store = { deliveries: [], employers: [], customers: [], meals: [] };
let customerId = 0;
let mealId = 0;
let deliveryId = 0;
let employerId = 0;

class Delivery {
  constructor(meal = {}, customer = {}) {
    this.mealId = meal.id;
    this.customerId = customer.id;
    this.id = ++deliveryId;
    store.deliveries.push(this);
  }

  customer() {
    return store.customers.find(customer => {
      return customer.id === this.customerId;
    });
  }

  meal() {
    return store.meals.find(meal => {
      return meal.id === this.mealId;
    });
  }
}

class Meal {
  constructor(title, price) {
    this.title = title;
    this.price = price;
    this.id = ++mealId;
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.meal();
    });
  }

  customers() {
    return this.deliveries().map(delivery => {
      return delivery.customer();
    });
  }

  static byPrice() {
    let orderedMeals = store.meals.slice();
    return orderedMeals.sort(function(a, b) {
      return b.price - a.price;
    });
  }
}

class Customer {
  constructor(name, employer = {}) {
    this.name = name;
    this.employerId = employer.id;
    this.id = ++customerId;
    store.customers.push(this);
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id;
    });
  }

  meals() {
    return this.deliveries().map(delivery => {
      return delivery.meal();
    });
  }

  totalSpent() {
    return this.meals().reduce((total, meal) => {
      return total + meal.price;
    }, 0);
  }
}

class Employer {
  constructor(name) {
    this.name = name;
    this.id = ++employerId;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter(customer => {
      return customer.employerId === this.id;
    });
  }

  deliveries() {
    let nestedDeliveries = this.employees().map(employee => {
      return employee.deliveries();
    });
    let deliveryArray = [].concat.apply([], nestedDeliveries);
    return deliveryArray;
  }

  meals() {
    let nestedMeals = this.employees().map(employee => {
      return employee.meals();
    });
    let mealsArray = [].concat.apply([], nestedMeals);
    // console.log(mealsArray);
    let uniqueMealsArray = mealsArray.filter((meal, index, mealsArray) => {
      return index === mealsArray.indexOf(meal);
    });
    return uniqueMealsArray;
  }

  mealTotals() {
    let allMeals = this.deliveries().map(delivery => {
      return delivery.meal();
    });
    let mealsCounter = {};
    allMeals.forEach(function(meal) {
      mealsCounter[meal.id] = 0;
    });
    allMeals.forEach(function(meal) {
      mealsCounter[meal.id] += 1;
    });
    return mealsCounter;
  }
}
