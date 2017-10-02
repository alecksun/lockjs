'use strict';

const __thenable = func => {
    return Promise.resolve().then(func);
}

const createMutex = () => {
    let promise = Promise.resolve();
    return func => {
        const oldPromise = promise;
        const newPromise = oldPromise.then(() => {
            return new Promise((resolve, reject) => {
                __thenable(func).then(result => {
                    console.log(result);
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
            });
        });

        promise = newPromise.catch(err => {});
        return newPromise;
    }
}

module.exports = createMutex;
