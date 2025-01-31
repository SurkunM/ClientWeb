(function () {
    "use strict";

    const countries = [
        {
            name: "Russia",
            cities: [
                {name: "Moscow", population: 12636312},
                {name: "Saint-Petersburg", population: 5600044},
                {name: "Novosibirsk", population: 1635338}
            ]
        },
        {
            name: "USA",
            cities: [
                {name: "Washington", population: 671803},
                {name: "Chicago", population: 2747000}
            ]
        },
        {
            name: "China",
            cities: [
                {name: "Beijing", population: 21893095},
                {name: "Shanghai", population: 26320671},
                {name: "Wuhan", population: 13650432}
            ]
        }
    ];

    function getMaxCitiesCountCountries(countries) {
        const maxCitiesCount = Math.max.apply(null, countries.map(c => c.cities.length));

        return countries.filter(country => country.cities.length === maxCitiesCount);
    }

    const maxCitiesCountCountries = getMaxCitiesCountCountries(countries);

    console.log("Страны с максимальным количеством городов:");
    maxCitiesCountCountries.forEach(c => console.log(c.name));

    function getCountriesNamesAndTotalPopulationDictionary(countries) {
        const result = {};

        countries.forEach(country => {
            result[country.name] = country.cities.reduce((sum, city) => sum + city.population, 0);
        });

        return result;
    }

    const countriesNamesAndTotalPopulationDictionary = getCountriesNamesAndTotalPopulationDictionary(countries);

    console.log("Коллекция стран и суммы населения городов:");

    for (const countryName in countriesNamesAndTotalPopulationDictionary) {
        console.log(`${countryName}: ${countriesNamesAndTotalPopulationDictionary[countryName]}`);
    }
})();