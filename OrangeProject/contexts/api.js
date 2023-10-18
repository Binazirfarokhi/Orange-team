import axios from "axios";

const config = {
    // change your localhost address
    url: 'http://192.168.1.74:3000'
}

const api = ()=> {

}

const get = (url) => {
    
}
const post = async (url, body) => {
    return await axios.post(`${config.url}${url}`, body);
}

const getToken = () => authToken;
const setToken = (token) => authToken = token 

export {
    get,
    post,
    getToken,
    setToken
}