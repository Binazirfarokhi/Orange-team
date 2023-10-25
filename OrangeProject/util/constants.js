export const TYPE_PARENT = 0;
export const TYPE_VOLUNTEER = 1;
export const TYPE_ORGANIZATION = 2;
export const POSITIONS = [
    {label: 'Admin', value: 'admin'},
    {label: 'Junior', value: 'junior'},
    {label: 'Scout', value: 'scout'},
];

export const getPositionByIndex = (position) => {
    let index = 0;
    return POSITIONS.map(p => ({...p, id: index++})).filter(f=> f.value === position)[0]
} 