/**
 * Timeout helper to mimic sleep function with async/await pattern
 * @param { number } time - ms to wait before continue
 * @returns { Promise<any> }
 */
export function timeout(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
