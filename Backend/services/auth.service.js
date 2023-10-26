const { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, createUserWithEmailAndPassword  } = require("firebase/auth")
const { auth } = require("../repo/firebase")
const { getProfileByEmail, saveProfile } = require("../repo/profile.repo")

const login = async (req,res)=> {
    const { username, password } = req.body
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password)
        // await sendEmailVerification(auth.currentUser)
        if(userCredential.user.emailVerified) {
            res.send({
                status: 'OK',
                message: 'Authorized',
                token: userCredential._tokenResponse,
                userData: await getProfileByEmail(username) 
            })
        } else {
            res.send({
                status: 'Failed',
                message: "Email is not verified yet"
            })
        }
    } catch (error) {
        console.error(error);
        
        res.send({
            status: 'Failed',
            message: 'Access denied',
            token: ''
        })
    }
}

const passwordReset = async (req, res) => {
    const email = req.body.email;
    try {
        await sendPasswordResetEmail(auth, email)
        res.send({status: "OK"})
    } catch (error) {
        res.send({
            status: 'Failed',
            message: error.message
        })
    }
        

}
const signup = async (req, res) => {
    const {username, password, role} = req.body;
    try {
        if(validateEmail(username)){
            // const data = await getProfileByEmail(username);
            const user = await createUserWithEmailAndPassword(auth, username, password);
            await sendEmailVerification(user.user)
            await saveProfile(username, '', role)
            res.send({status:'OK'})
        } else {
            res.send({status: "Failed", message: `Email address's format is invalid.`})
        }
    } catch (error) {
        // res.send({
        //     status: 'Failed',
        //     message: error.message
        // })
        console.error(error)
        res.send({status: "Failed", message: `Account with ${username} is already exists.`})

    }
        

}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  

const refreshToken = async (req,res) => {}

module.exports = {
    login,
    refreshToken,
    passwordReset,
    signup
}