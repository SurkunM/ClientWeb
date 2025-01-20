(function () {
    "use strict";

    const numbersArray1 = [5, 3, 6, 10, 4, 2, 0, 7, 9, 1];

    console.log(`Массив чисел: ${numbersArray1}`);

    function sortDescendingOrder(array) {
        array.sort((e1, e2) => e2 - e1);
    }

    sortDescendingOrder(numbersArray1);
    console.log(`Сортировка по убыванию: ${numbersArray1}`);

    function getFirstElements(array, elementsCount) {
        return array.slice(0, elementsCount);
    }

    function getLastElements(array, elementsCount) {
        return array.slice(-elementsCount);
    }

    const firstFiveNumbers = getFirstElements(numbersArray1, 5);
    const lastFiveNumbers = getLastElements(numbersArray1, 5);

    console.log(`Первые пять чисел: ${firstFiveNumbers}`);
    console.log(`Последние пять чисел: ${lastFiveNumbers}`);

    function getEvenNumbersSum(array) {
        return array
            .filter(e => e % 2 === 0)
            .reduce((r, e) => r + e, 0);
    }

    const evenNumbersSum = getEvenNumbersSum(numbersArray1);
    console.log(`Сумма четных чисел массива: ${evenNumbersSum}`);

    function createNumbersArray(elementsCount) {
        const array = [];

        for (let i = 1; i <= elementsCount; i++) {
            array.push(i);
        }

        return array;
    }

    const numbersArray2 = createNumbersArray(100);
    console.log(`Массив чисел от 1 до 100: ${numbersArray2};`);

    function getArrayEvenNumbersSquares(array) {
        return array
            .filter(e => e % 2 === 0)
            .map(e => e * e);
    }

    const evenNumbersSquaresArray = getArrayEvenNumbersSquares(numbersArray2);
    console.log(`Массив квадратов четных чисел данного массива: ${evenNumbersSquaresArray};`);
})();