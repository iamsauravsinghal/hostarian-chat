const Joi = require('joi');
const express = require('express');
const path = require('path');
const app =express();
app.use(express.json());
const courses = [
    {id: 1 , name: 'Course1'},
    {id: 2 , name: 'Course2'},
    {id: 3 , name: 'Course3'}
];
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/courses', (req, res)=>{
    res.send(courses)
});

app.get('/api/courses/:id',(req, res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course with given ID was not found')
    res.send(course);
});

app.put('/api/courses/:id', (req, res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('Course not found')
    //validate
    const result = validateCourse(req.body)
    if(result.error)return res.status(400).send(result.error.details[0].message);
    course.name = req.body.name;
    res.send(course);
});

app.post('/api/courses', (req, res)=>{
    const {error} = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.delete('/api/courses/:id', (req,res)=>{
    //Check if ID Exists
    //If does not exist, send 404 message
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("The course does not exist")
    //If exists
    //Delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1)
    //respond with the copy object
    res.send(course);
})

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on Port ${port} ...`))