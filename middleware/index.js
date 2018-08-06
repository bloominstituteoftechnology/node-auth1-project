// middleware for users constraints
function usersConstraints(req, res, next) {
  const NAME = req.body.name;

  if (!NAME) {
    return next({
      code: 400,
      error: `Please provide a 'name' for the user.`,
    });
  }

  if (NAME.length > 128) {
    return next({
      code: 400,
      error: `The 'name' of the user must be fewer than 128 characters.`,
    });
  }
  next();
}

// middleware for posts constraints
function postsConstraints(req, res, next) {
  const TEXT = req.body.text;

  if (!TEXT) {
    return next({
      code: 400,
      error: `Please provide 'text' for the post.`,
    });
  }

  next();
}

// middleware for tags constraints
function tagsConstraints(req, res, next) {
  const TAG = req.body.tag;

  if (!TAG) {
    return next({
      code: 400,
      error: `Please provide a 'tag' for the tag.`,
    });
  }

  if (TAG.length > 16) {
    return next({
      code: 400,
      error: `The 'tag' must be fewer than 16 characters.`,
    });
  }
  next();
}

// middleware for tags constraints
function posttagsConstraints(req, res, next) {
  const TAGID = req.body.tagId;
  const POSTID = req.body.postId;

  if (!TAGID) {
    return next({
      code: 400,
      error: `Please provide an 'tagId' for the tag.`,
    });
  }
  if (!POSTID) {
    return next({
      code: 400,
      error: `Please provide an 'postId' for the post.`,
    });
  }
  next();
}

module.exports.usersConstraints = usersConstraints;
module.exports.postsConstraints = postsConstraints;
module.exports.tagsConstraints = tagsConstraints;
module.exports.posttagsConstraints = posttagsConstraints;
