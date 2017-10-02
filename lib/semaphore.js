'use strict';

const __thenable = func => {
    return Promise.resolve().then(func);
}

const createSemaphore = count => {
    let size = 0;
    let resolves = [];

    const next = () => {
        if (resolves.length) {
            const resolve = resolves.shift();
            resolve();
        }
    }
    
    return func => {
        let promise = new Promise((resolve, reject) => {
            if (size < count) {
                resolve();
            } else {
                resolves.push(resolve);
            }
            size ++;
        });

        return promise.then(func).then(result => {
            size --;
            next();
            return result;
        }).catch(err => {
            size --;
            next();
            throw err;
        });
    };
};

module.exports = createSemaphore;
