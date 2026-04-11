let numbers = [12, 5, 8, 21, 3, 17, 9, 30, 2, 14];

//Console.log the array
console.log(numbers);

//Console log the numbers that are greater than 10
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 10) {
    console.log(numbers[i]);
  }
}

//Calculate the sum of the numbers in the array
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}
console.log("Sum of the numbers: " + sum);

// Find the smallest number in the array
let smallest = numbers[0];
for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] < smallest) {
    smallest = numbers[i];
  }
}
console.log("Smallest number in array is " + smallest);

//Count the number of even numbers in the array
let evenCount = 0;
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenCount++;
  }
}
console.log("Number of even numbers in the array: " + evenCount);

//Fibonacci
let fib = [0, 1];
for(let i = 0; i < 10; i++) {
  fib[i+2] = fib[i+1] + fib[i];
}

console.log(fib)