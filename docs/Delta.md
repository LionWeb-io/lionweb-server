The full Delta protocol has quite a lot of messages, these are being implemented one-by-one, but it takes some time to have them all. The table below shows the status of the implementation as of February 22, 2026..
The status is shown for the LionWeb Server, and also for Freon, as we use Freon as the main client for testing.

## Overview of implementation status

# Delta Protocol

Overview of implementation status

| Command                                             | Event       | Server        | Freon   | Freon | Test | Server Test Errors                   |
| --------------------------------------------------- | ----------- | ------------- | ------- | ----- | ---- | ------------------------------------ |
|                                                     |             |               | Command | Event |      |                                      |
| SignOn                                              | SignOnEvent | ✅             | ✅       | ✅     | ✅    |                                      |
| SignOff                                             |             |               |         |       |      |                                      |
| SubscribeToPartitionContents                        |             | ✅             | ✅       | ✅     | ✅    | alreadySubscribed                    |
| InformAboutChangingPartitions                       |             | ✅             |         |       |      |                                      |
| SubscribeToChangingPartitions                       |             | ✅             |         |       |      |                                      |
| UnsubscribeFromPartitionContentsRequest             |             | ✅             |         |       |      |                                      |
| ReconnectRequest                                    |             |               |         |       |      |                                      |
| GetAvailableIdsRequest                              |             | ✅             | ✅       | ✅     |      |                                      |
| ListPartitions                                      |             | ✅             | ✅       | ✅     |      |                                      |
|                                                     |             |               |         |       |      |                                      |
| ListRepositories                                    |             | ✅             | ✅       | ✅     |      |                                      |
| CreateRepository                                    |             | no (use bulk) | -       |       |      |                                      |
| DeleteRepsoitory                                    |             | no (use bulk) | -       |       |      |                                      |
| RenameRepository                                    |             | =             | -       |       |      |                                      |
|                                                     |             |               |         |       |      |                                      |
| CompositeCommand                                    |             | -             | -       | -     |      |                                      |
| AddProperty                                         |             | ✅             | ✅       | ✅     | ✅    | nodeDoesNotExist                     |
|                                                     |             |               |         |       |      | propertyAlreadyExists                |
| DeleteProperty                                      |             | ✅             | ?       | ?     | ✅    | unknownProperty                      |
| ChangeProperty                                      |             | ✅             | ✅       | ✅     | ✅    | nodeDoesNotExist                     |
| AddChild                                            |             | ✅             | ✅       | ✅     | ✅    | nodeAlreadyExists                    |
|                                                     |             |               |         |       |      | unknownNode                          |
|                                                     |             |               |         |       |      | unknownIndex                         |
| DeleteChild                                         |             | ✅             | ✅       | ✅     | ✅    | unknownContainment                   |
|                                                     |             |               |         |       |      | unknownNode                          |
|                                                     |             |               |         |       |      | unknownIndex                         |
| ChangeChild                                         |             | ✅             | ✅       | ✅     |      |                                      |
| AddReference                                        |             | ✅             | ✅       | ✅     | ✅    | unknownIndex                         |
|                                                     |             |               |         |       |      | undefinedReferenceTarget             |
|                                                     |             |               |         |       |      | unknownNode                          |
| DeleteReference                                     |             | ✅             | ✅       | ✅     | ✅    |                                      |
| ChangeReference                                     |             | ✅             | ✅       | ✅     | ✅    | referenceTargetOrResolveInfoMismatch |
|                                                     |             |               |         |       |      | undefinedReferenceTarget             |
|                                                     |             |               |         |       |      | unknownNode                          |
| AddPartition                                        |             | ✅             | ✅       | ✅     | ✅    | idsAlreadyInUse                      |
| DeletePartition                                     |             | ✅             | ?       | ?     | ✅    | unknownNode                          |
| ChangeClassifier                                    |             | -             | -       | -     |      |                                      |
| AddAnnotation                                       |             | -             | -       | -     |      |                                      |
| DeleteAnnotation                                    |             | -             | -       | -     |      |                                      |
| ChangeAnnotation                                    |             | -             | -       | -     |      |                                      |
| MoveChildFromOtherContainment                       |             | -             | -       | -     |      |                                      |
| MoveChildFromOtherContainmentInSameParent           |             | -             | -       | -     |      |                                      |
| MoveChildInSameContainment                          |             | -             | -       | -     |      |                                      |
| MoveAndReplaceChildFromOtherContainment             |             | -             | -       | -     |      |                                      |
| MoveAndReplaceChildFromOtherContainmentInSameParent |             | -             | -       | -     |      |                                      |
| MoveAndReplaceChildInSameContainment                |             | -             | -       | -     |      |                                      |
| MoveAndReplaceAnnotationFromOtherParent             |             | -             | -       | -     |      |                                      |
| MoveAndReplaceAnnotationInSameParent                |             | -             | -       | -     |      |                                      |
| ChunkedCommand                                      |             | -             | -       | -     |      |                                      |



Done 
