const express = require('express')
const app = express()
const port = 3000

const mySql = require('mysql2');

const query = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'week3_task_nodejs'
})


app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/getAllUsers', (req, res) => {
    query.execute("SELECT * from users", (err, data) => {
        res.json({ message: "Get All users successfully", data })
    })
})

app.post('/addUser', (req, res) => {
    const { name, email, age, password } = req.body;
    query.execute(`SELECT email from users WHERE email='${email}'`, (err, data) => {
        if (data.length == 0) {
            query.execute(`INSERT INTO users (name,email,age,password) values ('${name}','${email}','${age}','${password}')`);
            res.json({ message: "Add user Seccesscully ", data })
        } else {
            res.json({ message: "This email is already exist", data })
        }
    })
})


app.delete('/deleteUser', (req, res) => {
    const { email } = req.body;
    query.execute(`SELECT email from users where email='${email}' `, (err, data) => {
        if (data.length == 1) {
            query.execute(`delete from users where email='${email}'`)
            res.json({ message: "Deleted user successfully", data })
        }
        else {
            res.json({ message: "This email does not valid" })
        }
    })
})

app.put('/updateUser', (req, res) => {
    const { email, name, age } = req.body;
    query.execute(`SELECT email from users where email='${email}' `, (err, data) => {
        if (data.length == 1) {
            query.execute(`update users set name='${name}' , age='${age}' where email='${email}' `)
            res.json({ message: "Updated  successfully", data })
        }
        else {
            res.json({ message: "This email does not valid" })
        }
    })
})

// search user by startgin letter/s and lower than a defint age
app.post('/searchUser', (req, res) => {
    const { searchCharName, searchAge } = req.body;
    query.execute(`select * from users where ( name like '${searchCharName}%' AND  age<${searchAge} )`, (err, data) => {
        if (data.length > 0) {
            res.json({ message: "searched value get succesfully", data })
        } else {
            res.json({ message: "Not founded value" })
        }
    })
})

// search to get user with id 
app.post('/getUserById', (req, res) => {
    const { id } = req.body;
    query.execute(`SELECT * FROM users WHERE id IN(${id}) `, (err, data) => {
        if (data.length > 0) {
            res.json({ message: " get user by Id", data })
        } else {
            res.json({ message: "Not founded value" })
        }
    })

})

// list ids less than id number
app.post('/getUsersById', (req, res) => {
    const { id } = req.body;
    query.execute(`SELECT * FROM users WHERE id <= (${id}) `, (err, data) => {
        if (data.length > 0) {
            res.json({ message: " get user by Id", data })
        } else {
            res.json({ message: "Not founded value" })
        }
    })

})

app.post('/addProduct', (req, res) => {
    const { pName, pDescription, pPrice, email } = req.body;
    query.execute(`SELECT id from users where email='${email}' `, (err, data) => {
        console.log(data[0].id);
        if (data.length > 0) {
            query.execute(`INSERT INTO products (pName , pDescription ,pPrice ,createdBy) VALUES ( '${pName}' , '${pDescription}' , '${pPrice}' , '${data[0].id}' )`)
            res.json({ message: "add product successfully" })
        } else {
            res.json({ message: "this email is not aithourzed to add product" })
        }
    })
})

app.delete('/deleteProduct', (req, res) => {
    const { email, pId } = req.body;
    query.execute(`SELECT id from users where email='${email}' `, (err, data) => {
        console.log(data[0].id);
        if (data.length > 0) {
            query.execute(`SELECT * FROM products WHERE  createdBy='${data[0].id}' AND id='${pId}' `, (err, prodData) => {
                if (prodData.length == 1) {
                    query.execute(`DELETE FROM products WHERE id='${pId}'`)
                    res.json({ message: "Deleted product successfully", prodData })
                } else {
                    res.json({ message: "Cannot delet this product you are not authorized" })
                }
            })
        } else {
            res.json({ message: "This email is not authorized" })
        }
    })
})

app.put('/updateProduct', (req, res) => {
    const { email, pId, pName, pDescription, pPrice } = req.body;
    query.execute(`SELECT id from users where email='${email}' `, (err, data) => {
        console.log(data[0].id, "user");
        if (data.length > 0) {
            query.execute(`SELECT * FROM products WHERE createdBy='${data[0].id}' AND id='${pId}' `, (err, prodData) => {
                console.log(prodData, "product");
                if (prodData.length == 1) {
                    query.execute(`UPDATE products SET pName='${pName}' , pDescription='${pDescription}' , pPrice='${pPrice}' WHERE id='${pId}'`)
                    res.json({ message: "updated product successfully", prodData, newData: { name: pName, description: pDescription, pirce: pPrice } })
                } else {
                    res.json({ message: "Cannot update this product you are not authorized" })
                }
            })
        } else {
            res.json({ message: "This email is not authorized" })
        }
    })
})

app.get('/getAllProducts', (req, res) => {
    query.execute('SELECT * FROM products', (err, data) => {
        res.json({ message: "Get All users successfully", data })
    })
})


// search by price and result is any products its product price greater than input price 
app.post('/searchProductByPrice' , ( req , res ) => {
    const { price } = req.body;
    query.execute(`SELECT * FROM products WHERE pPrice > ${price}` , (err , data) => {
        res.json({message : `get all prodcust which the pirce is greater than ${price}` , data})
    })
    
})

// get all users with thier products
app.get('/getUsersWithProducts' , (req , res) =>{
    query.execute(`SELECT * FROM users INNER JOIN products ON  users.id =products.createdBy ` , (err , data) =>{
        res.json({message :"get all data" , data})
    })
})

// get all products with its user
app.get('/getProductsWithUser' , (req , res) =>{
    query.execute(`SELECT * FROM products INNER JOIN users ON  products.createdBy = users.id` , (err , data) =>{
        res.json({message :"get all data" , data})
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))