(function () {
    "Use strict";
    const countries = [{
        name: 'Russia',
        cities: [
            { name: 'Moscow', population: 12636312 },
            { name: 'Saint-Petersburg', population: 5600044 },
            { name: 'Novosibirsk', population: 1635338 }
        ]
    },
    {
        name: 'USA',
        cities: [
            { name: 'Washington', population: 671803 },
            { name: 'Chicago', population: 2747000 }
        ]
    },
    {
        name: 'Chaina',
        cities: [
            { name: 'Beijing', population: 21893095 },
            { name: 'Shanghai', population: 26320671 },
            { name: 'Wuhan', population: 13650432 }
        ]
    }];

    (function () {
        let maxCitiesCountries = {};

        maxCitiesCountries = countries.filter(c => c.cities.length === Math.max.apply(null, countries.map(c => c.cities.length)));

        console.log("Страны с максимальным количеством городов:");
        maxCitiesCountries.forEach(c => console.log(c.name));
    })();

    (function () {
        let countriesDictionary = {};

        countries.forEach(country => countriesDictionary[country.name] = country.cities.reduce((accumulator, city) => accumulator + city.population, 0));

        console.log("Коллекция стран и суммы населения городов:");

        for (const country in countriesDictionary) {
            console.log(`${country}: ${countriesDictionary[country]}`);
        }
    })();
})();