const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken =  (req, res, next) => { 
    const token = req.cookies.jwt // cookiesde ki jwt adında ki token kodunu token değişkenine gönder.
    try {
      if (!token) { // token boş ise..
        return res.status(401).redirect("/login");
      }
      const decrypt = jwt.verify(token, process.env.JWTSECRETKEY); // cookiesde ki token kodu ile oluşturduğumuz secretkeyle kontrol et.
      req.user = { 
        firstname: decrypt.username,
      }; 
    } catch (err) {
      return res.status(500).json(err.toString());
    }
};


// Routers  
router.get('/', (req,res) =>{ 
    
    verifyToken(req,res);
   
    res.render('index')
})

router.get('/login', (req,res) =>{ 
    res.render('login')
})

router.get('/register', (req,res) =>{
    res.render('register')
})

module.exports = router;