type guid = string;

const allCodes: string[] = [];
const freeIDs: guid[] = [];

/**
 * 
 * @param initialGuidCount 
 */
export function init(initialGuidCount: number = 500) {
  for (let index = 0; index < initialGuidCount; index++) {
    release(generateGuid());
  }
}

/**
 * 
 */
export function getNext(): guid {
  if (freeIDs.length > 0) {
    const freeID = freeIDs.pop();
    return freeID ? freeID : generateGuid();
  }

  return generateGuid();
}

/**
 * 
 * @param guid 
 */
export function release(guid: guid) {
  freeIDs.push(guid);
}

function generateGuid(): guid {
  const randomChar = (): string => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const randomDigit = (): number => Math.floor(Math.random() * 10);
  const generateCode = (): string => `${randomChar()}${randomDigit()}${randomDigit()}${randomChar()}`
  let code = generateCode();
  while (allCodes.includes(code)) {
    code = generateCode();
  }
  allCodes.push(code);
  return code;
};