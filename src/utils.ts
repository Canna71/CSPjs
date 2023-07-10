export const cartesian: (...a:any[])=>any = (...a) => a.reduce((a, b) => a.flatMap((d:any) => b.map((e:any) => [d, e].flat())));

export function* cartesianProductLazy(arr:any[][], i = 0):Generator<any[], void, unknown> {
    if (i == arr.length) {
        yield [];
        return;
    }
    let subArray = arr[i];
    for (let val of subArray) {
        for (let restProduct of cartesianProductLazy(arr, i + 1)) {
            yield [val, ...restProduct];
        }
    }
}

export function* filteredCartesianProduct(arr:any[], predicate:(...vars:any[])=>boolean):Generator<any[], void, unknown> {
    // let checked = new Set();
    // let unchecked = new Set();
    for (let product of cartesianProductLazy(arr)) {
        // let sortedProduct = product.slice().sort();
        // let key = JSON.stringify(sortedProduct);
        if (predicate(...product)) {
            yield product;
        }
        // let satisfied = false
        // if (!checked.has(key) && !unchecked.has(key)) {
        //     satisfied = predicate(...product);
        //     (satisfied ? checked : unchecked).add(key)
            
        // } else {
        //     satisfied = checked.has(key)
        // }
        // if (satisfied) {
        //     yield product;
        // }
    }
}

