
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
]
export const first_map_string=[
    "----------------------",
    "---------H------------",
    "---------R------------",
    "--HRRCRRRCRRRCRRRRS---",
    "-----R-------R--------",
    "--HRRC---HRRRC-H------",
    "-----R-------R-R------",
    "-----H---HRRRCRCRRH---",
    "----------------------",
    "----------------------",
].join("\n")
export const second_map_string=[
    "----------------------",
    "-------H--------------",
    "-------R--------------",
    "---HRRRCRRRCRRRRRRS---",
    "-----------R----------",
    "-----------CRRRCRRH---",
    "-----------R---R------",
    "-----------R---H------",
    "-----------H----------",
    "----------------------",
].join("\n")

export const third_map_string=[
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
].join("\n")
