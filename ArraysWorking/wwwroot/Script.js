"use strict";

(function ()
{
    let array1 = [5, 3, 6, 10, 4, 2, 0, 7, 9, 1];

    console.log(array1);

    array1.sort((e1, e2) => e2 - e1);

    console.log(array1);

    const array2 = array1.slice(0, 5);
    const array3 = array1.slice(5)

    console.log(array2);
    console.log(array3);

    const evenNumbersSum = array1
        .filter(e => e % 2 === 0)
        .reduce((s, c) => s + c, 0);

    console.log(evenNumbersSum);

})();

(function ()
{
    let array = [];

    for (let i = 1; i <= 100; i++)
    {
        array.push(i);
    }

    console.log(array);

    const evenNumbersSquaresArray = array
        .filter(e => e % 2 === 0)
        .map(e => e * e);

    console.log(evenNumbersSquaresArray);
})();