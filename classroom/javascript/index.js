// class Animal {
//   constructor(name, sound) {
//     this.name = name;
//     this.sound = sound;
//   }
//   makeSound() {
//     console.log(`${this.name} says ${this.sound} ${this.sound}`);
//   }
// }

// const dog = new Animal("Dog", "Woof");
// const cat = new Animal("Cat", "Meow");
// const quack = new Animal("Duck", "Quack");
// const cow = new Animal("Cow", "Moo");

// dog.makeSound();
// cat.makeSound();
// quack.makeSound();
// cow.makeSound();
 class Person {
   constructor(name, age) {
     this.name = name;
     this.age = age;
   }
   greet() {
     console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
   }
 }

 class Student extends Person {
   constructor(name, age, grade) {
     super(name, age);
     this.grade = grade;
   }
   study() {
     console.log(`${this.name} is studying and is in grade ${this.grade}.`);
   }
 }

 const student = new Student("Alice", 20, "A");
 student.greet();
 student.study();