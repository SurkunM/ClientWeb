"Use strict";

(function () {
    const countries = [
        {
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
        }
    ];

    countries
        .filter(c => c.cities.length === Math.max.apply(null, countries.map(c => c.cities.length)))
        .forEach(c => console.log(c.name));

    let countriesInformation = {};

    countries
        .forEach(c => countriesInformation[c.name] = c.cities.reduce((s, c) => s + c.population, 0));

    console.log(countriesInformation);
})();