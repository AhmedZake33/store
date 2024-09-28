import request from '../../utils/request';

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data: data,
    });
}

export function getMSLoginUrl() {
    return request({
        url: '/get-ms-login-url',
        method: 'get',
    });
}

export function msLoginCallback(data) {
    return request({
        url: '/ms-login/callback',
        method: 'post',
        data: data,
    });
}

export function logout(token) {
    return request({
        url: '/users/logout',
        method: 'post',
    });
}

export function Register(data) {
    return request({
        url: '/register',
        method: 'post',
        data: data
    });
}
