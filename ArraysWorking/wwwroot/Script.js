let array = [5, 3, 6, 1, 5, 2];

console.log(array);

array.sort(function (e1, e2) {
    return e1 - e2;
});

console.log(array);