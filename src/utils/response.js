module.exports = {
  sendSafeUser: (user, res) => {
    const safe = user.toObject();
    delete safe.passwordHash;
    res.json(safe);
  }
};

