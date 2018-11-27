module.exports = {
  restrictedRoute: (req, res, next) => {
    res
      .status(200)
      .json({ msg: 'Welcome to the champagne room! Let us party 🎉! ' })
  }
}
