const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/rolex.db3'
  }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
  // get the roles from the database
  db('roles')
    .then(roles => {
      res.status(200).json(roles)
    })
    .catch(err => {
      res.status(500).json(err)
    });
});

router.get('/:id', (req, res) => {
  // retrieve a role by id
  const id = req.params.id;

  db('roles')
    .where({ id: id })
    .then(role => {
      res.status(200).json(role)
    })
    .catch(err => {
      res.status.json(err)
    });
});

router.post('/', (req, res) => {
  // add a role to the database
  db('roles')
    .insert(req.body)
    .then(ids => {
      const [id] = ids;

      db('roles')
        .where({ id })
        .then(role => {
          res.status(200).json(role)
        })
        .catch(err => {
          res.status(500).json(err)
        })
    });
});

router.put('/:id', (req, res) => {
  // update roles
  const roleid = req.params.id;
  db('roles')
    .where({ id: roleid })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('roles')
          .where({ id: req.params.id })
          .first()
          .then(role => {
            res.status(200).json(role)
          })
      } else {
        res.status(404).json({
          message: 'Role not found'
        })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  const id = req.params.id;
  db('roles')
    .where({ id })
    .delete()
    .then(count => {
      if (count > 0) {
        res.status(204).json({
          message: 'Role has been deleted'
        })
      } else {
        res.status(404).json({
          message: 'Not Found'
        })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

module.exports = router;
