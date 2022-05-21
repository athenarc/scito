import axios from "axios";
import config from './local-config.json';

export const api = axios.create({
        baseURL: config.api_url
    }
)