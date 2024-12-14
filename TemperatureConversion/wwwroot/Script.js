document.addEventListener("DOMContentLoaded", function () {
    const incomingTemperatureField = document.getElementById("incoming-temperature-field");
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const temperatureConversionResult = document.getElementById("temperature-conversion-result");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        incomingTemperatureField.classList.remove("invalid");

        let incomingTemperature = incomingTemperatureField.value.trim();

        if (incomingTemperature.length === 0) {
            incomingTemperatureField.classList.add("invalid");
        }

        const result = document.createElement("label");
        result.textContent = 100;
        

        temperatureConversionResult.appendChild(result);

        incomingTemperatureField.value = "";
    });
});