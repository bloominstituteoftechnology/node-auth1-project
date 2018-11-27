module.exports = {
  restrictedRoute: (req, res, next) => {
    return res
      .status(200)
      .json({ msg: 'Welcome to the champagne room! Let us party 🎉! ' })
  }
}
