class Car {
    constructor(brand, model, year, color) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.color = color;
    }
    getInfo() {
        console.log(`Սա  ${this.brand} ${this.model} է, ${this.color} գույնի, արտադրված ${this.year} թվականին։`);
    }

    getAge() {
        console.log(`Այս մեքենան ${2026- this.year} տարեկան է։`);
    }
}
const firstCars = new Car("Toyota", "Camry", 2015, "սև");
const secondCars = new Car("Honda", "Civic", 2018, "սպիտակ");
const thirdCars = new Car("Ford", "Mustang", 2020, "կարմիր");
const fourthCars = new Car("Tesla", "Model 3", 2021, "սպիտակ");

const cars = [firstCars, secondCars, thirdCars, fourthCars];

cars.forEach(car => {
    car.getInfo();
    car.getAge();
});