import React, { useEffect, useState } from "react";
import axios from "axios";
import keys from "../keys";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faCloudRain } from "@fortawesome/free-solid-svg-icons";

export default function Weather() {
  const api = keys;

  const [weather, setWeather] = useState([]);
  const [weatherToday, setWeatherToday] = useState(null);

  const dateBuild = (d) => {
    let date = String(new window.Date());
    date = date.slice(3, 15);
    return date;
  };

  function DayNameFromDate(dateStr) {
    const date = new Date(dateStr);
    const dayName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayofweek = dayName[date.getDay()];

    return <div>{dayofweek}</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        //get Today
        const { data: responsedata } = await axios.get(
          `${api.BASE_URL}weather?q=${api.COUNTRY}&units=metric&appid=${api.API_KEY}`
        );
        setWeatherToday(responsedata);

        //get 5 day
        const { data: response } = await axios.get(
          //   `${api.base}weather?q=Bangkok&units=metric&appid=${api.key}`
          `${api.BASE_URL}forecast?lat=${api.LAT}&lon=${api.LON}&appid=${api.API_KEY}`
        );

        let res = response.list;
        let today = new Date();
        // const day = res.filter((item, index) => {
        //   let date = new Date(item.dt_txt);
        //   return date.toLocaleDateString() === today.toLocaleDateString();
        // });
        setWeather([]);
        // Next 5 Days
        for (let i = 0; i <= 4; i++) {
          today.setDate(today.getDate() + 1);
          let days = res.filter((item, index) => {
            let date = new Date(item.dt_txt);
            return date.toLocaleDateString() === today.toLocaleDateString();
          });
          if (days[0] != undefined) {
            setWeather((prevList) => [...prevList, days[0]]);
          }
          console.log("New Date", i, days[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log("Weather : ", weather);
  }, [weather]);

  //   const filterDate = filterByDate(day, "2023-07-01");
  //   const filterByDate = (list, dateString) => {
  //     const filterDate = new Date(dateString);

  //     return list.filter((item) => {
  //       const itemDate = new Date(item.day);
  //       return itemDate.getTime() === filterDate.getTime();
  //     });
  //   };

  return (
    weather &&
    weatherToday && (
      <div className="page">
        <div className="card-container">
          <div className={weatherToday.main.temp > 18 ? "App hot" : "App cold"}>
            {weatherToday != undefined ? (
              <div>
                <div className="location-container">
                  <div className="location">
                    {weatherToday.name}, {weatherToday.sys.country}
                  </div>
                  <div className="date"> {dateBuild(new Date())}</div>
                </div>
                <div className="weather-container">
                  <div className="temperature">
                    {Math.round(weatherToday.main.temp)}°C
                  </div>
                  <div className="weather">{weatherToday.weather[0].main}</div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="forecast-header">
            <p className="max-w-lg text-3xl font-semibold text-gray-600/100 dark:text-gray-500/100">
              Daily Forecast
            </p>
          </div>
          <div className="grid gap-4">
            <div>
              <div className="grid grid-cols-5 gap-4">
                {weather != undefined &&
                  weather.map((row, index) => (
                    <div className="col">
                      {row.weather[0].icon === "04d" ? (
                        <FontAwesomeIcon icon={faCloud} size="6x" />
                      ) : row.weather[0].icon === "10d" ? (
                        <FontAwesomeIcon icon={faCloudRain} size="6x" />
                      ) : null}
                      <div
                        className="h-auto max-w-full rounded-lg"
                        style={{ backgroundColor: "red" }}
                      >
                        {row.weather[0].description}
                      </div>
                      {DayNameFromDate(row.dt_txt)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
