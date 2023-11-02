const { getDoc } = require("firebase/firestore")
const { getChildList, saveChild, updateChild, deleteChild, getChild } = require("../repo/children.repo")
const { getUserRefByEmail, getProfileById } = require("../repo/profile.repo")

const childrenList = async(req,res) =>{
    const parentEmail = req.params.email
    try {
        const data = await getChildList(await getUserRefByEmail(parentEmail))
        res.send({status: 'OK', data: data.docs.map(doc=> ({...doc.data(), parent:'', id: doc.id}))})
    } catch(error) {
        console.error(error)
        res.send({status: 'FAILED', error})
    }
} 

const child = async(req,res) =>{
    const id = req.params.id
    try {
        const data = await getChild(id)
        res.send({status: 'OK', data: {
          ...data.data(),
          id: data.id,
          parent: await getProfileById(data.data().parent.id) 
        }});
    } catch(error) {
        console.error(error)
        res.send({status: 'FAILED', error})
    }
} 
const saveChildren = async(req,res) =>{
    const parentEmail = req.params.email
    try {
        await saveChild(await getUserRefByEmail(parentEmail), req.body)
        res.send({status: 'OK'})
    } catch(error) {
        console.error(error)
        res.send({status: 'FAILED', error})
    }
} 
const updateChildren = async(req,res) =>{
    const childId = req.params.id
    try {
        await updateChild(childId, req.body)
        res.send({status: 'OK'})
    } catch(error) {
        console.error(error)
        res.send({status: 'FAILED', error})
    }
} 
const deleteChildren = async(req,res) =>{
    const childId = req.params.id
    try {
        await deleteChild(childId)
        res.send({status: 'OK'})
    } catch(error) {
        console.error(error)
        res.send({status: 'FAILED', error})
    }
} 

module.exports = {
    childrenList,
    saveChildren,
    updateChildren,
    deleteChildren,
    child
}