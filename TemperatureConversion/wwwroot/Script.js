document.addEventListener("DOMContentLoaded", function () {
    const incomingTemperatureField = document.getElementById("incoming-temperature-field");
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const kelvinConversionResult = document.getElementById("kelvin-conversion-result");
    const fahrenheitConvsersionResult = document.getElementById("fahrenheit-conversion-result");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        incomingTemperatureField.classList.remove("invalid");

        let incomingTemperature = incomingTemperatureField.value.trim();

        if (incomingTemperature.length === 0) {
            incomingTemperatureField.classList.add("invalid");

            return;
        }

        const celsiusTemperature = Number(incomingTemperatureField.value);        

        setResultNode(kelvinConversionResult, celsiusTemperature + 273.15);
        setResultNode(fahrenheitConvsersionResult, celsiusTemperature * 1.8 + 32)               

        function setResultNode(node, conversionResult) {
            if (node.childElementCount === 1) {
                node.appendChild(document.createElement("label"));
            }

            const lastChild = node.querySelector(":last-child");
            lastChild.textContent = conversionResult;
        }
    });
});