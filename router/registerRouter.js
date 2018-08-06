const express = require('express');
const actionsDB = require('../data/helpers/actionsDB');
const { registerConstraints } = require('../middleware');
const router = express.Router();

/* 
  ACTIONS API
*/

// get all actions
router.get('/', async (req, res) => {
  try {
    const actions = await actionsDB.get();
    if (actions.length === 0) {
      res.status(200).json({ message: 'There are currently no actions' });
    } else {
      res.status(200).json(actions);
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

// get an action by id
router.get('/:id', async (req, res) => {
  const ID = req.params.id;

  // make sure we have an action
  try {
    const action = await actionsDB.get(ID);
    if (typeof action === 'undefined') {
      res.status(400).json({ message: `There is no action with id:${ID}` });
    } else {
      // we do, so get the contexts
      try {
        const contexts = await actionsDB.getContexts(ID);
        let displayObj = { ...action };
        let contextArr = [];
        for (let i = 0; i < contexts.length; i++) {
          contextArr.push(contexts[i].name);
        }
        if (contextArr.length > 0) {
          displayObj['Contexts'] = contextArr;
        } else {
          displayObj['Contexts'] = 'none';
        }
        res.status(200).json(displayObj);
      } catch (err) {
        res.status(500).send(`${err}`);
      }
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

// update an action
router.put('/:id', actionConstraints, async (req, res) => {
  const ID = req.params.id;
  const { NOTES, DESCRIPTION } = req;

  const ACTION = { notes: NOTES, description: DESCRIPTION };

  // make sure we have the project to update
  try {
    const action = await actionsDB.get(ID);
    if (typeof action === 'undefined') {
      res.status(400).json({ message: `There is no action with id:${ID}` });
    } else {
      // we do! try to update the action
      try {
        const action = await actionsDB.update(ID, ACTION);
        res.status(200).json({ message: `action id:${ID} has been updated.` });
      } catch (err) {
        res.status(500).send(`${err}`);
      }
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

// delete a action
router.delete('/:id', async (req, res) => {
  const ID = req.params.id;

  // make sure we have the action to delete
  try {
    const action = await actionsDB.get(ID);
    if (typeof action === 'undefined') {
      res.status(400).json({ message: `There is no action with id:${ID}` });
    } else {
      // we do! try to delete the action
      try {
        const action = await actionsDB.remove(ID);
        res.status(200).json({ message: `Action id:${ID} has been deleted.` });
      } catch (err) {
        res.status(500).send(`${err}`);
      }
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

module.exports = router;
