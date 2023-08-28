const express = require('express');
const router = express.Router();
const multer  = require('multer');
const Farmer = require('../models/Farmer');
const fs = require('fs');
const { ensureAuthenticated } = require('../config/authConfig');


//image uploads
var storage = multer.diskStorage({
    destination : function(request, file, callback) {
        callback(null, "./uploads/")
    },
    filename : function(request, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage : storage,
}).single('image')


router.get('/add', ensureAuthenticated, (request, response) => {
    response.render('addFarmer')
})

router.get('/dashboard', ensureAuthenticated, async (request, response) => {
    let query = Farmer.find()
    if (request.query.name != null && request.query.name != '' ) {
        query = query.regex('name', new RegExp(request.query.name, 'i'))
    } 
    if (request.query.email != null && request.query.email != '' ) {
        query = query.regex('email', new RegExp(request.query.email, 'i'))
    } 
    if (request.query.state != null && request.query.state != '' ) {
        query = query.regex('state', new RegExp(request.query.state, 'i'))
    } 
    try {
        const farmers = await query.exec()
        const context = { farmers : farmers, searchOptions : request.query, title : "Farmers Dashboard", username : request.user.name}
        response.render('farmersDashboard', context)
    } catch {
        response.render('core')
    }



})


// router.get('/detail/:id', (request, response) => {
//     const id = request.params.id;
//     Farmer.findById(id)
//             .then((result) =>{
//                 context = { farmer : result, title : 'Farmer Detail Page'}
//                 response.render("farmerDetail", context)
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
// })


//upload file to Database
router.post('/add', upload, ensureAuthenticated, (request, response) => {
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


router.get('/update/:id', ensureAuthenticated, (request, response) => {
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

router.post('/update/:id', upload, ensureAuthenticated, (request, response) => {
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



router.get('/delete/:id', ensureAuthenticated, (request, response) => {
    let id = request.params.id;
    Farmer.findOneAndRemove(id)
        .then((result) => {
            if (result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image)
                } catch (error) {
                    console.log(error)
                }
            }
            request.session.message = {
                type : 'success',
                message : 'Farmer Deleted Successfully...!'
            };
            response.redirect('/farmers/dashboard')
        })
        .catch((error) => {
            console.log(error)
        })
})



module.exports = router;