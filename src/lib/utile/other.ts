export function randomNumBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sleep(duration: number | undefined) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}

export function memoize(cb: (arg0: any) => any) {
    const cache = new Map()
    return (...args: any) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)

        const result = cb(...args)
        cache.set(key, result)
        return result
    }
}
