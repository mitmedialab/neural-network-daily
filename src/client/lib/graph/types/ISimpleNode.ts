import type EParticipantRole from '$lib/enums/EParticipantRole';
import type IEquatable from '../../common/IEquatable';
import type TIndexInLayer from '$lib/graph/types/TIndexInLayer';

interface ISimpleNode extends IEquatable<ISimpleNode> {
  indexWithinLayer: TIndexInLayer;
  layer: EParticipantRole;
}

export default ISimpleNode;

export const equals = (lhs: ISimpleNode, rhs: ISimpleNode) => {
  return lhs.layer === rhs.layer && lhs.indexWithinLayer === rhs.indexWithinLayer;
}