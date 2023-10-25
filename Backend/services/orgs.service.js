const { getOrgs, getOrg, saveOrg, getVolunteerByOrgIdRepo } = require("../repo/org.repo")

const orgs = async (req,res)=> {
    try {
        res.send(await getOrgs())
    } catch (error) {
        console.error(error);
        res.send({
            status: 'Failed',
            message: error,
            data:[]
        })
    }
}

const org = async (req,res)=> {
    try {
        res.send(await getOrg(req.params.id))
    } catch (error) {
        console.error(error);
        res.send({
            status: 'Failed',
            message: error,
            data:[]
        })
    }
}

const saveNewOrg = async (req,res)=> {
    try {
        await saveOrg(req.body);
        res.send({
            status: 'OK',
            message: 'Organization Information has been saved'
        })
    } catch (error) {
        console.error(error);
        res.send({
            status: 'Failed',
            message: error,
            data:[]
        })
    }
}

const getVolunteerByOrgId = async(req, res)=> {
    try {

        const data = await getVolunteerByOrgIdRepo(req.params.id);
        res.send({
            status: 'OK',
            data: data
        })
    } catch(error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: error,
            data:[]
        })
    }
}

module.exports = {
   orgs, org, saveNewOrg, getVolunteerByOrgId
}