const express = require('express');
const router = express.Router();
const multer  = require('multer');
const Farmer = require('../models/Farmer');
const fs = require('fs');


//image uploads
var storage = multer.diskStorage({
    destination : function(request, file, callback) {
        callback(null, "./uploads")
    },
    filename : function(request, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage : storage,
}).single('image')

//upload file to Database
router.post('/add', upload, (request, response) => {
    const farmer = new Farmer({
        name : request.body.name,
        email : request.body.email,
        phone : request.body.phone,
        age : request.body.age,
        state : request.body.state,
        image : request.file.filename,
    });
    farmer.save()
        .then(farmer => {
            request.session.message = {
                type : 'success',
                message : 'Farmer Added Successfully...!'
            };
            response.redirect('/farmers/dashboard')
        })
        .catch(error => console.log(error))

})


router.get('/update/:id', (request, response) => {
    let id = request.params.id;
    const farmer = Farmer.findById(id)
            .then((farmer) =>{
                context = { farmer : farmer, title : 'Update Farmer'}
                response.render("editFarmer", context)
            })
            .catch((error) => {
                response.redirect("/farmers/dashboard")
            })
})

router.post('/update/:id', upload, (request, response) => {
    let id = request.params.id;
    let new_image = ""

    if (request.file) {
        new_image = request.file.filename;
        try {
            fs.unlinkSync("./uploads" + request.body.old_image)
            
        } catch (error) {
            console.log(error)
        }
    } else {
        new_image = request.body.old_image
    }

    Farmer.findByIdAndUpdate(id, {
        name : request.body.name,
        email : request.body.email,
        phone : request.body.phone,
        age : request.body.age,
        state : request.body.state,
        image : new_image
    })
    .then(farmer => {
        request.session.message = {
            type : 'success',
            message : 'Farmer Updated Successfully...!'
        };
        response.redirect('/farmers/dashboard')
    })
    .catch((error) => console.log(error))

})



router.get('/delete/:id', (request, response) => {
    let id = request.params.id;
    Farmer.findByIdAndRemove(id)
        .then((result) => {
            if (result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image)
                } catch (error) {
                    console.log(error)
                }
            }
            request.session.message = {
                type : 'info',
                message : 'Farmer Deleted Successfully...!'
            };
            response.redirect('/farmers/dashboard')
        })
        .catch((error) => {
            console.log(error)
        })
})


router.get('/dashboard', (request, response) => {
    const farmers = Farmer.find({})
        .then(farmers => {
            const context = {farmers : farmers, title : 'Farmers DashBoard'}
            response.render('farmersDashboard', context)
        })
        .catch(error => console.log(error))
})


router.get('/add', (request, response) => {
    response.render('addFarmer')
})

module.exports = router;