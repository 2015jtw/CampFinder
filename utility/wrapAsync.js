module.exports = wrapAsync => {
    return (req, res, next) => {
        wrapAsync(req, res, next).catch(next)
    }
}
