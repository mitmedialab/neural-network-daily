var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
import EParticipantRole from "../enums/EParticipantRole";
class BaseConfig {
    constructor() {
        this[_a] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 1,
        };
        this[_b] = undefined;
    }
}
_a = EParticipantRole.OutputLayer, _b = EParticipantRole.Facilitator;
export class Capacity6 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 6;
        this.depth = 3;
        this[_c] = {
            nodeCount: 3,
            outputsPerNode: 2,
            contourOuputWidth: 2,
        };
        this[_d] = {
            nodeCount: 2,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_e] = undefined;
    }
}
_c = EParticipantRole.InputLayer, _d = EParticipantRole.HiddenLayer1, _e = EParticipantRole.HiddenLayer2;
export class Capacity7 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 7;
        this.depth = 3;
        this[_f] = {
            nodeCount: 4,
            outputsPerNode: 2,
            contourOuputWidth: 2,
        };
        this[_g] = {
            nodeCount: 2,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_h] = undefined;
    }
}
_f = EParticipantRole.InputLayer, _g = EParticipantRole.HiddenLayer1, _h = EParticipantRole.HiddenLayer2;
export class Capacity8 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 8;
        this.depth = 4;
        this[_j] = {
            nodeCount: 4,
            outputsPerNode: 2,
            contourOuputWidth: 2,
        };
        this[_k] = {
            nodeCount: 2,
            outputsPerNode: 1,
            contourOuputWidth: 3,
        };
        this[_l] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 4,
        };
    }
}
_j = EParticipantRole.InputLayer, _k = EParticipantRole.HiddenLayer1, _l = EParticipantRole.HiddenLayer2;
export class Capacity9 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 9;
        this.depth = 4;
        this[_m] = {
            nodeCount: 4,
            outputsPerNode: 3,
            contourOuputWidth: 3,
        };
        this[_o] = {
            nodeCount: 3,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_p] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 4,
        };
    }
}
_m = EParticipantRole.InputLayer, _o = EParticipantRole.HiddenLayer1, _p = EParticipantRole.HiddenLayer2;
export class Capacity10 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 10;
        this.depth = 4;
        this[_q] = {
            nodeCount: 4,
            outputsPerNode: 4,
            contourOuputWidth: 4,
        };
        this[_r] = {
            nodeCount: 4,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_s] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 4,
        };
    }
}
_q = EParticipantRole.InputLayer, _r = EParticipantRole.HiddenLayer1, _s = EParticipantRole.HiddenLayer2;
export class Capacity11 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 11;
        this.depth = 4;
        this[_t] = {
            nodeCount: 5,
            outputsPerNode: 4,
            contourOuputWidth: 4,
        };
        this[_u] = {
            nodeCount: 4,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_v] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 4,
        };
    }
}
_t = EParticipantRole.InputLayer, _u = EParticipantRole.HiddenLayer1, _v = EParticipantRole.HiddenLayer2;
export class Capacity12 extends BaseConfig {
    constructor() {
        super(...arguments);
        this.capacity = 12;
        this.depth = 4;
        this[_w] = {
            nodeCount: 6,
            outputsPerNode: 4,
            contourOuputWidth: 4,
        };
        this[_x] = {
            nodeCount: 4,
            outputsPerNode: 1,
            contourOuputWidth: 2,
        };
        this[_y] = {
            nodeCount: 1,
            outputsPerNode: 1,
            contourOuputWidth: 4,
        };
    }
}
_w = EParticipantRole.InputLayer, _x = EParticipantRole.HiddenLayer1, _y = EParticipantRole.HiddenLayer2;
//# sourceMappingURL=graphConfigs.js.map