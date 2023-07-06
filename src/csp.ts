import { variables } from "./testProblem"
import { cartesian } from "./utils"

export type Domain<T> = T[]

export type Variable = string

export type Variables = {
    [key: string]: Domain<any>
}

export type NaryConstraint = {
    variables: any[],
    predicate: (...variables:any[]) => boolean
}

export type BinaryConstraint = {
    head: Variable,
    tail: Variable,
    predicate: (x: any, y: any) => boolean
}

export type Constraint = NaryConstraint | BinaryConstraint
export type Constraints = Constraint[]
export type BinaryConstraints = ( BinaryConstraint)[]

export interface Problem {
    variables: Variables,
    constraints: Constraints
}

export interface BinaryProblem {
    variables: Variables,
    constraints: BinaryConstraints
}

export interface Solution {
    [key: string]: any
}

const isNaryConstraint = (c: Constraint): c is NaryConstraint => {
    return Array.isArray((c as NaryConstraint).variables)
}
const isBinaryConstraint = (c: Constraint): c is BinaryConstraint => {
    return (c as BinaryConstraint).head !== undefined
}
/*
    removes incompatible values from domains
*/
export function enforceConstraint(_variables: Variables, constraints: BinaryConstraints, remainingConstraints: BinaryConstraints=[]):Variables {


    function iterate() {
        
        let variables: Variables = _variables;
        let checkedConstraint: BinaryConstraints = remainingConstraints;
        let constraintQueue: BinaryConstraints = constraints;
        // let allConstraints: Constraints = constraints;

        while(constraintQueue.length > 0){
            const [constraint, ...queueTail] = constraintQueue;
            const { head, tail, predicate } = constraint;
            checkedConstraint.push(constraint)
            // remove inconsistent values 
            const val1 = variables[head]
            const val2 = variables[tail]
            // valid values for var2 are the ones for which there are some in var1
            // that satisfy constraint
            const valids = val2.filter(v2 =>
                val1.some(v1 => predicate(v1, v2))
            )
            const removed = valids.length < val2.length;
            // if var2 has a smaller domain, we have to check again
            // constraints for which var2 is the source
            constraintQueue = removed ? queueTail.concat(
                checkedConstraint.filter(c => c.head === tail)
            ) : queueTail

            checkedConstraint = removed ? checkedConstraint.filter(c => c.head !== tail) : checkedConstraint
    
            variables = { ...variables, [tail]: valids };
           
        }

        return variables;
    }

    
    // assigned are single valies domain here
    // for(let ass in assigned) variables[ass] = [assigned[ass]]
    return iterate()

}

function* assign(unassigned: Variables, assigned: Variables, problem: BinaryProblem): Generator<Variables, Variables, unknown> {

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



    function checkEmptyDomains(variables: Variables): boolean {
        for (let v in variables) {
            if (variables[v].length === 0) return true
        }
        return false
    }

    if (Object.keys(unassigned).length === 0) {
        // we have one solution
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
        const constraintsToCheck = problem.constraints.filter(({head,tail,predicate})=>head===nextVar)
        const remainingConstraints = problem.constraints.filter(({head,tail,predicate})=>head!==nextVar)

        for (let value of values) {
            const tentative = { ...assigned, [nextVar]: [value] }
            const variables = { ...nextUnassigned, ...tentative }


            const enforced = enforceConstraint(variables, constraintsToCheck, remainingConstraints)

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


export function *solve(problem: BinaryProblem):Generator<Solution,void,unknown> {
    const result = assign(problem.variables, {}, problem)
    for(let variables of result){
        const solution = Object.keys(variables).reduce<Solution>(
            (acc:Solution, v:string, i, list) => ({...acc,[v]:variables[v][0]})
            ,{} as Solution
        )
        yield solution
    }
}

export function binarize(problem: Problem):BinaryProblem {
    // selects binary constraints
    const naryConstraints = problem.constraints.filter(isNaryConstraint)
    
    const binaryEquiv = naryConstraints.reduce((ob,nc,i)=>{
        const ncv = nc.variables;
        const domains = ncv.map(v=>problem.variables[v])
        const domain:any[][] = cartesian(...domains)
        const actualDomain = domain.filter(el => nc.predicate(...el))
        const evName = `_ev_${i}`
        const constraints: BinaryConstraints = ncv.map((v,i) => ({
            head: v,
            tail: evName,
            predicate: (h:any,t:any[]) => h === t[i]
        })).concat(ncv.map((v,i) => ({
            head: evName,
            tail: v,
            predicate: (t:any[], h:any) => h === t[i]
        })));

        return {
            variables: {...ob.variables, [evName]:actualDomain},
            constraints: [...ob.constraints, ...constraints]
        }
    },{variables:{},constraints:[]} as BinaryProblem)

    return {
        variables: {...problem.variables, ...binaryEquiv.variables},
        constraints: [
            ...problem.constraints.filter(isBinaryConstraint),
            ...binaryEquiv.constraints
        ]
    }

}