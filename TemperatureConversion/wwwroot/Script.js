document.addEventListener("DOMContentLoaded", function () {
    const incomingTemperatureField = document.getElementById("incoming-temperature-field");
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const kelvinConversionResult = document.getElementById("kelvin-conversion-result");
    const fahrenheitConversionResult = document.getElementById("fahrenheit-conversion-result");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        incomingTemperatureField.classList.remove("invalid");

        let incomingTemperature = incomingTemperatureField.value.trim();

        if (incomingTemperature.length === 0) {
            addInvalidClass();

            return;
        }

        const celsiusTemperature = Number(incomingTemperatureField.value);

        if (isNaN(celsiusTemperature)) {
            addInvalidClass();

            return;
        }

        setResultNode(kelvinConversionResult, celsiusTemperature + 273.15);
        setResultNode(fahrenheitConversionResult, celsiusTemperature * 1.8 + 32);

        function setResultNode(node, conversionResult) {
            if (node.childElementCount === 1) {
                node.appendChild(document.createElement("label"));
            }

            const lastChild = node.querySelector(":last-child");
            lastChild.textContent = conversionResult;
        }

        function addInvalidClass() {
            incomingTemperatureField.classList.add("invalid");
        }
    });
});