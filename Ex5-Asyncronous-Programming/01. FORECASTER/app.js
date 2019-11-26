function attachEvents() {
    function createHTMLElement(tag, classes, content) {
        let element = document.createElement(tag);
        element.setAttribute('class', classes);
        element.textContent = content;

        return element;
    }

    let sym = {
        sunny: '☀',
        partlysunny: '⛅',
        overcast: '☁',
        rain: '☂',
        degrees: '°',
    };

    let locationInput = document.getElementById('location');
    let submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', function () {
        fetch('https://judgetests.firebaseio.com/locations.json')
            .then(loc => loc.json())
            .then(loc => {
                let forecastDiv = document.getElementById('forecast');
                forecastDiv.style.display = 'block';

                let location = '';
                let cityCode = '';
                let foundCity = false;
                for (let i = 0; i < loc.length; i++) {
                    let {name, code} = loc[i];
                    if (name === locationInput.value) {
                        location = name;
                        cityCode = code;
                        foundCity = true;
                    }
                }

                if (!foundCity) {
                    forecastDiv.textContent = 'Error';
                    return;
                }

                fetch(`https://judgetests.firebaseio.com/forecast/today/${cityCode}.json`)
                    .then(resp => resp.json())
                    .then(today => {
                        let forecastExists = document.getElementsByClassName('forecasts')[0];
                        if (forecastExists) {
                            forecastExists.remove();
                        }
                        let {forecast, name} = today;
                        let {condition, high, low} = forecast;

                        let todayDiv = document.getElementById('current');

                        let forecastsWrapper = createHTMLElement('div', 'forecasts');

                        let conditionLowerCase = condition.toLowerCase().split(' ').join(' ');
                        let conditionSymbolSpan = createHTMLElement('span', 'condition symbol', sym[conditionLowerCase]);
                        let conditionSpanWrapper = createHTMLElement('span', 'condition');

                        let nameSpan = createHTMLElement('span', 'forecast-data', name);
                        let degreesStr = `${low}${sym.degrees}/${high}${sym.degrees}`;
                        let degreesSpan = createHTMLElement('span', 'forecast-data', degreesStr);
                        let conditionSpan = createHTMLElement('span', 'forecast-data', condition);

                        conditionSpanWrapper.append(nameSpan, degreesSpan, conditionSpan);
                        forecastsWrapper.append(conditionSymbolSpan, conditionSpanWrapper);
                        todayDiv.append(forecastsWrapper);

                    })
                    .catch(e => {
                        throw new Error('Oops something went wrong...');
                    });


                fetch(`https://judgetests.firebaseio.com/forecast/upcoming/${cityCode}.json`)
                    .then(resp => resp.json())
                    .then(upcoming => {
                        let forecastExists = document.getElementsByClassName('forecasts-info')[0];
                        if (forecastExists) {
                            forecastExists.remove();
                        }

                        let {forecast, name} = upcoming;

                        let upcomingDiv = document.getElementById('upcoming');

                        let forecastsWrapper = createHTMLElement('div', 'forecasts-info');

                        Object.values(forecast).forEach(day => {
                            let {condition, high, low} = day;
                            let upcomingWrapper = createHTMLElement('span', 'upcoming');

                            let conditionLowerCase = condition.split(' ').join('').toLowerCase();
                            let symbolSpan = createHTMLElement('span', 'symbol', sym[conditionLowerCase]);
                            let degreesStr = `${low}${sym.degrees}/${high}${sym.degrees}`;
                            let degreesSpan = createHTMLElement('span', 'forecast-data', degreesStr);
                            let conditionSpan = createHTMLElement('span', 'forecast-data', condition);

                            upcomingWrapper.append(symbolSpan, degreesSpan, conditionSpan);

                            forecastsWrapper.append(upcomingWrapper);
                        });

                        upcomingDiv.append(forecastsWrapper);
                    })
                    .catch(e => {
                        throw new Error('Oops something went wrong...');
                    });

            })
            .catch(e => {
                throw new Error('Oops something went wrong...');
            });
    })
}

attachEvents();