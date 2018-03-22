module.exports = (promise) => {
    return promise.then(data => {
            return [null, data];
        })
        .catch(err => [err]);
}
// I am using this utility function to write async await without try-catch blocks
// I got this from https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/