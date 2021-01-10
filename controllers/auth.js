const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') 

// MySQL Connection
const dB = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'instashare'
})

dB.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("MYSQL Connected!")
    }
})

exports.register = (req,res) => {
    console.log(req.body);

    const { email, username, password, repassword } = req.body;

    dB.query('SELECT username FROM tblLogin WHERE username = ?', [username], async (error, results) => {
        if(error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register', {
                message: 'That username is already in use'
            })
            
        }
        else if( password !== repassword){
            return res.render('register'),{
                message: 'Password do not match!'
            }
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        dB.query('INSERT INTO tblLogin SET ?', {Username: username, Password: hashedPassword, Email: email}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message:'User registered!'
                });
            }
        });
    })
}

exports.login = (req, res) =>{ 

    const{username,password} = req.body;

    if(!username || !password){
        return res.status(400).render('login', {
            message: 'Please provide an username and password!'
        })
    }

    dB.query('SELECT * FROM tblLogin WHERE Username = ?', [username], async (error, results) => {
  
        if(!(await bcrypt.compare(password, results[0].Password))){ 
            res.status(401).render('login', {
                message: 'Username or Password is incorrect!'
            })
        }
        else{ 
            const Id = results[0].Id;
            const token = jwt.sign({Id}, "secretpasstruegram", {
                expiresIn: '90d'
            });


            const cookieOptions = {
                expires: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            } 
            
            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect("/");
        }
    });
 
}