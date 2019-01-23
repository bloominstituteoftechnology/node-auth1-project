const passCheck = user => {
  let worthy = true;
  const pwArr = user.password
    .split("")
    .filter(
      item =>
        item === "!" ||
        item === "@" ||
        item === "#" ||
        item === "$" ||
        item === "%" ||
        item === "^" ||
        item === "&" ||
        item === "*"
    );
  if (user.password.length < 8 || pwArr.length === 0 || user.password === user.username) {
    worthy = false;
  }
  return worthy;
};

module.exports = {
    passCheck
}