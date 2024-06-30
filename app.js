const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash=require('connect-flash');
const User = require("./models/user");
const bcryptjs=require('bcryptjs');
const Admin = require('./models/admin.js');
const MONGODB_URI = "mongodb+srv://kavyabanoth11:mSZIUS2fy2UvQ1Eb@learning.wnswutm.mongodb.net/";

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});
app.set("views", "./views");
app.set("view engine", "ejs");

const teacherRoutes = require("./routes/teacher");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const studRoutes = require("./routes/student");
const courseRoutes=require('./routes/course');

app.use(authRoutes);
app.use("/teacher", teacherRoutes);
app.use("/admin", adminRoutes);
app.use(studRoutes);
app.use(courseRoutes);

const Lesson=require('./models/lesson');

app.put('/lessons/:id', (req, res) => {
  const id = req.params.id;
  
  Lesson.findByIdAndUpdate(id, { checked: 1 }, { new: true })
    .then(updatedLesson => {
      res.json(updatedLesson);
    })
    .catch(err => {
      console.error('An error occurred while updating the lesson');
     
    });
});


// // addAdmin.js



// // Connect to MongoDB
// mongoose.connect('mongodb+srv://kavyabanoth11:mSZIUS2fy2UvQ1Eb@learning.wnswutm.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB');

//   // Create a new admin instance
//   const newAdmin = new Admin({
//     FullName: 'admin',
//     phoneNo: '1234567890',
//     password: 'kavya@2004',
//     email: 'kavya123@gmail.com'
//   });

//   // Save the new admin to the database
//   newAdmin.save()
//     .then((result) => {
//       console.log('Admin added successfully:', result);
//     })
//     .catch((error) => {
//       console.error('Error adding admin:', error);
//     })
//     .finally(() => {
//       // Close the connection to MongoDB
//       mongoose.connection.close();
//     });
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

mongoose
  .connect("mongodb+srv://kavyabanoth11:mSZIUS2fy2UvQ1Eb@learning.wnswutm.mongodb.net/")
  .then((result) => {
    app.listen(3001, () => {
      console.log("App Listening to port 3001");
    });
    console.log('MongoDB Connected...');
  })
  .catch((err) => console.log("MongoDB connection error:", err));
