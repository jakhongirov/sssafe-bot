const express = require("express")
const router = express.Router()

//Middlawares
const {
   AUTH
} = require('../middleware/auth')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const users = require('./users/users')

router

   // ADMIN API
   .get('/admin/list', AUTH, admin.GET_ADMIN)
   .post('/admin/register', admin.REGISTER_ADMIN)
   .post('/admin/login', admin.LOGIN_ADMIN)
   .put('/admin/edit', AUTH, admin.EDIT_ADMIN)
   .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

   // USERS
   .get('/users/list', AUTH, users.GET)


module.exports = router