const express = require('express');
const app = express();
const fsPro = require('node:fs/promises')
const port =  3000;
app.use(express.json());

//1
app.post('/users', async (req, res) => {
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');
    try {
        const users = JSON.parse(fileData);
        const newUser = req.body;
        const ifDuplicated = users.some(user=>{
           return user.email === newUser.email;
        })
        if(ifDuplicated){
            return res.status(400).json({ error: "Email already exists" });
        }
        users.push(newUser);
        await fsPro.writeFile(filePath, JSON.stringify(users,null, 2), 'utf-8');
        res.status(200).json({message : "User added successfully"});
    } catch (error) {
        res.status(500).json({message : error.message});
    }

})

//2
app.patch('/users/:id', async (req, res) => {
    let id = req.params.id;
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');

    try {
        let body = req.body;
        let users = JSON.parse(fileData);
        const isFound = users.some(user=>{
            if(user.id === id){
                for(let key in body){
                    user[key] = body[key];
                }

            }
            return user.id === id;
        })
        if(!isFound){
            return res.status(404).json({ error: "User does not exist" });
        }
        await fsPro.writeFile(filePath, JSON.stringify(users , null , 2),'utf-8');
        res.status(200).json({message : "User updated successfully"});
    } catch (e){
        res.status(500).json({message : e});

    }


})

//3
app.delete('/users/:id', async (req, res) => {
    let id = req.params.id;
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');
    try {
        let users = JSON.parse(fileData);
        const isFound = users.some(user=>{
            if(user.id === id){
                users.splice(users.indexOf(user),1);
            }
            return user.id === id;
        })
        if(!isFound){
            return res.status(404).json({ error: "User does not exist" });
        }
        await fsPro.writeFile(filePath, JSON.stringify(users , null , 2),'utf-8');
        res.status(200).json({message : "User deleted successfully"});

    } catch (e) {
        res.status(500).json({message : e});

    }
})

//4
app.get('/users/getByName', async (req, res) => {
    let name = req.query.name;
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');
    try {
        let users = JSON.parse(fileData);
        let queriedUser = users.filter(user=>{
            return user.name.toLowerCase().includes(name.toLowerCase());
        });
        if(queriedUser.length === 0){
            return res.status(404).json({ error: "User does not exist" });
        }
        let s = queriedUser.length > 1 ? 's' : '';
        res.status(200).json({message : `User${s} found successfully` , userData : queriedUser});

    }catch(err){
        res.status(500).json({message : err});
    }
})

//5
app.get('/users', async (req, res) => {
    const filePath = './users.json';
    try{
        const fileData = await fsPro.readFile(filePath , 'utf-8');
        const users = JSON.parse(fileData);

        res.status(200).json({
            message: "success",
            data: users
        });

    }catch (e){

        console.log(e);

        res.status(500).json({
            message: "there is no users or an error occurred",
            error: e.message
        });
    }
})

//6
app.get('/users/filter', async (req, res) => {
    let minAge = req.query.minAge;
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');
    try {
        const users = JSON.parse(fileData);
        let filteredUsers = users.filter(user=>{
            return user.age >= minAge;
        })
        if(filteredUsers.length === 0){
            return res.status(404).json({ error: "No users found" });
        }
        let s = filteredUsers.length > 1 ? 's' : '';
        res.status(200).json({message : `User${s} found successfully`, userData : filteredUsers});
    } catch (e) {
        res.status(500).json({message : e});

    }

})

//7
app.get('/users/:id', async (req, res) => {
    let id = req.params.id;
    const filePath = './users.json';
    const fileData = await fsPro.readFile(filePath , 'utf-8');
    try {
        let users = JSON.parse(fileData);
        let queriedUser = users.filter(user=>{
            return user.id === id;
        })
        if(queriedUser.length === 0){
            return res.status(404).json({ error: "User does not exist" });
        }
        res.status(200).json({message : "User found successfully" , user:queriedUser});

    }
    catch(err){
        res.status(500).json({message : err});
    }
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})