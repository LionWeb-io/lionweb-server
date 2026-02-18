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
    "nodeDoesNotExist",
    "TwoNodesWithSameId",
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
    "generic"
] as const

export type DeltaErrorCode = (typeof DeltaErrorCodes)[number]

export function isDeltaErrorCode(v: string): v is DeltaErrorCode {
    const s: readonly string[] = DeltaErrorCodes
    return s.includes(v)
}

