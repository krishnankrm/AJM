var { expressjwt: jwt } = require("express-jwt");
const config = {
    "secret": "AJM_Mixer_JWT"
}


module.exports = jwtFN;

function jwtFN() {
    const { secret } = config;
    return jwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/login'
        ]
    });
}
