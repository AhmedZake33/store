import { getToken, isLogged, removeToken, deleteToken, removeAuth, setLogged, notHasPermissions } from '../utils/auth';
import router from '../router/index';
import store from '@/store/index';
import Swal from 'sweetalert2'

const axios = require('axios');
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 150000000, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
    config => {
        const token = isLogged();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + getToken();
            config.headers['Content-Type'] = 'application/json';
            config.headers['Accept'] = 'application/json';
        }
        if (config.ems_url) {
            config.baseURL = process.env.VUE_APP_BASE_URL + '/ems'; //process.env.VUE_APP_BASE_URL.replace('api','ems');
        }

        return config;
    },
    error => {
        // Do something with request error
        let message = error.message;
        if (error.response.data && error.response.data.errors) {
            message = error.response.data.errors;
        } else if (error.response.data && error.response.data.error) {
            message = error.response.data.error;
        }
        if (error.response.status !== 401 && error.response.status !== 404) { }
        Promise.reject(error);
    }
);

// response pre-processing
service.interceptors.response.use(
    response => {
        if (response != undefined && response.data != undefined && response.data.data != undefined &&
            response.data.data.redirect_to != undefined && response.data.data.redirect_to === "dashboard") {
            let message = 'You have to fill the survery first.';
            Swal.fire({
                icon: 'error',
                text: message,
                customClass: { confirmButton: 'btn btn-danger' },
            });

            return router.replace({ name: 'dashboard' });
        }
        // if (response.headers.authorization) {
        //   setLogged(response.headers.authorization);
        //   response.data.token = response.headers.authorization;
        // }
        return response.data;
    },
    error => {
        if (!error.response) {
            //router.push({ name: 'misc-error-connections' });
        }
        let message = error.message;
        if (error.response.data && error.response.data.errors) {
            message = error.response.data.errors;
        } else if (error.response.data && error.response.data.error) {
            message = error.response.data.error;
        }


        if (error.response.status !== 401 && ((error.response.status !== 404 && message) || (error.response.status !== 404 && message.name))) {
            // if (message.name) {
            // } else {
            //
            // }
            let text = '';
        }
        if ((error.response.status === 404 && !message) || (error.response.status === 404 && !message.name)) {
            router.push({ name: 'error-404' });
        }
        // if ((error.response.status === 500 && !message) || (error.response.status === 500 && !message.name)) {
        //     router.push({ name: 'misc-error' });
        // }
        if (error.response.status === 401) {
            if (isLogged()) {
                // setLogged('0');
                router.push({ name: 'misc-not-authorized' });
                // store.dispatch('users/logout').then(_ => {
                //     router.push({ name: 'auth-login' });
                // });
            } else {
                // router.push({ name: 'auth-login' });
            }
        }
        return Promise.reject(error);
    }
);

export default service;
