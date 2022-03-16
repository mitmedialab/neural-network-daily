class C2CNode {
    constructor(participantInfo, layerInfo, inputSize, outputSize, connectedInputs) {
        this.room = participantInfo.room;
        this.name = participantInfo.name;
        this.layer = layerInfo.layer;
        this.indexWithinLayer = layerInfo.indexWithinLayer;
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.input = new Array(inputSize);
        this.output = new Array(outputSize);
        this.connectedInputInfo = connectedInputs;
    }
    static nodesEqual(a, b) {
        return a.layer === b.layer && a.indexWithinLayer === b.indexWithinLayer;
    }
    ;
    trySetInput(packet) {
        if (!this.connectedInputInfo)
            return false;
        for (const [index, info] of this.connectedInputInfo.entries()) {
            if (C2CNode.nodesEqual(info, packet.info)) {
                this.input[index] = packet.data[info.indexWithinDataPacket];
                return true;
            }
        }
        return false;
    }
    getOuput() {
        if (this.output.includes(undefined)) {
            throw new Error("Output contains undefined!");
        }
        ;
        return { info: { layer: this.layer, indexWithinLayer: this.layer }, data: this.output };
    }
    setOutput(index, entry) {
        this.output[index] = entry;
    }
    clear() {
        this.input?.fill(undefined);
        this.output?.fill(undefined);
    }
    ready() {
        return this.input.every(entry => entry !== undefined);
    }
}
export default C2CNode;
//# sourceMappingURL=C2CNode.js.map