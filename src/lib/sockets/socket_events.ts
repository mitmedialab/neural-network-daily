import type ParticipantRole from '$lib/enums/ParticipantRole';
import type ImageClassification from '$lib/enums/ImageClassification';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

// Client to Server Events
interface ClientToServerEventsBase {
}

export interface FacilitatorToServerEvents extends ClientToServerEventsBase {
  startRoom: (capacity: number) => void;
  adjustCapacity: (capacity: number) => void; // maybe, might just be better to restart
  skipToNextLayer: () => void;
}

interface GenericParticipantToServerEvents
  <TInputLayerOutput,
  THiddenLayer1Output,
  THiddenLayer2Output,
  TOutputLayerOutput>
  extends ClientToServerEventsBase {
  joinRoom: (roomID: string, participantName: string, assignRole: (role: ParticipantRole) => void) => void;
  forwardPropogateFromInputLayer: (data: TInputLayerOutput) => void;
  forwardPropogateFromHiddenLayer1: (data: THiddenLayer1Output) => void;
  forwardPropogateFromHiddenLayer2: (data: THiddenLayer2Output) => void;
  sendOutputFromOutputLayer: (data: TOutputLayerOutput) => void;
}

// may help with testing to split the generic/non generic definitions 
// (but maybe not, and then could/should be collapsed)
export interface ParticipantToServerEvents
  extends GenericParticipantToServerEvents<number[], number, number, ImageClassification> {
}