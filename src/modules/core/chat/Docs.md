## Custom Commands Guide

1. Create command file in #modules/core/chat/commands
2. Make example command like this

```ts
import { CInterface } from "../CHandler"

let CCexampleConfig: CInterface = {
    name: "example",
    description: "Example command",
    args: [],
    func: function(){
        console.warn("Hello World!")
    },
    version: 1,
    secure: false
}

export { CCexampleConfig }
```

3. Import command to CHandler.ts
```ts
import { CCexampleConfig } from "./commands/example"
```

4. Register command
```ts
let example = new CHandler(CCexampleConfig).register()
```