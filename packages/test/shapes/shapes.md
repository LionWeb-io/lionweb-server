# Shapes Language

```
Diagram rectangles
    Rectangle rectangle-0
        Position: x: 10, y: 12
    Rectangle rectangle-1
        Position: x: 10, y: 12
    Connection connect-0
        start: => rectangle-1    
        end  : => rectangle-2    
```

#### AddChild rectangle-3 to Diagram rectangles

```json
{
    "messageKind": "AddChild",
    "parent": "rectangles",
    "newChild": {
        "nodes": [
            {
                "id": "rectangle-2",
                "classifier": {
                    "language": "Diagram",
                    "version": "1.0",
                    "key": "-key-Rectangle"
                },
                "properties": [],
                "containments": [],
                "references": [],
                "annotations": [],
                "parent": null
            }
        ]
    },
    "containment": {
        "language": "Diagram",
        "version": "1.0",
        "key": "-key-Diagram"
    },
    "index": 2
}
```

```
Diagram rectangles
    Rectangle rectangle-1
        Position: x: 10, y: 12
    Rectangle rectangle-2
        Position: x: 10, y: 12
    Rectangle rectangle-3
        Position: x: 10, y: 12
    Connection connect-1
        start: => rectangle-1    
        end  : => rectangle-2    
```

before

```mermaid
%%{init: {'theme': 'forest'} }%%
    classDiagram
    direction TD
    %% other possibilites: LR RL DT TB (same as TD)
    class rectangles["Diagram"]  {
        
    }
    class `rectangle-0` {
    }
    class `connection-0` {
    }
    class AAA["Animal with a label"]

`rectangles:Diagram` *-- `connection-0`
`rectangles:Diagram` *-- `rectangle-0`
`rectangles:Diagram` *-- `rectangle-1`
`connection-0` --> `rectangle-0` : start
`connection-0` --> `rectangle-1` : end
```

After:

```mermaid
%%{init: {'theme': 'forest'} }%%
    classDiagram
    direction TD
    %% other possibilites: LR RL DT TB (same as TD)
    class rectangles["Diagram"]  {
    }
    class `rectangle-0` {
    }
    class `connection-0` {
    }
   
rectangles *-- `connection-0`
rectangles *-- `rectangle-0`
rectangles *-- `rectangle-1`
rectangles *-- `rectangle-2`
`connection-0` --> `rectangle-0` : start
`connection-0` --> `rectangle-1` : end
```
