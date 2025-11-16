# Rationale for MetaPointers Indexing

Classifier and Features instances are all identified by MetaPointers. For each node we have therefore at least one MetaPointer
and typically many. Given a MetaPointer is a structure with three values, some of which could be relatively long strings,
we have an incentive to index them. This saves significant space on the underlying Database. It also makes insertions and retrievals of 
large amounts of nodes much faster.

# Repository-Based Global Map

We expect the number of unique values for MetaPointers to be relatively small, as they are proportional to the amount of 
Concepts and Features, which are expected to be a fraction compared to the number of nodes in the database.
Given this, and the fact that entry in the index table of MetaPointers are immutable, we keep the content of this index table in memory.

Note that we store entries in the table, separately for each repository.

The system can operate on such global table using:

- `insertInGlobalMetaPointersMap(repositoryName: string, key: string, metaPointerIndex: number)`
- `hasInGlobalMetaPointersMap(repositoryName: string, key: string): boolean`
- `getFromGlobalMetaPointersMap(repositoryName: string, key: string): number`
- `cleanGlobalPointersMap(repositoryName: string)`

Note that, this is how we get a key in this table, from a given MetaPointer:

```
const key = `${metaPointer.language}@${metaPointer.version}@${metaPointer.key}`
```

We can then use the `getFromGlobalMetaPointersMap` method.

# Storing and Retrieving MetaPointers Indexes from the Database

The indexes are stored in the `MetaPointers` table. We want to work on such table by using the `MetaPointersCollector` class.
When using it we:

- First, let the instance knows about all the nodes we want to deal with. It will then look into them and examine all the MetaPointers.
- When examining the MetaPointers, the instance will check if they are A) already in the global map, or B) if they are 
  already marked "to be indexed". If they are not, it will add them to the list of MetaPointers "to be indexed".
- Finally, when the call `obtainIndexes`. This method will take all the MetaPointers marked as "to be indexed" and 
  add them to the Database. It will then get the indexes associated to them and store them in the global map.

Note that the actual insertion on the MetaPointers table is done on the Database side, through a stored procedure.
This procedure is:

```
# It returns an array of indexes
toMetaPointerIDs(<array of languages>, <array of versions>, <array of keys>)
```
