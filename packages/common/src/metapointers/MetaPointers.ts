import { LionWebJsonMetaPointer, LionWebJsonNode } from "@lionweb/json"
import { deltaLogger, requestLogger } from "../apiutil/index.js"
import { DbConnection, LionWebTask, METAPOINTERS_TABLE, RepositoryData } from "../database/index.js"

/**
 * Map from the calculated metapointer id which is `language`@`version`@`key` to
 * the id of the metapointer in the metapointer table in the database.
 */
export type MetaPointersMap = Map<string, number>

// This is private and global. Metapointers never change and their index can be shared
// We expect their number to be limited so we can have a cache that cannot be emptied
// This is a Map from `repository name` to the MetaPointersMap of this repository.
const globalMetaPointersMap: Map<string, MetaPointersMap> = new Map<string, Map<string, number>>()

export async function initializeGlobalMetaPointersMap(task: LionWebTask | DbConnection, repositoryData: RepositoryData): Promise<void> {
    if (!globalMetaPointersMap.has(repositoryData.repository.repository_name)) {
        globalMetaPointersMap.set(repositoryData.repository.repository_name, new Map<string, number>())
    }
    // Since this is the first access to the metapointer map, we need to fetch all
    // existing metapointers from the database
    const queryResult = await task.query(repositoryData, `SELECT id, language, _version, key from ${METAPOINTERS_TABLE}`)
    const map = globalMetaPointersMap.get(repositoryData.repository.repository_name)
    for(const mp of queryResult) {
        const mpKey = `${mp.language}@${mp._version}@${mp.key}`
        map.set(mpKey, mp.id)
        deltaLogger.info(`Initializing key '${mpKey}' with id '${mp.id}'`)
    }
}

async function insertInGlobalMetaPointersMap(task: LionWebTask | DbConnection, repositoryData: RepositoryData, key: string, metaPointerIndex: number) {
    // deltaLogger.info(`insertInGlobalMetaPointersMap repo ${repositoryData.repository.repository_name} key ${key} index ${metaPointerIndex}`)
    if (!globalMetaPointersMap.has(repositoryData.repository.repository_name)) {
        globalMetaPointersMap.set(repositoryData.repository.repository_name, new Map<string, number>())
    }
    globalMetaPointersMap.get(repositoryData.repository.repository_name).set(key, metaPointerIndex)
}

function hasInGlobalMetaPointersMap(repositoryName: string, key: string): boolean {
    // deltaLogger.info(`hasInGlobalMetaPointersMap repo '${repositoryName}' key '${key}'`)
    const map = globalMetaPointersMap.get(repositoryName)
    if (map !== undefined) {
        return map.has(key)
    } else {
        return false
    }
}

function getFromGlobalMetaPointersMap(repositoryName: string, key: string): number {
    const map = globalMetaPointersMap.get(repositoryName)
    if (map !== undefined && map.has(key)) {
        return map.get(key)
    } else {
        throw new Error()
    }
}

export function cleanGlobalPointersMap(repositoryName: string) {
    globalMetaPointersMap.delete(repositoryName)
}

/**
 * This class is used to collect the MetaPointers to then collect at once.
 */
export class MetaPointersCollector {
    // Given the set of LionWebJsonMetaPointers would not recognize duplicate, we store also
    // keys for each metapointer, in order to catch duplicates
    private keysOfMetaPointers: Set<string> = new Set<string>()
    private metaPointers = new Set<LionWebJsonMetaPointer>()

    constructor(private repositoryData: RepositoryData) {}

    considerNode(node: LionWebJsonNode) {
        this.considerAddingMetaPointer(node.classifier)
        node.properties.forEach(p => this.considerAddingMetaPointer(p.property))
        node.references.forEach(r => this.considerAddingMetaPointer(r.reference))
        node.containments.forEach(c => this.considerAddingMetaPointer(c.containment))
    }

    considerAddingMetaPointer(metaPointer: LionWebJsonMetaPointer) {
        const key = `${metaPointer.language}@${metaPointer.version}@${metaPointer.key}`
        if (hasInGlobalMetaPointersMap(this.repositoryData.repository.repository_name, key) || this.keysOfMetaPointers.has(key)) {
            return
        } else {
            this.keysOfMetaPointers.add(key)
            this.metaPointers.add(metaPointer)
        }
    }

    async obtainIndexes(task: LionWebTask | DbConnection): Promise<void> {
        if (this.metaPointers.size == 0) {
            return
        }
        const metaPointersList = Array.from(this.metaPointers)
        const ls = `array[${metaPointersList.map(el => `'${el.language}'`).join(",")}]`
        const vs = `array[${metaPointersList.map(el => `'${el.version}'`).join(",")}]`
        const ks = `array[${metaPointersList.map(el => `'${el.key}'`).join(",")}]`
        const raw_res: { tometapointerids: string }[] = await task.query(this.repositoryData, `SELECT toMetaPointerIDs(${ls},${vs},${ks});`)
        // deltaLogger.info(`> obtainindices for repo ${this.repositoryData.repository.repository_name} rawres is ${raw_res.length}`)
        raw_res.forEach(async (el) => {
            if (el === undefined) {
                throw new Error("EL IS UNDEFINED")
            }
            const value = el.tometapointerids
            if (value === undefined) {
                throw new Error("VALUE IS UNDEFINED")
            }
            const parts = value.substring(1, value.length - 1).split(",")
            await insertInGlobalMetaPointersMap(
                task,
                this.repositoryData,
                `${parts[1]}@${parts[2]}@${parts[3]}`,
                Number(parts[0])
            )
        })
    }
}

/**
 * This class permits to track the MetaPointers we need to store in the MetaPointers Table and then store
 * exclusively the ones that we do not know already.
 */
export class MetaPointersTracker {
    constructor(private repositoryData: RepositoryData) {}

    async populateFromNodes(nodes: LionWebJsonNode[], task: LionWebTask | DbConnection) {
        await this.populate(collector => {
            nodes.forEach((node: LionWebJsonNode) => collector.considerNode(node))
        }, task)
    }

    async populate(populationLogic: (collector: MetaPointersCollector) => void, dbConnection: DbConnection | LionWebTask): Promise<void> {
        deltaLogger.info(`Populate ${this.repositoryData.repository.repository_name}`)
        const localCollector = new MetaPointersCollector(this.repositoryData)
        populationLogic(localCollector)
        await localCollector.obtainIndexes(dbConnection)
    }

    forMetaPointer(metaPointer: LionWebJsonMetaPointer): number {
        // deltaLogger.info("forMetaPointer")
        const key = `${metaPointer.language}@${metaPointer.version}@${metaPointer.key}`
        if (!hasInGlobalMetaPointersMap(this.repositoryData.repository.repository_name, key)) {
            throw new Error(`MetaPointer not found: '${key}' language '${metaPointer.language}'`)
        }
        return getFromGlobalMetaPointersMap(this.repositoryData.repository.repository_name, key)
    }
}
