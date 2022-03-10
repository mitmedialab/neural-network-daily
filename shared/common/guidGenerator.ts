type guid = string;
class GuidGenerator {
  allCodes: string[];
  freeIDs: guid[];
  constructor(initialGuidCount: number = 1000) {
    this.allCodes = [];
    this.freeIDs = [];
    for (let index = 0; index < initialGuidCount; index++) {
      this.release(this.generateGuid());
    }
  }

  getNext(): guid {
    if (this.freeIDs.length > 0) {
      return this.freeIDs.shift() ?? this.generateGuid();
    }
    return this.generateGuid();
  }

  release(guid: guid) {
    this.freeIDs.push(guid);
  }

  generateGuid(): guid {
    const randomChar = (): string => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    const randomDigit = (): number => Math.floor(Math.random() * 10);
    const generateCode = (): string => `${randomChar()}${randomDigit()}${randomDigit()}${randomChar()}`
    let code = generateCode();
    while (this.allCodes.includes(code)) {
      code = generateCode();
    }
    this.allCodes.push(code);
    return code;
  };
}

export default GuidGenerator;