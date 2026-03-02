import { LionWebJsonMetaPointer, LionWebJsonNode } from "@lionweb/json"

export type AttachPoint = {
    container: string
    containment: LionWebJsonMetaPointer
    root: string
}

export type BulkImport = {
    attachPoints: AttachPoint[]
    nodes: LionWebJsonNode[]
}