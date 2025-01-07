document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const celsiusTemperatureField = document.getElementById("celsius-temperature-field");
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const kelvinConversionResultLabel = document.getElementById("kelvin-conversion-result");
    const fahrenheitConversionResultLabel = document.getElementById("fahrenheit-conversion-result");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        celsiusTemperatureField.classList.remove("invalid");

        const celsiusTemperatureText = celsiusTemperatureField.value.trim();

        if (celsiusTemperatureText.length === 0) {
            addInvalidClass();
            return;
        }

        const celsiusTemperature = Number(celsiusTemperatureField.value);

        if (isNaN(celsiusTemperature)) {
            addInvalidClass();
            return;
        }

        function setConversionResultText(resultTextLabel, temperatureConversionResult) {
            const lastChild = resultTextLabel.lastChild;
            lastChild.textContent = temperatureConversionResult;
        }

        function addInvalidClass() {
            celsiusTemperatureField.classList.add("invalid");
        }

        function convertCelsiusToFahrenheit(celsiusTemperature) {
            return celsiusTemperature * 1.8 + 32;
        }

        function convertCelsiusToKelvin(celsiusTemperature) {
            return celsiusTemperature + 273.15;
        }

        setConversionResultText(kelvinConversionResultLabel, convertCelsiusToKelvin(celsiusTemperature));
        setConversionResultText(fahrenheitConversionResultLabel, convertCelsiusToFahrenheit(celsiusTemperature));
    });
});