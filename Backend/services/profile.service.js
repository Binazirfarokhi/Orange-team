const { getProfiles, getProfileByEmail, updateUsername, updateUserData } = require("../repo/profile.repo")

const createUser = async(req,res)=> {
    res.send('created')
}
const updateUser = async (req,res)=> {
    const emailAddress = req.params.email;
    const displayName = req.body.displayName;
    try{
        await updateUsername(displayName, emailAddress)
        res.send({
            status: 'OK',})        
    } catch (error){
        console.error(error)
        res.send({
            status: 'Failed',
            message: error.message
        })
    }
}
const updatePersonalInfo = async (req,res)=> {
    const emailAddress = req.params.email;
    const {contactNumber, address, allowAddress} = req.body;
    try{
        await updateUserData(emailAddress, {contactNumber, address, allowAddress})
        res.send({
            status: 'OK',})        
    } catch (error){
        console.error(error)
        res.send({
            status: 'Failed',
            message: error.message
        })
    }
}

const deleteUser = async(req,res)=> {
    res.send(`deleted ${req.params.id}`)
}
const listUser = async(req,res)=> {
    const doc = await getProfiles();
    res.send(doc)
}
const user = async(req,res)=> {
    try { 
        const { email } = req.params;
        const doc = await getProfileByEmail(email);
        res.send(doc);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    listUser,
    updatePersonalInfo,
    user
}