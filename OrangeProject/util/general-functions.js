import { POSITION_L1 } from "./constants";

export const bindOrgAndPosition = (orgs, positions)=> {
    if(!orgs || orgs === null) return []
    return Object.fromEntries(orgs.map((org, index) => 
        [org, positions[index] || POSITION_L1]
    ))
};

export const separateOrgAndPost = (orgAndPos) => {
    return [Object.keys(orgAndPos), Object.values(orgAndPos)]
}