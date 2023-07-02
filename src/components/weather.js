import React, { useEffect, useState } from "react";
import axios from "axios";
import keys from "../keys";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";


export default function Weather() {
  const api = keys;

  const [weather, setWeather] = useState([]);
  const [weatherToday, setWeatherToday] = useState(null);

  const dateBuild = (d) => {
    let date = String(new window.Date());
    date = dayjs().format('ddd, MMM D, YYYY h:mm A ');
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
          `${api.BASE_URL}forecast?lat=${api.LAT}&lon=${api.LON}&appid=${api.API_KEY}`
        );

        let res = response.list;
        let today = new Date();
      
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

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  useEffect(() => {
    // console.log("Weather : ", weather);
  }, [weather]);


  return (
    weather &&
    weatherToday && (
      <div className="page">
        <div className="card-container">
          <div className="App">
            {weatherToday != undefined ? (
              <div>
                <div className="location-container">
                  <div className="location">
                    {weatherToday.name}, {weatherToday.sys.country === "TH" ? (
                     "Thailand"
                    ): null}
                  </div>
                  <div className="date"> {dateBuild(new Date())}</div>
                </div>
                <div className="weather-container">
                  <div className="set-icon">
                  {weatherToday.weather[0].icon === "04d" ? (
                    <FontAwesomeIcon icon={faCloud} size="6x" style={{color:"gray" }} />
                  ) : weatherToday.weather[0].icon === "10d" ? (
                    <FontAwesomeIcon icon={faCloudRain} size="6x" style={{color:"gray"}} />
                  ) : null}
                  </div>
                  <div className="temperature">
                  <p class="max-w-lg text-7xl  font-black leading-normal text-zinc-50">
                    {Math.round(weatherToday.main.temp)}° 
                    </p>
                    
                  </div>
                  <div className="weather">{weatherToday.weather[0].main}</div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="forecast-header">
            <p className="max-w-lg text-3xl font-semibold text-black-600/100 dark:text-black-500/100">
              Daily Forecast
            </p>
          </div>

          <div className="grid grid-cols-5 space-x-6 ">
            {weather != undefined &&
              weather.map((row, index) => (
                <div className="bg-white p-1 shadow-md flex flex-col justify-center items-center rounded-lg">
                 <div style={{paddingTop:'15px'}}>
                  {row.weather[0].icon === "04d" ? (
                    <FontAwesomeIcon icon={faCloud} size="6x" style={{color:"gray"}} />
                  ) : row.weather[0].icon === "10d" ? (
                    <FontAwesomeIcon icon={faCloudRain} size="6x" style={{color:"gray"}} />
                  ) : null}
                  </div>
                  <div style={{paddingTop:'15px'}}>
                  <p className="max-w-md text-lg font-semibold text-gray-600/100 dark:text-gray-500/100">
                    {row.weather[0].description}
                    </p>
                  </div>
                  <p className="max-w-md text-lg font-semibold text-gray-600/100 dark:text-gray-500/100">
                  {DayNameFromDate(row.dt_txt)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  );
}
