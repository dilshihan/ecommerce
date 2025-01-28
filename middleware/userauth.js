const checksession = (req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/user/register')
    }
}



module.exports = {checksession}