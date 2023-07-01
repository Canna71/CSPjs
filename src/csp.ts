type Domain<T> = T[] 

type Variable  = string

type Variables = {
    [key: string]: Domain<any>
}

type Constraint<T> = {
    var1: Variable,
    var2: Variable,
    predicate: (x:T, y:T) => boolean
}

type Constraints = Constraint<any>[]

interface Problem {
    variables: Variables,
    constraints: Constraints
}