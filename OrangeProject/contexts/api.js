import axios from "axios";
import { config } from "../config";

const api = () => {};

const get = async (url) => {
  return await axios.get(`${config.url}${url}`);
};
const deleteCall = async (url) => {
  return await axios.delete(`${config.url}${url}`);
};
const post = async (url, body) => {
  console.log(`${config.url}${url}`);
  return await axios.post(`${config.url}${url}`, body);
};
const put = async (url, body) => {
  return await axios.put(`${config.url}${url}`, body);
};
const patch = async (url, body) => {
  return await axios.patch(`${config.url}${url}`, body);
};
const getLocation = async (url, queryParams) => {
  return await axios.get(`${config.url}${url}`, {
    params: queryParams,
  });
};

export { get, post, put, deleteCall, patch, getLocation };
