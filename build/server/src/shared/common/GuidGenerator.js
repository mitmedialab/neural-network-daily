class GuidGenerator {
    constructor(initialGuidCount = 1000) {
        this.allCodes = [];
        this.freeIDs = [];
        for (let index = 0; index < initialGuidCount; index++) {
            this.release(this.generateGuid());
        }
    }
    getNext() {
        if (this.freeIDs.length > 0) {
            return this.freeIDs.shift() ?? this.generateGuid();
        }
        return this.generateGuid();
    }
    release(guid) {
        this.freeIDs.push(guid);
    }
    generateGuid() {
        const randomChar = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        const randomDigit = () => Math.floor(Math.random() * 10);
        const generateCode = () => `${randomChar()}${randomDigit()}${randomDigit()}${randomChar()}`;
        let code = generateCode();
        while (this.allCodes.includes(code)) {
            code = generateCode();
        }
        this.allCodes.push(code);
        return code;
    }
    ;
}
export default GuidGenerator;
//# sourceMappingURL=GuidGenerator.js.map