export const DeltaErrorCodes = [
    "invalidParticipation",
    "nodeAlreadyExists",
    "propertyAlreadyExists",
    "unknownNode",
    "unknownIndex",
    "indexEntryMismatch",
    "indexNodeMismatch",
    "childNotFound",
    "moveWithoutParent",
    "invalidMove",
    "repositoryMissing",
    "undefinedReferenceTarget",
    "unknownNode",
    "haveTheSameParents",
    "idsAlreadyInUse",
    "TwoNodesWithSameId",
    "identicalContainment",
    "chunkIsNotATree",
    "unknownReference",
    "unknownProperty",
    "unknownContainment",
    "repositoryIdMissing",
    "notSubscribed",
    "alreadySubscribed",
    "participationMissing",
    "notSignedOn",
    "queryError",
    "messageSyntaxIncorrect",
    "messageKindUnknown",
    "undefinedReferenceTarget",
    "referenceTargetOrResolveInfoMismatch",
    "parentMismatch",
    "noActiveSplitCommand",
    "incorrectSequenceNumber",
    "generic"
] as const

export type DeltaErrorCode = (typeof DeltaErrorCodes)[number]

export function isDeltaErrorCode(v: string): v is DeltaErrorCode {
    const s: readonly string[] = DeltaErrorCodes
    return s.includes(v)
}
/*
ErrorDefinition "unknownNode" (nodeId: LionWebId)
    Node with id { nodeId } does not exist.

ErrorDefinition "incorrectIndex" (nodeId: LionWebId, index: Number) {
    Node with id { nodeId } does not exist at index { index }


message {
    child: LionWebId
    oldIndex: Number

    errors: [
        ref unknownNode { childNode: child }  
        ref incorrectIndex { childNode: child, index: oldIndex } 
    ]    
}
*/
