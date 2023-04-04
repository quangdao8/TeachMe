export function checkMarker(id, idCheck) {
    let returnId = -1;
    if (id == idCheck) {
        returnId = -1;
    } else {
        returnId = idCheck;
    }
    return returnId;
}
