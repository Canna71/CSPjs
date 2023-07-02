export type Domain<T> = T[]

export type Variable = string

export type Variables = {
    [key: string]: Domain<any>
}

export type Constraint<T> = {
    head: Variable,
    tail: Variable,
    predicate: (x: T, y: T) => boolean
}

export type Constraints = Constraint<any>[]

export interface Problem {
    variables: Variables,
    constraints: Constraints
}

export interface Solution {
    [key: string]: any
}


function* assign(unassigned: Variables, assigned: Variables, problem: Problem): Generator<Variables, Variables, unknown> {

    function varWithSmallerDomain(variables: Variables): string {
        let choice = "NOTVALID"
        let minSize = Number.MAX_SAFE_INTEGER
        for (let v in variables) {
            let domainSize = variables[v].length
            if (domainSize < minSize) {
                minSize = domainSize
                choice = v
            }
        }
        return choice
    }

    function enforceConstraint(unassigned: Variables, assigned: Variables) {


        function iterate(variables: Variables, constraints: Constraints) {
            if (constraints.length === 0) {
                return variables;
            }

            const [constraint, ...queueTail] = constraints;
            const { head, tail, predicate } = constraint;

            // remove inconsistent values 
            const val1 = variables[head]
            const val2 = variables[tail]
            // valid values for var2 are the ones for which there are some in var1
            // that satisfy constraint
            const valids = val2.filter(v2 =>
                val1.some(v1 => predicate(v1, v2))
            )
            const removed = valids < val2;
            // if var2 has a smaller domain, we have to check again
            // constraints for which var2 is the source
            const nextConstraints = removed ? queueTail.concat(
                problem.constraints.filter(c => c.head === tail)
            ) : queueTail
            const nextVariables = { ...variables, [tail]: valids }
            return iterate(nextVariables, nextConstraints)
        }

        const variables = { ...unassigned, ...assigned }
        // assigned are single valies domain here
        // for(let ass in assigned) variables[ass] = [assigned[ass]]
        return iterate(variables, problem.constraints)

    }

    function checkEmptyDomains(variables: Variables): boolean {
        for (let v in variables) {
            if (variables[v].length === 0) return true
        }
        return false
    }

    if (Object.keys(unassigned).length === 0) {
        // we have one solution
        // TODO: keep track in order to find next one if any
        yield assigned
    } else {
        // pick next unassigned variable from the one with the 
        // smaller domain
        let nextVar = varWithSmallerDomain(unassigned)
        // TODO: choose the best value using an heuristic
        // https://stanford.edu/~shervine/teaching/cs-221/cheatsheet-variables-models#:~:text=Least%20constrained%20value%20It%20is,are%20most%20likely%20to%20work.
        const values = unassigned[nextVar]
        // remove next var from unassigned
        const { [nextVar]: _, ...nextUnassigned } = unassigned;

        for (let value of values) {
            const tentative = { ...assigned, [nextVar]: [value] }
            const enforced = enforceConstraint(nextUnassigned, tentative)

            const someEmpty = checkEmptyDomains(enforced);
            if (someEmpty) continue;
            // otherwise we try to assign other variables

            const newAssigned: Solution = {}
            const newUnassigned: Variables = {}
            for (let variab in enforced) {
                if (tentative.hasOwnProperty(variab)) newAssigned[variab] = tentative[variab]
                else newUnassigned[variab] = enforced[variab]
            }
            yield* assign(newUnassigned, newAssigned, problem)

        }
    }



    // if we got here, we failed
    return {} as Variables

}


export function *solve(problem: Problem):Generator<Solution,void,unknown> {
    const result = assign(problem.variables, {}, problem)
    for(let variables of result){
        const solution = Object.keys(variables).reduce<Solution>(
            (acc:Solution, v:string, i, list) => ({...acc,[v]:variables[v][0]})
            ,{} as Solution
        )
        yield solution
    }
}