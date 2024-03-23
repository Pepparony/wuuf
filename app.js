if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const Dog = require('./models/wuufSchema.js')
const User = require('./models/User.js')
app.set('view engine', 'ejs')
const path = require('path')
app.set('views', path.join(__dirname, 'views'));
const catchAsync = require('/Users/holdengerlach/Desktop/Projects/wuuf/utilities/catchAsync.js')
const ExpressError = require('/Users/holdengerlach/Desktop/Projects/wuuf/utilities/errorHandler.js')
const methodOverride = require('method-override')
const session = require('express-session')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { storage } = require('./cloudinary')
const upload = multer({ storage })
const sessionConfig = {
    secret: '83asdniq9129qnnqd9100',
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionConfig))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('scripts'))

const helpValidate = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    else {
        next()
    }
}

const database = process.env.DB_URL

const mongoose = require('mongoose')
mongoose.connect(database)
    .then(() => {
        console.log('CONNECTION OPEN')
    })
    .catch((err) => {
        console.log(`OH NO ERROR ${err}`)
    })

const seedDB = async () => {
    for (let i = 0; i < 50; i++) {
        const dog = await new Dog({

        })
    }
}



app.use((req, res, next) => {
    console.log(req.session)
    next()
})


app.get('/', catchAsync(async (req, res, next) => {
    const dogs = await Dog.findOne()
    const thingy = req.session.user_id
    res.render('./homepage', { dogs, thingy })
}))



app.get('/dogs',catchAsync(async (req, res, next) => {
    const dogs = await Dog.find()
    await Dog.deleteMany({ tagName: "" })
    const thingy = req.session.user_id
    res.render('./dogs', { dogs, thingy })
}))

app.get('/mydogs', helpValidate ,catchAsync(async(req,res,next) => {
    const thingy = req.session.user_id
    const dog = await Dog.find()
    res.render('./mydogs', {thingy, dog})
}))

app.get('/dogs/:id', helpValidate, catchAsync(async (req, res, next) => {
    const dog = await Dog.findById(req.params.id).populate('author');
    const dogs = await Dog.findOne().populate('author')
    const thingy = req.session.user_id
    const user = await User.findById(thingy)
    console.log(dog.images)
    res.render('./dogsShow', { dog, dogs, thingy, user })
}))

app.get('/dogs/:id/edit', helpValidate, catchAsync(async (req, res, next) => {
    const dog = await Dog.findById(req.params.id).populate('author')
    const user = await User.findById(req.session.user_id)
    const thingy = req.session.user_id
    if(dog.author.email == user.email) {
        res.render('./dogsEdit', {thingy, dog})
    } 
    else {
        res.redirect('/')
    }
}))


app.get('/homepage',(req,res,next) => {
    res.send('THIS IS NOT THE HOMEPAGE, ROUTE TO wuuf.com')
})

app.get('/dogs/:id/adopt', helpValidate, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const dog = await Dog.findById(id)
    const user = await User.findById(req.session.user_id)
    const thingy = req.session.user_id
    res.render('./adopt', { dog, thingy, user })
}))

app.put('/dogs/:id', helpValidate, catchAsync(async (req, res, next) => {
    const dog = await Dog.findByIdAndUpdate(id, { ...req.body.dog })
    if (dog.author === req.session.user_id) {
        res.redirect(`/dogs/${dog._id}`)
    }
    else {
        res.redirect('/')
    }
}))

app.delete('/dogs/:id', helpValidate, catchAsync(async (req, res, next) => {
    if (dog.author === req.session.user_id) {
        const { id } = req.params
        await Dog.findByIdAndDelete(id)
        res.redirect('/dogs')
    }
    else {
        res.redirect('/')
    }
}))

app.post('/dogs', helpValidate, upload.array('images'), catchAsync(async (req, res, next) => {
    identity = req.session.user_id;
    const dog = new Dog({ ...req.body.dog, author: identity });
    dog.images = req.files.map(f => ({ url: f.path, filename: f.filename, }))
    console.log(dog)
    await dog.save()
    res.redirect(`/dogs/${dog._id}`)
}))
app.get('/createdog', helpValidate, (req, res, next) => {
    const thingy = req.session.user_id
    res.render('./createDog', { thingy })
})

app.get('/login', (req, res) => {
    res.render('./login')
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        res.render('./failed')
    }
    const result = await bcrypt.compare(password, user.password)
    if (result) {
        req.session.user_id = user._id
        res.redirect('/dogs')
    }
    else {
        res.render("./failed")
    }
})

app.get('/register', (req, res) => {
    res.render('./register')
})

app.post('/register', async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body
    const search = await User.findOne({ email: email })
    if (search) {
        res.send('email already in use')
    }
    else {
        const result = await bcrypt.hash(password, 12)
        const user = await new User({
            firstName,
            lastName,
            email,
            password: result,
        })
        await user.save()
        req.session.user_id = user._id;
        res.redirect('/')
    }
})

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('./login')
    } else {
        res.send('Thank you for making an account, here is the secret sauce')
    }
})

app.post('/logout', (req, res, next) => {
    req.session.user_id = null
    res.redirect('/')
})


app.get('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'An error was encountered'
    res.status(statusCode).render('./errors', { err })
})


app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
