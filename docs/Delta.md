# Delta Protocol

Overview of implementation status

| Command                                             | Event       | Server        | Freon   | Freon |
| --------------------------------------------------- | ----------- |---------------|---------| ----- |
|                                                     |             |               | Command | Event |
| SignOn                                              | SignOnEvent | ✅             | ✅       | ✅     |
| SignOff                                             |             |               |         |       |
| SubscribeToPartitionContents                        |             | ✅             | ✅       | ✅     |
| InformAboutChangingPartitions                       |             | ✅             |         |       |
| SubscribeToChangingPartitions                       |             | ✅             |         |       |
| UnsubscribeFromPartitionContentsRequest             |             | ✅             |         |       |
| ReconnectRequest                                    |             |               |         |       |
| GetAvailableIdsRequest                              |             | ✅             |         |       |
| ListPartitions                                      |             | ✅             | ✅       | ✅     |
|                                                     |             |               |         |       |
| ListRepositories                                    |             | ✅             | ✅       | ✅     |
| CreateRepository                                    |             | no (use bulk) | -       |       |
| DeleteRepsoitory                                    |             | no (use bulk) | -       |       |
| RenameRepository                                    |             | =             | -       |       |
|                                                     |             |               |         |       |
| CompositeCommand                                    |             | -             | -       | -     |
| AddProperty                                         |             | ✅             | ✅       | ✅     |
| DeleteProperty                                      |             | ?             | ?       | ?     |
| ChangeProperty                                      |             | ✅             | ✅       | ✅     |
| AddChild                                            |             | ✅             | ✅       | ✅     |
| DeleteChild                                         |             | ✅             | ✅       | ✅     |
| ChangeChild                                         |             | ✅             | ✅       | ✅     |
| AddReference                                        |             | ✅             | ✅       | ✅     |
| DeleteReference                                     |             | ✅             | ✅       | ✅     |
| ChangeReference                                     |             | ✅             | ✅       | ✅     |
| AddPartition                                        |             | ✅             | ✅       | ✅     |
| DeletePartition                                     |             | ?             | ?       | ?     |
| ChangeClassifier                                    |             | -             | -       | -     |
| AddAnnotation                                       |             | -             | -       | -     |
| DeleteAnnotation                                    |             | -             | -       | -     |
| ChangeAnnotation                                    |             | -             | -       | -     |
| MoveChildFromOtherContainment                       |             | -             | -       | -     |
| MoveChildFromOtherContainmentInSameParent           |             | -             | -       | -     |
| MoveChildInSameContainment                          |             | -             | -       | -     |
| MoveAndReplaceChildFromOtherContainment             |             | -             | -       | -     |
| MoveAndReplaceChildFromOtherContainmentInSameParent |             | -             | -       | -     |
| MoveAndReplaceChildInSameContainment                |             | -             | -       | -     |
| MoveAndReplaceAnnotationFromOtherParent             |             | -             | -       | -     |
| MoveAndReplaceAnnotationInSameParent                |             | -             | -       | -     |
