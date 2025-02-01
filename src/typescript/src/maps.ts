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
// use this as a base
export const normal_map = [
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
export const cool_map_for_menu = string2Map([
    "----------------------",
    "-RRRRRR-RRRRRRRRRRRRS-",
    "-R----R-R-------------",
    "-RRRR-R-RRRRRRRR-RRR--",
    "----R-R--------R-R-R--",
    "-RRRR-R--------R-R-R--",
    "-R----R--------R-R-R--",
    "-RRRR-R--------R-R-R--",
    "----R-R--------RRR-R--",
    "-HRRR-RRRRRRRR-----R--",
    "-------------RRRRRRR--",
    "----------------------",
].join("\n"))
export const first_map = string2Map([
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

].join("\n").toUpperCase())
export const second_map = string2Map([
    "----------------------",
    "-SRRRRRR--HRRRCRRH----",
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
].join("\n").toUpperCase())

export const third_map = string2Map([
    "----------------------",
    "-----HRRRCRRRCRRRH----",
    "---------R---R--------",
    "---------R---R--------",
    "-HRRCRRRRC-HRCRRCRRS--",
    "----R----R------R-----",
    "----R-H--RR---H-R-----",
    "-HRRC-R---RR--R-RRRH--",
    "----R-RRRR-RRRC-------",
    "-HRRR----R----R-------",
    "------HRRCRRRRCRRH----",
    "----------------------",

].join("\n").toUpperCase())

