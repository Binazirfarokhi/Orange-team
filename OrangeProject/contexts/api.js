import axios from "axios";

const config = {
    url: 'http://10.0.0.14:3000'
}

const api = ()=> {

}

const get = async(url) => {
    return await axios.get(`${config.url}${url}`);
}
const deleteCall = async(url) => {
    return await axios.delete(`${config.url}${url}`);
}
const post = async (url, body) => {
    return await axios.post(`${config.url}${url}`, body);
}
const put = async (url, body) => {
    return await axios.put(`${config.url}${url}`, body);
}


export {
    get,
    post,
    put,
    deleteCall
}