const getResponseHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*'
    }
}

const getUserId = (headers) => {
    return headers.app_user_id;
}

const getUserName = (headers) => {
    return headers.app_user_name;
}

const getIdToken = (headers) => {
    return headers.Authorization;
}

module.exports = {
    getResponseHeaders,
    getUserId,
    getUserName,
    getIdToken,
};