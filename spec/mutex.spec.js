const { createMutex }= require('../');

const timer = {
    sleep: milliseconds => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    }
};



describe('createMutex', () => {
    it('should lock and unlock and lock a second time', done => {
        lock = createMutex();
        lock(() => {}).then(lock(() => {})).then(() => {
            done();
        });
    });

    it('should acquire lock in sequence', done => {
        let seq = 0;
        let result1;
        let result2;

        lock = createMutex();
        let p1 = lock(() => {
            return timer.sleep(10).then(() => {
                result1 = seq ++;
            });
        });

        let p2 = lock(() => {
            return new Promise(resolve => {
                result2 = seq ++;
                resolve();
            });
        });

        Promise.all([p1, p2]).then(() => {
            expect(result1).toBe(0);
            expect(result2).toBe(1);
            done();
        });
    });
});