import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_KEY } from '@env';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.weatherapi.com/v1' }),
  endpoints: (builder) => ({
    getWeather: builder.query<any, string>({
      query: (location) => ({
        url: 'current.json',
        params: {
          key: API_KEY,
          q: location,
        },
      }),
    }),

    getForecast: builder.query<any, string>({
      query: (location) => ({
        url: 'forecast.json',
        params: {
          key: API_KEY,
          q: location,
          days: 4,
        },
      }),
    }),
  }), 
});

export const { useGetWeatherQuery, useGetForecastQuery } = weatherApi; 
