module.exports = class routerFactory {
  constructor(router, Model) {
    this.hello = 'Hello from Router Factory instance';
    this.router = router;
    this._setProjection;
    this._toPopulate = [];

    // Make a reference to 'db'
    this.Model = Model;
  }
  // This line allow create a new instance of the Model -> needed to create a new Document.
  newModel(arg) {
    const Model = this.Model;
    return new Model(arg);
  }

  sayHello(text) {
    console.log('Hello form %s instance', text);
  }

  GET(path = '/') {
    this.router.route(path).get(handleGET.bind(this), sendResponseToClient.bind(this));
  }
  GET_id(path = '/:id') {
    this.router.route(path).get(isIdValid.bind(this), handleGET.bind(this), sendResponseToClient.bind(this));
  }
  POST(path = '/') {
    this.router.route(path).post(validateParameters.bind(this), handlePOST.bind(this), sendResponseToClient.bind(this));
  }
  PUT(path = '/:id') {
    this.router.route(path).put(
      isIdValid.bind(this),
      validateParameters.bind(this),
      // excludeUniqueFieldsFromPUT.bind(this),
      handlePUT.bind(this),
      sendResponseToClient.bind(this)
    );
  }
  DELETE(path = '/:id') {
    this.router.route(path).delete(isIdValid.bind(this), handleDELETE.bind(this), sendResponseToClient.bind(this));
  }

  CRUD() {
    this.router
      .route('/')
      .get(handleGET.bind(this), sendResponseToClient.bind(this))
      .post(validateParameters.bind(this), handlePOST.bind(this), sendResponseToClient.bind(this));

    this.router
      .route('/:id')
      .get(isIdValid.bind(this), handleGET.bind(this), sendResponseToClient.bind(this))
      .put(
        isIdValid.bind(this),
        validateParameters.bind(this),
        // excludeUniqueFieldsFromPUT.bind(this),
        handlePUT.bind(this),
        sendResponseToClient.bind(this)
      )
      .delete(isIdValid.bind(this), handleDELETE.bind(this), sendResponseToClient.bind(this));

    this.router.use(handleError.bind(this));
  }
  setProjection(projections) {
    this._setProjection = projections;
  }
  setPopulate(...arg) {
    arg.forEach(arg => {
      switch (typeof arg) {
        case 'string':
          this._toPopulate.push([arg, {}]);
          break;
        case 'object':
          const path = Object.keys(arg)[0];
          this._toPopulate.push([path, arg[path]]);
      }
    });
    // console.log('toPopulate', this._toPopulate);
  }
};

/** ------------------------------------------------------------------------------ */
/**
 * THESE FUNCTIONS ARE NO AIM TO BE ACCESIBLE AS A 'routerFActory' METHOD.
 * THUS -> ARE NO DECLARED AS CLASS METHODS
 */
/** ------------------------------------------------------------------------------ */

/**
 * ROUTER HANDLERS: handle endpoints
 */
function handlePOST(req, res, next) {
  const parameters = req.body;

  const toPost = this.newModel(parameters);
  toPost
    .save()
    .then(newDocument => {
      // res.status(201).json(newDocument);
      req.responseDocument = newDocument;
      next();
    })
    .catch(e => {
      next(e);
    });
}
function handleGET(req, res, next) {
  const { id } = req.params;
  let fetching = !id ? this.Model.find({}, {}) : this.Model.find({ _id: id }, {});

  // Populate the query
  this._toPopulate && this._toPopulate.forEach(join => fetching.populate(join[0], join[1]));
  // Project the query
  this._setProjection && fetching.select(this._setProjection);

  fetching.exec(function(err, response) {
    if (err) {
      !id
        ? next(createError(500, 'The information could not be retrieved.'))
        : next(500, 'The information could not be retrieved.');
    } else {
      req.responseDocument = response;
      next();
    }
  });
}
function handleDELETE(req, res, next) {
  const { id } = req.params;

  this.Model.findByIdAndRemove(id)
    .then(response => {
      req.responseDocument = response;
      next();
    })
    .catch(e => {
      next(createError(500, 'The friend could not be removed'));
    });
}
function handlePUT(req, res, next) {
  const { id } = req.params;
  const { ...toUpdate } = req.toUpdate || req.body;
  this.Model.findByIdAndUpdate(id, toUpdate, { new: true, runValidators: true })
    .then(response => {
      req.responseDocument = response;
      next();
    })
    .catch(e => {
      next(e);
    });
}
/**
 * ERROR: Handle Error
 */
