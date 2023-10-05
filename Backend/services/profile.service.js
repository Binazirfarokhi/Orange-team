const { getProfiles } = require("../repo/profile.repo")

const createUser = async(req,res)=> {
    res.send('created')
}
const updateUser = async(req,res)=> {
    res.send('updated')
}
const deleteUser = async(req,res)=> {
    res.send(`deleted ${req.params.id}`)
}
const listUser = async(req,res)=> {
    const doc = await getProfiles();
    res.send(doc)
}
const user = async(req,res)=> {
    res.send('user')
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    listUser,
    user
}