const allCodes = [];
const freeIDs = [];
export function init(initialGuidCount = 500) {
    for (let index = 0; index < initialGuidCount; index++) {
        release(generateGuid());
    }
}
export function getNext() {
    if (freeIDs.length > 0) {
        const freeID = freeIDs.pop();
        return freeID ? freeID : generateGuid();
    }
    return generateGuid();
}
export function release(guid) {
    freeIDs.push(guid);
}
function generateGuid() {
    const randomChar = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    const randomDigit = () => Math.floor(Math.random() * 10);
    const generateCode = () => `${randomChar()}${randomDigit()}${randomDigit()}${randomChar()}`;
    let code = generateCode();
    while (allCodes.includes(code)) {
        code = generateCode();
    }
    allCodes.push(code);
    return code;
}
;
