(function () {
    const persons = [
        { name: "Ivan", age: 20 },
        { name: "Ivan", age: 16 },
        { name: "Ivan", age: 47 },
        { name: "Olga", age: 31 },
        { name: "Olga", age: 20 },
        { name: "Alexandr", age: 18 },
        { name: "Natalya", age: 22 },
        { name: "Vladimir", age: 24 },
        { name: "Irina", age: 33 },
        { name: "Sergey", age: 38 },
    ];

    const personsAgeAverage = _
        .chain(persons)
        .flatMap(p => p.age)
        .mean(p => p.age)
        .value();

    console.log(`Срелний возраст людей: ${personsAgeAverage}`);

    const ascendingSordedFrom20To30AgePersons = _
        .chain(persons)
        .filter(p => p.age <= 20 || p.age >= 30)
        .sortBy(p => p.age)
        .value();

    console.log("Список людей младше 20 и старше 30, отсортированный по возрастанию возраста:");
    ascendingSordedFrom20To30AgePersons.forEach(p => console.log(`${p.name}: ${p.age}`));

    const descendingSortedFrom20To30AgePersons = _
        .chain(persons)
        .filter(p => p.age <= 20 || p.age >= 30)
        .orderBy("age", "desc")
        .value();

    console.log("Список людей младше 20 и старше 30, отсортированный по убыванию возраста:");
    descendingSortedFrom20To30AgePersons.forEach(p => console.log(`${p.name}: ${p.age}`));

    const namesAndNamesCountsDictionary = _
        .chain(persons)
        .countBy(p => p.name)
        .value();

    console.log("Коллекция имен людей и количества людей с этими именами:");
    for (const person in namesAndNamesCountsDictionary) {
        console.log(`${person}: ${namesAndNamesCountsDictionary[person]}`);
    }
})();