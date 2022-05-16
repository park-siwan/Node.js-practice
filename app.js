const express = require('express');

const app = express();

const members = require('./api/members');

app.get('/api/members', (req, res) => {
  res.send(members);
});

app.get('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such member' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening...');
});
