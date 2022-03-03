import type EParticipantRole from "$lib/enums/EParticipantRole";
import type IEquatable from "$lib/common/IEquatable";
import type ISimpleNode from "$lib/graph/types/ISimpleNode";
import { equals as nodesAreEqual } from "$lib/graph/types/ISimpleNode";

export type ParticipantInfo = {
  id: string;
  name: string;
  room: string;
  faciliatorID: string;
}

export type TParticpantNode
  <TInputInfo extends IEquatable<TInputInfo>,
  TDataIn extends TInputInfo,
  TOutputInfo extends IEquatable<TOutputInfo>,
  TDataOut extends TOutputInfo> = ParticipantInfo & ISimpleNode & {
    acceptableInputs: TInputInfo[],
    connectedOutputs: TOutputInfo[],
    acceptsInput: (info: TInputInfo) => boolean;
    feedInput: (inputs: TDataIn[]) => void;
    getOutput: () => TDataOut[];
  }

abstract class AbstractParticipantNode
  <TInputInfo extends IEquatable<TInputInfo>,
  TDataIn extends TInputInfo,
  TOutputInfo extends IEquatable<TOutputInfo>,
  TDataOut extends TOutputInfo>
  implements TParticpantNode<TInputInfo, TDataIn, TOutputInfo, TDataOut>
{
  /* Begin Inherited Members */
  id: string;
  name: string;
  room: string;
  faciliatorID: string;
  indexWithinLayer: number;
  layer: EParticipantRole;
  connectedInputs: TInputInfo[];
  connectedOutputs: TOutputInfo[];
  feedInput = (input: TDataIn[]) => this.currentInputs = input;
  getOutput = () => this.currentOuputs;
  equals: (other: ISimpleNode) => boolean = (other: ISimpleNode) => nodesAreEqual(this, other);
  acceptsInput: (info: TInputInfo) => boolean = function (info: TInputInfo) {
    this.connectedInputs.forEach(element => {
      if (element.equals(info)) {
        return true;
      }
    });
    return false;
  }
  /* End Inherited Members */

  constructor(connectedInputs: TInputInfo[], connectedOutputs: TOutputInfo[]) {
    this.connectedInputs = connectedInputs;
    this.connectedOutputs = connectedOutputs;
  }

  currentInputs: TDataIn[];
  currentOuputs: TDataOut[];
}

export default AbstractParticipantNode;