function handleError(err, req, res, next) {
  !err.status ? next(err) : res.status(err.status).json({ errorMessage: err.message });
  next();
}
// return a new custom Error
function createError(code = 500, message = 'Oh, oh.... there is a problem bargain with the dababase, try again!') {
  let e = new Error();
  e.status = code;
  e.message = message;
  return e;
}

/**
 * MIDDLEWARES: Custom middlewears
 */
function isIdValid(req, res, next) {
  const { id } = req.params;
  if (!id) return next();

  this.Model.findById(id)
    .then(idFound => {
      return idFound ? next() : next(createError(404, 'The friend with the specified ID does not exist.'));
    })
    .catch(e => {
      next(e);
    });
}
// If there are missing 'required' fields return an Error else next()
function validateParameters(req, res, next) {
  const parameters = { ...req.body };

  // To 'push' the path that are "required: true"
  let requiredPaths = [];

  // Get Schema paths and path's properties:
  const pathsANDschema = Object.entries(this.Model.schema.paths);

  /**
   * Filter the required paths: and push them to the 'requiredPaths' variable
   */
  pathsANDschema.forEach(entrie => {
    const pathName = entrie[0];
    const pathSchema = entrie[1];
    pathSchema.validators.length === 1 && requiredPaths.push(pathName);

    /**
     * If there a several 'validators': => filter if one of them are of type 'required: true'
     */
    if (pathSchema.validators.length > 1) {
      pathSchema.validators.forEach(validator => {
        validator.type == 'required' && requiredPaths.push(pathName);
      });
    }
  });

  /**
   * If there are no missing required paths: ? next() : next('custom-error')
   * If the required field is in the body but has no value: error handle by the Schema validators.
   */
  requiredPaths.length === 0 || !areThereMissingPathsInParams(requiredPaths, parameters)
    ? next()
    : next(createError(400, `The following field are required: ${requiredPaths.join(' ')}`));
}
function excludeUniqueFieldsFromPUT(req, res, next) {
  const toUpdate = { ...req.body };
  const entries = Object.entries(this.Model.schema.paths);
  entries.forEach(entrie => {
    const pathName = entrie[0];
    const pathProperties = entrie[1];
    /**
     * if a 'path' is set to be 'unique' in the Schema: => delete that path from the 'toUpdate' object.
     * Thus: the 'unique' path does not get updated.
     */
    // if (pathProperties.options.unique == true) parameters[pathName] = null;
    pathProperties.options.unique == true && delete toUpdate[pathName];
  });
  // Pass the parameters with the adjustments to the next middleware handler
  req.toUpdate = toUpdate;
  next();
}
function sendResponseToClient(req, res, next) {
  const endpoint = req.baseUrl;
  const method = req.method;
  // console.log({ method });
  const document = req.responseDocument || req.updatedDocument;

  const anexToResponse = {
    GET: 'in database',
    POST: 'created',
    PUT: 'modified',
    DELETE: 'deleted',
  }[method];

  res.status(200).json({ [`Document(s) ${anexToResponse}`]: document });
}

/**
 * OTHER Helpers: auxiliar functions
 */
function areThereMissingPathsInParams(paths, parameters) {
  let missingFields = false;
  for (let path of paths) {
    if (!parameters.hasOwnProperty(path)) missingFields = true;
  }
  return missingFields;
}
