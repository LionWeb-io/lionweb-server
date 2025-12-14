const Node = { "language": "LionCore-builtins", "key": "LionCore-builtins-Node", "version": "1" }
const INamed = { "language": "LionCore-builtins", "key": "LionCore-builtins-INamed", "version": "1" }
const Program = { "language": "-key-LogoProgram", "key": "-key-Program", "version": "1" }
const Library = { "language": "-key-LogoProgram", "key": "-key-Library", "version": "1" }
const ICommand = { "language": "-key-LogoProgram", "key": "-key-ICommand", "version": "1" }
const MoveCommand = { "language": "-key-LogoProgram", "key": "-key-MoveCommand", "version": "1" }
const List = { "language": "-key-LogoProgram", "key": "-key-List", "version": "1" }
const SetPos = { "language": "-key-LogoProgram", "key": "-key-SetPos", "version": "1" }
const SetHeading = { "language": "-key-LogoProgram", "key": "-key-SetHeading", "version": "1" }
const HomeCommand = { "language": "-key-LogoProgram", "key": "-key-HomeCommand", "version": "1" }
const Repeat = { "language": "-key-LogoProgram", "key": "-key-Repeat", "version": "1" }
const If = { "language": "-key-LogoProgram", "key": "-key-If", "version": "1" }
const IExpression = { "language": "-key-LogoProgram", "key": "-key-IExpression", "version": "1" }
const Procedure = { "language": "-key-LogoProgram", "key": "-key-Procedure", "version": "1" }
const Parameter = { "language": "-key-LogoProgram", "key": "-key-Parameter", "version": "1" }
const ProcedureCall = { "language": "-key-LogoProgram", "key": "-key-ProcedureCall", "version": "1" }

export const CLASSIFIER = {
    Node, INamed, Program, Library, ICommand, MoveCommand, List, SetPos, SetHeading, HomeCommand, Repeat, If, IExpression, Procedure, Parameter, ProcedureCall
}
const INamedName = { "language": "LionCore-builtins", "key": "LionCore-builtins-INamed-name", "version": "1" }
const MoveCommandDirection = { "language": "-key-LogoProgram", "key": "-key-MoveCommand-direction", "version": "1" }
const MoveCommandDistance = { "language": "-key-LogoProgram", "key": "-key-MoveCommand-distance", "version": "1" }
const SetPosX = { "language": "-key-LogoProgram", "key": "-key-SetPos-x", "version": "1" }
const SetPosY = { "language": "-key-LogoProgram", "key": "-key-SetPos-y", "version": "1" }
const SetHeadingDegrees = { "language": "-key-LogoProgram", "key": "-key-SetHeading-degrees", "version": "1" }
const RepeatCount = { "language": "-key-LogoProgram", "key": "-key-Repeat-count", "version": "1" }

export const PROPERTY = {
    INamedName, MoveCommandDirection, MoveCommandDistance, SetPosX, SetPosY, SetHeadingDegrees, RepeatCount
}
const ProcedureCallProcedure = { "language": "-key-LogoProgram", "key": "-key-ProcedureCall-procedure", "version": "1" }

export const REFERENCE = {
    ProcedureCallProcedure
}
const ProgramCommands = { "language": "-key-LogoProgram", "key": "-key-Program-commands", "version": "1" }
const LibraryProcedures = { "language": "-key-LogoProgram", "key": "-key-Library-procedures", "version": "1" }
const ListCommands = { "language": "-key-LogoProgram", "key": "-key-List-commands", "version": "1" }
const RepeatList = { "language": "-key-LogoProgram", "key": "-key-Repeat-list", "version": "1" }
const IfCondition = { "language": "-key-LogoProgram", "key": "-key-If-condition", "version": "1" }
const IfIfTrue = { "language": "-key-LogoProgram", "key": "-key-If-ifTrue", "version": "1" }
const IfIfFalse = { "language": "-key-LogoProgram", "key": "-key-If-ifFalse", "version": "1" }
const ProcedureBody = { "language": "-key-LogoProgram", "key": "-key-Procedure-body", "version": "1" }
const ProcedureParameter = { "language": "-key-LogoProgram", "key": "-key-Procedure-parameter", "version": "1" }

export const CONTAINMENT = {
    ProgramCommands, LibraryProcedures, ListCommands, RepeatList, IfCondition, IfIfTrue, IfIfFalse, ProcedureBody, ProcedureParameter
}
