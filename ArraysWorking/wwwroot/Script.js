(function () {
    "use strict";

    (function () {
        const array = [5, 3, 6, 10, 4, 2, 0, 7, 9, 1];

        console.log(`Массив чисел: ${array}`);

        (function () {
            array.sort((e1, e2) => e2 - e1);

            console.log(`Сортировка по убыванию: ${array}`);
        })();

        (function () {
            const firstFiveNumbers = array.slice(0, 5);
            const lastFiveNumbers = array.slice(array.length - 5);

            console.log(`Первые пять чисел ${firstFiveNumbers}`);
            console.log(`Последние пять чисел ${lastFiveNumbers}`);
        })();

        (function () {
            const evenNumbersSum = array
                .filter(e => e % 2 === 0)
                .reduce((a, e) => a + e, 0);

            console.log(`Сумма четных чисел массива: ${evenNumbersSum}`);
        })();
    })();

    (function () {
        const array = [];

        (function () {
            for (let i = 1; i <= 100; i++) {
                array.push(i);
            }

            console.log(`Массив чисел от 1 до 100: ${array};`);
        })();

        (function () {
            const evenNumbersSquaresArray = array
                .filter(e => e % 2 === 0)
                .map(e => e * e);

            console.log(`Массив квадратов четных чисел данного массива: ${evenNumbersSquaresArray};`);
        })();
    })();
})();