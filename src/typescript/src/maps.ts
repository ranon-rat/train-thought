import { Kind } from "./types-enum-constants"
export function string2Map(map: string) {
    return map.split("\n").map(line => line.split("").map(char => {
        switch (char) {
            case "H": return Kind.HOUSE
            case "C": return Kind.CHANGING_RAIL
            case "R": return Kind.RAIL
            case "S": return Kind.SPAWNER
            default: return Kind.EMPTY
        }
    }))
}
export const normal_map=[
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",
    "----------------------",

]
export const first_map_string=[
    "----------------------",
    "---------H------------",
    "---------R------------",
    "-----RRRRCRRRCRRRRS---",
    "-----R-------R--------",
    "-----R--HRR--RRRCRRH--",
    "-----R----R-----R-----",
    "--RRRCRR--RR----RRR---",
    "--R----R---R-HRR--R---",
    "--H----RRRRR---RRRR---",
    "----------------------",
    "----------------------",

].join("\n")
export const second_map_string=[
    "----------------------",
    "-------S--HRRRCRRH----",
    "-------R------R-------",
    "---HRCRCRRRCRRCRRRH---",
    "-----R-----R----------",
    "-----R--H--CRRRCRRH---",
    "-----R--R--R---R------",
    "--HRRCRRR--R---H------",
    "-----------H----------",
    "----------------------",
    "----------------------",
    "----------------------",


].join("\n")

export const third_map_string=[
    "----------------------",
    "-----HRRRCRRRCRRRH----",
    "---------R---R--------",
    "---------R---R--------",
    "------HRRC-HRCRRS-----",
    "---------R------------",
    "------H--RR---H-------",
    "------R---RR--R-------",
    "------RRRR-RRRC-------",
    "---------R----R-------",
    "------HRRCRRRRCRRH----",
    "----------------------",

].join("\n").toUpperCase()

