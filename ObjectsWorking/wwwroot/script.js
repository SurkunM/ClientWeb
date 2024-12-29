(function () {
    "use strict";

    const countries = [
        {
            name: "Russia",
            cities: [
                { name: "Moscow", population: 12636312 },
                { name: "Saint-Petersburg", population: 5600044 },
                { name: "Novosibirsk", population: 1635338 }
            ]
        },
        {
            name: "USA",
            cities: [
                { name: "Washington", population: 671803 },
                { name: "Chicago", population: 2747000 }
            ]
        },
        {
            name: "China",
            cities: [
                { name: "Beijing", population: 21893095 },
                { name: "Shanghai", population: 26320671 },
                { name: "Wuhan", population: 13650432 }
            ]
        }
    ];

    function getMaxCitiesCountries(array) {
        const maxCitiesCount = Math.max.apply(null, array.map(c => c.cities.length));

        return array.filter(country => country.cities.length === maxCitiesCount);
    }

    const maxCitiesCountries = getMaxCitiesCountries(countries);

    console.log("Страны с максимальным количеством городов:");
    maxCitiesCountries.forEach(c => console.log(c.name));

    function getCountriesNameAndPopulationSumDictionary(array) {
        const dictionary = {};

        array.forEach(country => {
            return dictionary[country.name] = country.cities.reduce((initialPopulation, city) => initialPopulation + city.population, 0)
        });

        return dictionary;
    }

    const countriesNameAndPopulationSumDictionary = getCountriesNameAndPopulationSumDictionary(countries);

    console.log("Коллекция стран и суммы населения городов:");

    for (const countryKey in countriesNameAndPopulationSumDictionary) {
        console.log(`${countryKey}: ${countriesNameAndPopulationSumDictionary[countryKey]}`);
    }
})();