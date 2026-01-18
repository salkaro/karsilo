export const levelOneAccess = ["viewer", "member", "admin", "owner"];
export const levelTwoAccess = ["member", "admin", "owner"];
export const levelThreeAccess = ["admin", "owner"];

export type OrgRoleType = typeof levelOneAccess[number];
export type OrgRoleColorType = keyof typeof levelsToColors;

export const levelsToIndex = {
    "viewer": "0",
    "member": "1",
    "admin": "2",
    "owner": "3"
};

export const levelsToColors = {
    "viewer": "#63B3ED",
    "member": "#404EC0",
    "admin": "#02bb1b",
    "owner": "#404EC0",
};

export const apiTokenAccessLevels = {
    0: "00", // Admin
};

export const apiTokenAccessLevelsName = {
    0: "Admin",
};
