// src/config.js
export const API_URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_PROD_API_URL
  : process.env.REACT_APP_API_URL;

export const FRONTEND_URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_PROD_FRONTEND_URL
  : process.env.REACT_APP_FRONTEND_URL;
