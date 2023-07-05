export const cartesian: (...a:any[])=>any = (...a) => a.reduce((a, b) => a.flatMap((d:any) => b.map((e:any) => [d, e].flat())));
