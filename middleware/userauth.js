const checksession = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/user/register');
    }
};

const isLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/user/home');
    } else {
        next();
    }
};



module.exports = {checksession,isLogin}