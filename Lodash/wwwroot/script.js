(function () {
    "use strict";

    const persons = [
        {name: "Ivan", age: 20},
        {name: "Ivan", age: 20},
        {name: "Ivan", age: 47},
        {name: "Olga", age: 28},
        {name: "Alexandr", age: 18},
        {name: "Vladimir", age: 24},
        {name: "Natalya", age: 22},
        {name: "Olga", age: 21},
        {name: "Irina", age: 33},
        {name: "Sergey", age: 38}
    ];

    const personsAverageAge = _.chain(persons)
        .map("age")
        .mean()
        .value();

    console.log(`Средний возраст людей: ${personsAverageAge}`);

    const ascendingSortedFrom20To30AgePersons = _.chain(persons)
        .filter(p => p.age >= 20 && p.age <= 30)
        .sortBy("age")
        .value();

    console.log("Список людей возрастом от 20 до 30, отсортированный по возрастанию:");
    ascendingSortedFrom20To30AgePersons.forEach(p => console.log(`${p.name}: ${p.age}`));

    const descendingSortedFrom20To30AgePersonsUniqueNames = _.chain(persons)
        .filter(p => p.age >= 20 && p.age <= 30)
        .orderBy("age", "desc")
        .map("name")
        .uniq()
        .value();

    console.log("Список уникальных имен людей возрастом от 20 до 30, отсортированный по убыванию:");
    descendingSortedFrom20To30AgePersonsUniqueNames.forEach(n => console.log(`${n}`));

    const personsNamesAndPersonsNamesCountsDictionary = _(persons)
        .countBy("name")
        .value();

    console.log("Коллекция имен людей и количества людей с этими именами:");

    for (const personName in personsNamesAndPersonsNamesCountsDictionary) {
        console.log(`${personName}: ${personsNamesAndPersonsNamesCountsDictionary[personName]}`);
    }
})();