const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
//middleware let`s you configure how your express aplication works
app.set('view engine', 'hbs');

app.use((req, res, next) => { //app.use() is how you register middleware - it takes a function
    //next - this arg exists so you can tell express your middleware function is done
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log.')
        }
    });
    next(); //if you do not call next the server will freeze.
});

/*
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});
*/

//middleware is executed in the order you define it - 
app.use(express.static(__dirname + '/public')); //adding middleware - using middleware function static() from express

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//create http routes
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'

    });
});

app.get('/about', (req, res) => {
    //let`s you render any of templates you have setup with current view engine
    res.render('about.hbs', { //second argument can be an object which you can pass so you can inject data in the template
        pageTitle: 'About Page'
    }); 
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Unable to handle this request"
    });
});

app.listen(port, () => { //2nd argument is optional, it`s a function that will run once the server has started
    console.log(`Server is up on port ${port}`);
}); //chrome: http://localhost:3000/