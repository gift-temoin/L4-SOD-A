// dailyLife.js

// Part 1: Variables and Data Types
let name = "Au kevin";
let age = 18;
let favoriteFood = "pizza";
let studyHoursPerDay = 3;

// Bonus Variable
let isStudent = true;

// Part 2: Simple Calculations
let studyHoursPerWeek = studyHoursPerDay * 7;
let ageInMonths = age * 12;
let ageInDogYears = age * 7;

// Part 3: Output
console.log("Hello, my name is " + name + ".");
console.log("I am " + age + " years old.");
console.log("I love eating " + favoriteFood + ".");
console.log(
  "I study " +
    studyHoursPerDay +
    " hours per day, which is " +
    studyHoursPerWeek +
    " hours per week."
);
console.log("I am " + ageInMonths + " months old.");

// Bonus Output
console.log("My age in dog years is " + ageInDogYears + ".");
console.log("Am I a student? " + isStudent);