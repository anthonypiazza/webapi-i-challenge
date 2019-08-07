// implement your API here
const express = require('express');

const Users = require('./data/db');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(Users)
})

server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    Users.insert(userInfo)
    .then(user => {
        if(userInfo.name.length > 0 && userInfo.bio.length > 0){
            res.status(201).json(user)
        }else{
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
    })
    .catch( err => {
        res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
})

server.get('/api/users', (req,res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Users.findById(id)
    .then(specificUser => {
        if (specificUser){
            res.status(200).json(specificUser)
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id)
    .then(specificUser => {
        if (specificUser){
            res.status(200).json({ message: "User successfully deleted." })
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
})

server.put('/api/users/:id', (req,res) => {
    const { id } = req.params;
    const changes = req.body;
    Users.update(id, changes)
    .then(updated => {
        if(!updated){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
        else if(changes.name.length > 0 && changes.bio.length > 0){
            res.status(200).json(updated);
        }else{
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be modified." })
    })
})

const port = 8000;
server.listen(port, () => console.log('\nAPI running\n on port'))