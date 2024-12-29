(function () {
    "use strict";

    const numbersArrayTask1 = [5, 3, 6, 10, 4, 2, 0, 7, 9, 1];

    console.log(`Массив чисел: ${numbersArrayTask1}`);

    function arrayDescendingOrder(array) {
        array.sort((e1, e2) => e2 - e1);
    }

    arrayDescendingOrder(numbersArrayTask1);
    console.log(`Сортировка по убыванию: ${numbersArrayTask1}`);

    function getFirstFiveElements(array) {
        return array.slice(0, 5);
    }

    function getLastFiveElements(array) {
        return array.slice(-5);
    }

    const firstFiveNumbers = getFirstFiveElements(numbersArrayTask1);
    const lastFiveNumbers = getLastFiveElements(numbersArrayTask1);

    console.log(`Первые пять чисел: ${firstFiveNumbers}`);
    console.log(`Последние пять чисел: ${lastFiveNumbers}`);

    function getEvenNumbersSum() {
        return numbersArrayTask1
            .filter(e => e % 2 === 0)
            .reduce((i, e) => i + e, 0);
    }

    const evenNumbersSum = getEvenNumbersSum(numbersArrayTask1);
    console.log(`Сумма четных чисел массива: ${evenNumbersSum}`);

    function createNumbersArray(elementsCount) {
        const newArray = [];

        for (let i = 1; i <= elementsCount; i++) {
            newArray.push(i);
        }

        return newArray;
    }

    const numbersArrayTask2 = createNumbersArray(100);
    console.log(`Массив чисел от 1 до 100: ${numbersArrayTask2};`);

    function getArrayEvenNumbersSquares(array) {
        return array
            .filter(e => e % 2 === 0)
            .map(e => e * e);
    }

    const evenNumbersSquaresArray = getArrayEvenNumbersSquares(numbersArrayTask2);
    console.log(`Массив квадратов четных чисел данного массива: ${evenNumbersSquaresArray};`);
})();