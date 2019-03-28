var assert = require("chai").assert;
var expect = require("chai").expect;
var OpenWeatherMapService = require("../../../build/services/openWeatherMapService").OpenWeatherMapService;
var config = require("../../../build/config");

describe("OpenWeatherMapService", function() {
    describe("getCurrentWeatherByLocation", function() {
        it("should return the correct array", function() {
            return new OpenWeatherMapService(config.credentialsConfig.openWeather)
                        .getCurrentWeatherByLocation(37.227029, -80.421044)
            .then(res => {
                expect(res.date).to.be.a("number");
                expect(res.humidity).to.be.a("number");
                expect(res.tempCurr).to.be.a("number");
                expect(res.tempMin).to.be.a("number");
                expect(res.tempMax).to.be.a("number");
                expect(res.main).to.be.a("string");
                expect(res.desc).to.be.a("string");
                expect(res.icon).to.be.a("string");
                expect(res.rain3h).to.be.a("number");
                expect(res.snow3h).to.be.a("number");
                expect(res.windSpeed).to.be.a("number");
                expect(res.windDir).to.be.a("string");
                expect(res.forecast).to.be.a("array");
                expect(res).be.an("object");
            });
        });
    });
    describe("GetForecastWeatherData", function() {
        it("should return the correct array", function() {
            return new OpenWeatherMapService(config.credentialsConfig.openWeather)
                        .GetForecastWeatherData(37.227029, -80.421044)
            .then(res => {
                expect(res[0].date).to.be.a("number");
                expect(res[0].humidity).to.be.a("number");
                expect(res[0].tempCurr).to.be.a("number");
                expect(res[0].tempMin).to.be.a("number");
                expect(res[0].tempMax).to.be.a("number");
                expect(res[0].main).to.be.a("string");
                expect(res[0].desc).to.be.a("string");
                expect(res[0].icon).to.be.a("string");
                expect(res[0].rain3h).to.be.a("number");
                expect(res[0].snow3h).to.be.a("number");
                expect(res[0].windSpeed).to.be.a("number");
                expect(res[0].windDir).to.be.a("string");
                expect(res[0].forecast).to.be.a("undefined");
                expect(res).be.an("array");
            });
        });
    });
    describe("BuildWeatherData", function() {
        it("should return the correct array", function() {
            assert.deepEqual(new OpenWeatherMapService().BuildWeatherData({
                "base": "stations",
                "clouds": { "all": 90 },
                "cod": 200,
                "coord": { "lon": -0.13, "lat": 51.51 },
                "dt": 1485789600,
                "id": 2643743,
                "main": { "temp": 280.32, "pressure": 1012, "humidity": 81, "temp_min": 279.15, "temp_max": 281.15},
                "name": "London",
                "sys": {
                    "country": "GB",
                    "id": 5091,
                    "message": 0.0103,
                    "sunrise": 1485762037,
                    "sunset": 1485794875,
                    "type": 1,
                },
                "visibility": 10000,
                "weather": [{
                    "description": "light intensity drizzle",
                    "icon": "09d",
                    "id": 300,
                    "main": "Drizzle",
                }],
                "wind": { "speed": 4.1, "deg": 80 },
            }),
            { date: 1485789600000,
                desc: "light intensity drizzle",
                forecast: undefined,
                humidity: 81,
                icon: "09d",
                main: "Drizzle",
                rain3h: 0,
                snow3h: 0,
                tempCurr: 45,
                tempMax: 46,
                tempMin: 43,
                windDir: "E",
                windSpeed: 9,
            });
        });
    });
    describe("ConvertKelvinToFahrenheit", function() {
        it("a positive input should return a positive conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertKelvinToFahrenheit(350), 170);
        });
        it("a positive input should return a negative conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertKelvinToFahrenheit(250), -10);
        });
        it("a negative input should return a negative conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertKelvinToFahrenheit(-10), -478);
        });
        it("a 0 input should return the correct value", function() {
            assert.equal(new OpenWeatherMapService().ConvertKelvinToFahrenheit(0), -460);
        });
    });
    describe("ConvertDregeeToCompass", function() {
        it("a 0 input should return the correct direction", function() {
            assert.equal(new OpenWeatherMapService().ConvertDegreeToCompass(0), "N");
        });
        it("a 180 input should return the correct direction", function() {
            assert.equal(new OpenWeatherMapService().ConvertDegreeToCompass(180), "S");
        });
        it("a positive value > 360 should return the correct direction", function() {
            assert.equal(new OpenWeatherMapService().ConvertDegreeToCompass(1239), "SSE");
        });
        it("a negative input should return an error", function() {
            assert.equal(new OpenWeatherMapService().ConvertDegreeToCompass(-1), "Error: Degree must be positive.");
        });
    });
    describe("ConvertMeterPerSecondToMPH", function() {
        it("a 0 input should return a positive conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertMeterPerSecondToMPH(0), 0);
        });
        it("a positive input should return a negative conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertMeterPerSecondToMPH(250), 559);
        });
        it("a negative input should return a negative conversion value", function() {
            assert.equal(new OpenWeatherMapService().ConvertMeterPerSecondToMPH(-10), -22);
        });
    });
});
