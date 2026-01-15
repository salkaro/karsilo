export const levelOneAccess = ["viewer", "admin"];
export const levelTwoAccess = ["owner"];

export type OrgRoleType = typeof levelOneAccess[number]; 
export type OrgRoleColorType = keyof typeof levelsToColors

export const levelsToIndex = {
    "viewer": "0",
    "admin": "1",
}

export const levelsToColors = {
    "viewer": "#63B3ED",     
    "admin": "#02bb1b",    
}

export const apiTokenAccessLevels = {
    0: "00", // Admin
}

export const apiTokenAccessLevelsName = {
    0: "Admin",
}