
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


export function validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}
