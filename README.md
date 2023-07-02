# CSPjs

Simple library to do Constraint Satisfaction Problem

```typescript
import { solve, enforceConstraint, Problem} from "cspjs"
import util from "util"

const variables = {
    "a": [1,2,3,4],
    "b": [1,2,3,4]
}

const problem : Problem = {
    variables,
    constraints: [
        {head:"a", tail:"b", predicate: (h,t)=>h+t===h*t}
    ]
}

const solutions = solve(problem)
const firstSol = solutions.next()
```

