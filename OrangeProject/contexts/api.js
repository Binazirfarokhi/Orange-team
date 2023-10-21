import axios from "axios";

// Chage your local IP address (computer IP address)
const config = {
  url: "http://192.168.1.74:3000",
};

const api = () => {};

const get = async (url) => {
  return await axios.get(`${config.url}${url}`);
};
const deleteCall = async (url) => {
  return await axios.delete(`${config.url}${url}`);
};
const post = async (url, body) => {
  return await axios.post(`${config.url}${url}`, body);
};
const put = async (url, body) => {
  return await axios.put(`${config.url}${url}`, body);
};

export { get, post, put, deleteCall };
