import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import multer from "multer";
import Admins from "../../models/Admins";
import Categories from "../../models/Categories";
import Subscribe from "../../models/Subscribe";
import Stores from "../../models/Stores";
import Sliders from "../../models/Sliders";
import BottomSlider from "../../models/BottomSlider";
import ExclusiveSlider from "../../models/ExclusiveSlider";
import FeaturedDeal from "../../models/FeaturedDeal";
import FeaturedTodayTask from "../../models/FeaturedTodayTask";
import * as helper from "../../libs/common";
import Giftcard from "../../models/Giftcard";
import Coupon from "../../models/Coupon";
import Offer from "../../models/Offer";
import Brand from "../../models/Brand";
import WalletAmount from "../../models/Wallet-amount";
import WalletHistory from "../../models/Wallet-history";
import Notification from "../../models/Notification";
import { verifyJWTToken } from "../../libs/user_auth";
import * as user_auth from "../../libs/user_auth";
import Usergroup from "../../models/Usergroup";
import Deal from "../../models/Deal";
import Task from "../../models/Task";
require("dotenv").config();
import bcrypt from "bcrypt";
import fs from "fs-extra";
import Users from "../../models/Users";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adzventuresmedia@gmail.com',
      pass: 'jecahcbifjdxpthc'
    }
  });
const sharp = require('sharp');
const DIR2 = "./uploads/admin/category/";
const DIR3 = "./uploads/admin/store/";
const DIR4 = "./uploads/admin/slider/";
const DIR5 = "./uploads/admin/gift/";
const DIR6 = "./uploads/admin/coupon/";
const DIR7 = "./uploads/admin/offer/";
const DIR8 = "./uploads/admin/brand/";
const DIR9 = "./uploads/admin/deal/";
const DIR10 = "./uploads/admin/task/";
const DIR11 = "./uploads/admin/bottom-slider/";
const DIR12 = "./uploads/admin/exclusive-slider/";
const DIR13 = "./uploads/admin/featured-deal/";
const DIR14 = "./uploads/admin/featured-task/";
let storage2 = multer.diskStorage({
    destination: DIR2,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads = multer({
    storage: storage2
});

let storage3 = multer.diskStorage({
    destination: DIR3,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads3 = multer({
    storage: storage3
});

let storage4 = multer.diskStorage({
    destination: DIR4,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads4 = multer({
    storage: storage4
});

let storage5 = multer.diskStorage({
    destination: DIR5,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads5 = multer({
    storage: storage5
});

let storage6 = multer.diskStorage({
    destination: DIR6,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads6 = multer({
    storage: storage6
});

let storage7 = multer.diskStorage({
    destination: DIR7,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads7 = multer({
    storage: storage7
});

let storage8 = multer.diskStorage({
    destination: DIR8,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads8 = multer({
    storage: storage8
});

let storage9 = multer.diskStorage({
    destination: DIR9,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads9 = multer({
    storage: storage9
});

let storage10 = multer.diskStorage({
    destination: DIR10,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads10 = multer({
    storage: storage10
});

let storage11 = multer.diskStorage({
    destination: DIR11,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads11 = multer({
    storage: storage11
});

let storage12 = multer.diskStorage({
    destination: DIR12,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads12 = multer({
    storage: storage12
});
let storage13 = multer.diskStorage({
    destination: DIR13,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads13 = multer({
    storage: storage13
});

let storage14 = multer.diskStorage({
    destination: DIR14,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads14 = multer({
    storage: storage14
});


router.post("/signin", (req, res) => {
    console.log("adsfdsfsadfsdf")
    Admins.findOne({ email: req.body.email, status:"Active" })
    .populate("role")
    .then(admin => {
        if(!admin){
            return res.status(200).json({
                message: "User Not found",
                success: false,
                data: {  }
            })
        }
        bcrypt.compare(req.body.password, admin.password, function (err, result) {
            if (!result) {
                return res.status(200).json({
                    message: "User Not found",
                    success: false,
                    data: { error: err }
                })
            } else {
                return res.status(200).json({
                    message: "Sucessfully LoggedIn",
                    success: true,
                    data: {
                        token: jwt.sign({ admin: admin }, process.env.SECRET_JWT_KEY),
                        users:admin
                    }
                })
            }
        })
    })
})



router.get("/get/subscriber", (req, res) => {
    // var sort = { created_at: -1 }
    Subscribe.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Subscribe List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/send-subscriber-email", (req, res) => {
    console.log(req.body)
    Subscribe.findById(req.body.id).then(result => {
        var mailOptions = {
            from: 'no-reply@gmail.com',
            to: result.email,
            subject: 'Couponventures Subscribe',
            text: req.body.text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        return res.status(200).json({
            message: "Mail Send",
            success: true,
            data: {
                restaurant: result
            }
        })
    })
});

router.post("/subscribe", (req, res) => {
    console.log(req.file); 
            var category = new Subscribe({
                email:req.body.email
            })
            category.save().then(resp => {
                var mailOptions = {
                    from: 'no-reply@gmail.com',
                    to: req.body.email,
                    subject: 'Couponventures Subscribe',
                    text: 'Thanks for Contacting Coupon ventures'
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                return res.status(200).json({
                    message: "Subscribe Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        

})

router.get("/get/category", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Category List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/add/category", uploads.fields([{ name: "image", maxcount: 1 },
{ name: "banner_image", maxcount: 1 },]), (req, res) => {
    console.log(req.file); 
    // return false;
        const file = req.file
        if (req.files.image) {
            const fileContent = fs.readFileSync(req.files.image[0].path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()

            const fileContent2 = fs.readFileSync(req.files.banner_image[0].path);
            sharp(fileContent2)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()

            // res.send(file)
            var category = new Categories({
                edit_by: "admin",
                cat_name: req.body.cat_name,
                description: req.body.description,
                status: req.body.status,
                type:req.body.type,
                image: req.files.image[0].filename,
                banner_image: req.files.banner_image[0].filename,
                exclusive:req.body.exclusive
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Category Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.post("/update/category", uploads.fields([{ name: "image", maxcount: 1 },
{ name: "banner_image", maxcount: 1 },]), (req, res) => {
    
    Categories.findById(req.body.id).then(resp => {
        if(req.files.image){
            const fileContent = fs.readFileSync(req.files.image[0].path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.cat_name = req.body.cat_name;
            resp.description = req.body.description;
            resp.type = req.body.type;
            resp.status = req.body.status;
            resp.image= req.files.image[0].filename;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Category Updated",
                    success: true
                })
            });
        }else if(req.files.banner_image){
            const fileContent = fs.readFileSync(req.files.banner_image[0].path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.cat_name = req.body.cat_name;
            resp.description = req.body.description;
            resp.type = req.body.type;
            resp.status = req.body.status;
            resp.banner_image= req.files.banner_image[0].filename;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Category Updated",
                    success: true
                })
            });
        }else if(req.files.banner_image && req.files.image){
            const fileContent = fs.readFileSync(req.files.banner_image[0].path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()

            const fileContent2 = fs.readFileSync(req.files.image[0].path);
            sharp(fileContent2)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.cat_name = req.body.cat_name;
            resp.description = req.body.description;
            resp.type = req.body.type;
            resp.status = req.body.status;
            resp.banner_image= req.files.banner_image[0].filename;
            resp.image= req.files.image[0].filename;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Category Updated",
                    success: true
                })
            });
        }else{
            resp.cat_name = req.body.cat_name;
            resp.description = req.body.description;
            resp.type = req.body.type
            resp.status = req.body.status;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Category Not found",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})


router.post("/add/store", uploads3.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Stores({
                edit_by: "admin",
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                type:req.body.type,
                category_id:parseInt(req.body.category_id),
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Store Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.post("/get/single-store", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    Stores.find({category_id:+req.body.data})
    .populate("category_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Store List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.get("/get/store", (req, res) => {
    // var sort = { created_at: -1 }
    Stores.find()
    .populate("category_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Store List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/update/store", uploads3.single('image'), (req, res) => {
    console.log(req.file)
    Stores.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.type = req.body.type
            resp.status = req.body.status
            resp.image= req.file.filename,
            resp.category_id=parseInt(req.body.category_id)
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Store Updated",
                    success: true
                })
            });
        }else{
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.type = req.body.type
            resp.status = req.body.status;
            resp.category_id=parseInt(req.body.category_id)
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Store Updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})




router.post("/add/exclusive-slider", uploads12.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new ExclusiveSlider({
                edit_by: "admin",
                text: req.body.text,
               status: req.body.status,
                type:req.body.type,
                type_id:req.body.type_id,
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Slider Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/exclusive-slider", (req, res) => {
    // var sort = { created_at: -1 }
    ExclusiveSlider.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Slider List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/exclusive-slider", uploads12.single('image'), (req, res) => {
    console.log(req.file)
    ExclusiveSlider.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.text = req.body.text;
            resp.status = req.body.status;
            resp.image= req.file.filename;
            resp.type = req.body.type;
            resp.type_id = req.body.type_id
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }else{
            resp.text = req.body.text;
            resp.status = req.body.status;
            resp.type = req.body.type;
            resp.type_id = req.body.type_id
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "Not Found",
            success: false,
            data: {}
        });
    });
})




router.post("/add/bottom-slider", uploads11.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new BottomSlider({
                edit_by: "admin",
                text: req.body.text,
                discount:req.body.discount,
                description: req.body.description,
                status: req.body.status,
                type:req.body.type,
                type_id:req.body.type_id,
                link:req.body.link,
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Slider Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/bottom-slider", (req, res) => {
    // var sort = { created_at: -1 }
    BottomSlider.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Slider List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/bottom-slider", uploads11.single('image'), (req, res) => {
    console.log(req.file)
    BottomSlider.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.text = req.body.text;
            resp.discount = req.body.discount;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.image= req.file.filename;
            resp.type = req.body.type;
            resp.type_id = req.body.type_id;
            resp.link = req.body.link
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }else{
            resp.text = req.body.text;
            resp.discount = req.body.discount;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.type = req.body.type;
            resp.type_id = req.body.type_id;
            resp.link = req.body.link
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "Not Found",
            success: false,
            data: {}
        });
    });
})


router.post("/add/slider", uploads4.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Sliders({
                edit_by: "admin",
                text: req.body.text,
                description: req.body.description,
                status: req.body.status,
                type:req.body.type,
                image: req.file.filename,
                link:req.body.link
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Slider Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/slider", (req, res) => {
    // var sort = { created_at: -1 }
    Sliders.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Slider List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/slider", uploads4.single('image'), (req, res) => {
    console.log(req.file)
    Sliders.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.text = req.body.text;
            resp.description = req.body.description;
            resp.status = req.body.status
            resp.image= req.file.filename,
            resp.type = req.body.type
            resp.type_id= req.body.type_id,
            resp.link = req.body.link,
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }else{
            resp.text = req.body.text;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.type = req.body.type
            resp.type_id= req.body.type_id,
            resp.link = req.body.link,
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Slider Updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "Not Found",
            success: false,
            data: {}
        });
    });
})

router.post("/add/featured-today-task", uploads14.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new FeaturedTodayTask({
                edit_by: "admin",
                task_id: req.body.task_id,
                start_date: req.body.start_date,
                expire_date: req.body.expire_date,
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Featured Task Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/featured-today-task", (req, res) => {
    // var sort = { created_at: -1 }
    FeaturedTodayTask.find()
    .populate("task_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Featured Task List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/update/featured-today-task", uploads13.single('image'), (req, res) => {
    
    FeaturedTodayTask.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.task_id = req.body.task_id;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date
            resp.image= req.file.filename
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Featureed Task Updated",
                    success: true
                })
            });
        }else{
            resp.task_id = req.body.task_id;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Featured Task updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})

router.post("/add/featured-deal", uploads13.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new FeaturedDeal({
                edit_by: "admin",
                deal_id: req.body.deal_id,
                start_date: req.body.start_date,
                expire_date: req.body.expire_date,
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Featured Deal Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/featured-deal", (req, res) => {
    // var sort = { created_at: -1 }
    FeaturedDeal.find()
    .populate("deal_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Featured Deal List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/update/featured-deal", uploads13.single('image'), (req, res) => {
    
    FeaturedDeal.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.deal_id = req.body.deal_id;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date
            resp.image= req.file.filename
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Featureed Deal Updated",
                    success: true
                })
            });
        }else{
            resp.deal_id = req.body.deal_id;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Featured Deal updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})


router.route("/add/notitication").post((req, res) => {
    console.log(req.body)
            // res.send(file)
            var category = new Notification({
                title: req.body.title,
                message: req.body.message,
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Notification Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
})

router.route("/update/notitication").post((req, res) => {
    
    Notification.findById(req.body.id).then(resp => {
            resp.title = req.body.title;
            resp.message = req.body.message;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Notification updated",
                    success: true
                })
            });
        
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})

router.get("/get/notification", (req, res) => {
    // var sort = { created_at: -1 }
    Notification.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Notification List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/send/notification", async (req, res) => {
    // console.log(req.body.data);
    var user_data = [];
    await Notification.findById(req.body.id).then(async result => {
        if (req.body.type == 'single') {
            await Users.findById(req.body.user_id).then(async res => {
                if (res) {
                        helper.sendNotificationToUser(req.body.user_id, result.title, result.message);
                }
            })
        } else {
            await Users.find({ "status": "active" }).then(async res => {
                if (res) {
                    for (let k of res) {
                        user_data.push(k.device_token);
                        helper.sendNotificationToAllUser(result.title, result.message);
                    }
                   
                }
            })
        }
        return res.status(200).json({
            message: "Notification Send",
            success: true,
            data: {
                data: result
            }
        })
    }, err => {
        return res.status(200).json({
            message: "Something Went Wrong",
            success: true,
            data: {
                error: err
            }
        })
    })
});

router.post("/add/gift-card", uploads5.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Giftcard({
                edit_by: "admin",
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                image: req.file.filename
            })
            category.save().then(resp => {
                
                return res.status(200).json({
                    message: "Giftcard Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/gift-card", (req, res) => {
    // var sort = { created_at: -1 }
    Giftcard.find()
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Gift card List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/gift-card", uploads5.single('image'), (req, res) => {
    
    Giftcard.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.status = req.body.status
            resp.image= req.file.filename
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Gift card Updated",
                    success: true
                })
            });
        }else{
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Gift card updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})


router.post("/add/coupon", uploads6.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Coupon({
                edit_by: "admin",
                name: req.body.name,
                category_id:+req.body.category_id,
                store_id:+req.body.store_id,
                brand_id:+req.body.brand_id,
                link:req.body.link,
                description: req.body.description,
                status: req.body.status,
                start_date:req.body.start_date,
                expire_date:req.body.expire_date,
                discount:req.body.discount,
                code:req.body.code,
                image: req.file.filename,
                exclusive:req.body.exclusive
            })
            category.save().then(async resp => {
                await helper.sendNotificationToAllUser("New Coupon","Added "+req.body.name+ " New Coupon")
                return res.status(200).json({
                    message: "Coupon Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/coupon", (req, res) => {
    // var sort = { created_at: -1 }
    Coupon.find()
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Coupon List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/coupon", uploads6.single('image'), (req, res) => {
    
    Coupon.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.category_id=+req.body.category_id;
            resp.store_id=+req.body.store_id;
            resp.brand_id=+req.body.brand_id;
            resp.link=req.body.link;
            resp.status = req.body.status;
            resp.image= req.file.filename;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.discount = req.body.discount;
            resp.code = req.body.code;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Gift card Updated",
                    success: true
                })
            });
        }else{
            resp.name = req.body.name;
            resp.description = req.body.description;
            resp.category_id=+req.body.category_id;
            resp.store_id=+req.body.store_id;
            resp.brand_id=+req.body.brand_id;
            resp.link=req.body.link;
            resp.status = req.body.status;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.discount = req.body.discount;
            resp.code = req.body.code;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Gift card updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})


router.post("/add/offer", uploads7.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Offer({
                edit_by: "admin",
                name: req.body.name,
                category_id:+req.body.category_id,
                brand_id:+req.body.brand_id,
                store_id:+req.body.store_id,
                description: req.body.description,
                status: req.body.status,
                start_date:req.body.start_date,
                expire_date:req.body.expire_date,
                discount:req.body.discount,
                link:req.body.link,
                image: req.file.filename,
                exclusive:req.body.exclusive
            })
            category.save().then(async resp => {
                await helper.sendNotificationToAllUser("New Offer","Added "+req.body.name+ " New Offer")
                return res.status(200).json({
                    message: "Offer Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/offer", (req, res) => {
    // var sort = { created_at: -1 }
    Offer.find()
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Offer List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/offer", uploads7.single('image'), (req, res) => {
   
    Offer.findById(+req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.name = req.body.name;
            resp.category_id = +req.body.category_id;
            resp.brand_id = +req.body.brand_id;
            resp.store_id = +req.body.store_id;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.image= req.file.filename;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.discount = req.body.discount;
            resp.link = req.body.link;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Offer Updated",
                    success: true
                })
            });
        }else{
            console.log("res",req.body)
            resp.name = req.body.name;
            resp.category_id=+req.body.category_id;
            resp.store_id=+req.body.store_id;
            resp.brand_id=+req.body.brand_id;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.discount = req.body.discount;
            resp.link = req.body.link;
            resp.exclusive = req.body.exclusive;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Offer updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})

router.get("/get/users", (req, res) => {
    // var sort = { created_at: -1 }
    Users.find()
        // .sort(created_at: -1)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "User List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.route("/changeUser-status").post((req, res) => {
    var status = 'active';
    Users.findById(+req.body.data.user_id).then(user => {
        if(user.status === 'pending'){
            status = 'active';
        }else if (user.status === 'inactive'){
            status = 'active';
        }else{
            status = 'inactive';
        }
        user.status = status;
        user.save().then(resp => {
            return res.status(200).json({
                message: "Change Status",
                success: true,
                data: {
                    user:resp
                }
            })
        })
        
    }, err => {
        return res.status(200).json({
            message: message(lang, "something_went_wrong"),
            success: false,
            data: {
                error: err
            }
        })
    })
})

router.route("/add-wallet-amount").post((req, res) => {
    var status = 'active';
    console.log(req.body.data)
    WalletAmount.findOne({"user_id":req.body.data.user_id}).then(wallet => {
        console.log(wallet)
        if(wallet){
            if(req.body.data.amount_type == 'increase'){
                wallet.amount+= parseInt(req.body.data.amount);
            }else{
                wallet.amount = wallet.amount-req.body.data.amount;
            }
            wallet.save().then(resp => {
                var walletHitory = new WalletHistory({
                    user_id: req.body.data.user_id,
                    amount: req.body.data.amount,
                    total_amount:req.body.data.amount,
                    type:"Admin amount",
                    message:"Admin "+req.body.data.amount_type+ " ₹"+req.body.data.amount
                })
                walletHitory.save()
                return res.status(200).json({
                    message: "Amount saved",
                    success: true,
                    
                })
            })
        }else{
            var wallet = new WalletAmount({
                user_id: req.body.data.user_id,
                amount:req.body.data.amount,
                // amount:user.point/100000,
                type:"Admin added"
            })
            wallet.save()
            var walletHitory = new WalletHistory({
                user_id: req.body.data.user_id,
                amount: req.body.data.amount,
                total_amount:req.body.data.amount,
                type:"Admin amount",
                message:"Admin "+req.body.data.amount_type+ " ₹"+req.body.data.amount
            })
            walletHitory.save()
            return res.status(200).json({
                message: "Amount saved",
                success: true,
                
            })
        }
        
        
    }, err => {
        return res.status(200).json({
            message: message(lang, "something_went_wrong"),
            success: false,
            data: {
                error: err
            }
        })
    })
})



router.post("/add/brand", uploads8.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var brand = new Brand({
                edit_by: "admin",
                brand_name: req.body.brand_name,
                category_id:+req.body.category_id,
                store_id:+req.body.store_id,
                description: req.body.description,
                status: req.body.status,
                image: req.file.filename
            })
            brand.save().then(resp => {
                
                return res.status(200).json({
                    message: "Brand Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.post("/get/single-brand", (req, res) => {
    // var sort = { created_at: -1 }
    Brand.find({category_id:+req.body.category_id, store_id:+req.body.store_id})
    .populate("category_id")
    .populate("store_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Brand List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.get("/get/brand", (req, res) => {
    // var sort = { created_at: -1 }
    Brand.find()
    .populate("category_id")
    .populate("store_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Brand List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.post("/update/brand", uploads8.single('image'), (req, res) => {
    
    Brand.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.brand_name = req.body.brand_name;
            resp.description = req.body.description;
            resp.category_id = +req.body.category_id;
            resp.store_id = +req.body.store_id;
            resp.status = req.body.status;
            resp.image= req.file.filename
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Brand Updated",
                    success: true
                })
            });
        }else{
            resp.brand_name = req.body.brand_name;
            resp.description = req.body.description;
            resp.category_id = +req.body.category_id;
            resp.store_id = +req.body.store_id;
            resp.type = req.body.type
            resp.status = req.body.status;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Brand updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})

router.post("/add/deal", uploads9.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var deal = new Deal({
                edit_by: "admin",
                title:req.body.title,
                category_id: +req.body.category_id,
                store_id: +req.body.store_id,
                brand_id: +req.body.brand_id,
                link:req.body.link,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                price: +req.body.price,
                discount:req.body.discount,
                discount_type:req.body.discount_type,
                description: req.body.description,
                status: req.body.status,
                image: req.file.filename,
                exclusive:req.body.exclusive,
                hot_deal:req.body.hot_deal
            })
            deal.save().then(async resp => {
                await helper.sendNotificationToAllUser("New Deal","Added "+req.body.title+ " New Deal")
                return res.status(200).json({
                    message: "Deal Added",
                    success: true,
                    data: {
                        deal: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})

router.get("/get/deal", (req, res) => {
    // var sort = { created_at: -1 }
    Deal.find()
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Deal List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})

router.post("/update/deal", uploads9.single('image'), (req, res) => {
    
    Deal.findById(req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.title = req.body.title;
            resp.category_id = req.body.category_id;
            resp.store_id = req.body.store_id;
            resp.brand_id = req.body.brand_id;
            resp.start_date = req.body.start_date;
            resp.link = req.body.link;
            resp.end_date = req.body.end_date;
            resp.price = req.body.price;
            resp.discount = req.body.discount;
            resp.discount_type = req.body.discount_type;
            resp.price = req.body.price;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.exclusive = req.body.exclusive;
            resp.image= req.file.filename;
            resp.hot_deal= req.body.hot_deal;
            
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Deal Updated",
                    success: true
                })
            });
        }else{
            resp.title = req.body.title;
            resp.category_id = req.body.category_id;
            resp.store_id = req.body.store_id;
            resp.brand_id = req.body.brand_id;
            resp.start_date = req.body.start_date;
            resp.link = req.body.link;
            resp.end_date = req.body.end_date;
            resp.price = req.body.price;
            resp.discount = req.body.discount;
            resp.discount_type = req.body.discount_type;
            resp.price = req.body.price;
            resp.description = req.body.description;
            resp.exclusive = req.body.exclusive;
            resp.status = req.body.status;
            resp.hot_deal= req.body.hot_deal;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Deal updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})


router.post("/add/task", uploads10.single('image'), (req, res) => {
    console.log(req.file); 
        const file = req.file
        if (file) {
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            // res.send(file)
            var category = new Task({
                edit_by: "admin",
                name: req.body.name,
                category_id:+req.body.category_id,
                brand_id:+req.body.brand_id,
                store_id:+req.body.store_id,
                description: req.body.description,
                status: req.body.status,
                start_date:req.body.start_date,
                expire_date:req.body.expire_date,
                point:req.body.point,
                link:req.body.link,
                button_name:req.body.button_name,
                image: req.file.filename
            })
            category.save().then(async resp => {
                await helper.sendNotificationToAllUser("New Task","Added "+req.body.name+ " New Task")
                return res.status(200).json({
                    message: "Task Added",
                    success: true,
                    data: {
                        restaurant: resp
                    }
                })
            }, err => {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {
                        error: err
                    }
                })
            })
        }

})


router.post("/update/task", uploads10.single('image'), (req, res) => {
   
    Task.findById(+req.body.id).then(resp => {
        if(req.file){
            const fileContent = fs.readFileSync(req.file.path);
            sharp(fileContent)
            // .resize(600, 600),
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                width: 600,
                height: 600,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            }).toBuffer()
            resp.name = req.body.name;
            resp.category_id = +req.body.category_id;
            resp.brand_id = +req.body.brand_id;
            resp.store_id = +req.body.store_id;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.image= req.file.filename;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.point = req.body.point;
            resp.link = req.body.link;
            resp.button_name = req.body.button_name;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Task Updated",
                    success: true
                })
            });
        }else{
            
            console.log("res",req.body)
            resp.name = req.body.name;
            resp.category_id=+req.body.category_id;
            resp.store_id=+req.body.store_id;
            resp.brand_id=+req.body.brand_id;
            resp.description = req.body.description;
            resp.status = req.body.status;
            resp.start_date = req.body.start_date;
            resp.expire_date = req.body.expire_date,
            resp.point = req.body.point;
            resp.link = req.body.link;
            resp.button_name = req.body.button_name;
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Task updated",
                    success: true
                })
            });
        }
        
    }, err => {
        return res.status(200).json({
            message: "No Record found",
            success: false,
            data: {}
        });
    });
})

router.get("/get/task", (req, res) => {
    // var sort = { created_at: -1 }
    Task.find()
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Task List",
                    success: true,
                    data: {
                        category: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: false,
                data: {
                    error: err
                }
            })
        })
})


router.get("/get/allData", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    Promise.all([
        Users.countDocuments(),
        Users.countDocuments({"created_at":{"$gte":new Date()}}),
        Task.countDocuments(),
        Offer.countDocuments(),
        
    ]).then(d => {
        // console.log(d)
        const [users, new_user, task, offer] = d;
        return res.status(200).json({
            message: "Data list",
            success: true,
            users: users,
            new_user:new_user,
            task: task,
            offer: offer
        })
    }, err => {
        return res.status(200).json({
            message: "Something went wrong",
            success: true,
            data: {
                error: err
            }
        })
    })
});

router.get("/get/user-group", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    Usergroup.find()
        .exec((req, cat) => {
            if (cat) {
                return res.status(200).json({
                    message: "User Goupd List",
                    success: true,
                    data: {
                        billing: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "Something went wrong",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        })
});

router.post("/add/user-group", (req, res) => {
    // console.log(req.body.data);
    var lang = req.headers.lang ? req.headers.lang : "kh";
    Usergroup.findOne({ group_name: { '$regex': req.body.data.group_name, $options: 'i' }, })
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Group Name already exist",
                    success: false,
                    data: {
                    }
                })
            } else {
                var optt = new Usergroup({
                    group_name: req.body.data.group_name,
                    description: req.body.data.description,
                    page_name: ["Dashboard","Users","Slider","Bottom Slider","Exclusive Slider","Category","Store","Brand","Gift Card", "Coupon", "Offer", "Deal", "Today Task", "Report", "User Management","User Role Management", "Featured Today Task", "Featured Deal","View Subscriber","Notification"],
                    status: req.body.data.status,
                    description: req.body.data.description
                });
                optt.save().then(opt => {
                    return res.status(200).json({
                        message: "Sucess",
                        success: true,
                        data: {
                            billing: optt
                        }
                    })
                }, err => {
                    return res.status(200).json({
                        message: "Something went wrong",
                        success: true,
                        data: {
                            error: err
                        }
                    })
                });
            }
        })

})

router.post("/update/user-group", (req, res) => {
    // console.log(req.body.data);
    Usergroup.findById(req.body.data.id).then(promo => {
        promo.group_name = req.body.data.group_name,
            promo.description = req.body.data.description,
            promo.status = req.body.data.status
        promo.save().then(resp => {
            return res.status(200).json({
                message: "Status updated successfully",
                success: true,
                data: {
                    promocode: promo
                }
            })
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        });
    }, err => {
        return res.status(200).json({
            message: "Something went wrong",
            success: true,
            data: {
                error: err
            }
        })
    })

})


router.get("/get/active-user-group", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    Usergroup.find({ status: "Active", group_name: { $ne: "Admin" } })
        .exec((req, cat) => {
            if (cat) {
                return res.status(200).json({
                    message: "Product List",
                    success: true,
                    data: {
                        billing: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record Found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        })
});


router.post("/add/user-permission", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    var Arr = [];
    var newArr = []
    var type = req.body.data.type;
    var value = req.body.data.value;
    Arr.push(req.body.data.value);
    Usergroup.findOne({ group_name: req.body.data.name }).exec((req, result) => {
        if (type === 'add') {
            if (result.assign_module != null) {
                result.assign_module = result.assign_module.concat(Arr);
            } else {
                result.assign_module = Arr
            }
        } else {
            // console.log("asdf",result.assign_module)
            newArr = result.assign_module.filter(function (item) {
                // console.log(item)
                return item !== value
            })
            // console.log(newArr)
            result.assign_module = newArr;

        }
        // return false;
        result.save().then(opt => {
            return res.status(200).json({
                message: "Success",
                success: true,
                data: {
                    billing: opt
                }
            })
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        });
    })


})

router.post("/add/user", (req, res) => {
    var token = req.headers.token;
    Admins.findOne({ email: req.body.data.email }).then(d => {
        if (d) {
            return res.status(200).json({
                message: "Email already exist",
                success: true,
                data: {
                }
            })
        } else {
            bcrypt.hash(req.body.data.password, 10, (err, hash) => {
                var subadmiin = new Admins({
                    name: req.body.data.user_name,
                    email: req.body.data.email,
                    position: req.body.data.position,
                    role: req.body.data.role,
                    password: hash,
                    status: req.body.data.status
                })
                subadmiin.save().then(de => {
                    return res.status(200).json({
                        message: "User added successfully.",
                        success: true,
                        data: {
                            billing: de
                        }
                    })
                }, err => {

                    return res.status(200).json({
                        message: "Something went wrong",
                        success: true,
                        data: {
                            error: err
                        }
                    })
                })
            })
        }
    }, err => {
        return res.status(200).json({
            message: "Something went wrong",
            success: true,
            data: {
                error: err
            }
        })
    })

})

router.get("/get/admin-user", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    Admins.find({ name: { $ne: "admin" } })
        .populate("role")
        .exec((req, cat) => {
            if (cat) {
                return res.status(200).json({
                    message: "Product List",
                    success: true,
                    data: {
                        billing: cat
                    }
                })
            } else {
                return res.status(200).json({
                    message: "No Record Found",
                    success: false,
                    data: {}
                })
            }
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        })
});

router.post("/update/user", (req, res) => {
    // console.log(req.body.data);
    Admins.findById(req.body.data.id).then(promo => {
        promo.name = req.body.data.user_name,
            promo.email = req.body.data.email,
            promo.position = req.body.data.position,
            promo.role = req.body.data.role,
            promo.status = req.body.data.status
        promo.save().then(resp => {
            return res.status(200).json({
                message: "Updated successfully",
                success: true,
                data: {
                    promocode: promo
                }
            })
        }, err => {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
                data: {
                    error: err
                }
            })
        });
    }, err => {
        return res.status(200).json({
            message: "Something went wrong",
            success: true,
            data: {
                error: err
            }
        })
    })

})

router.get("/get/single-staff", (req, res) => {
    var lang = req.headers.lang ? req.headers.lang : "kh";
    user_auth.verifyJWTToken(req.headers.token).then(tkn => {
        // console.log(tkn.admin)
        Admins.findById(tkn.admin._id)
            .populate("role")
            .exec((req, cat) => {
                if (cat) {
                    return res.status(200).json({
                        message: "User List",
                        success: true,
                        data: {
                            billing: cat
                        }
                    })
                } else {
                    return res.status(200).json({
                        message: "No Rcord Found",
                        success: false,
                        data: {}
                    })
                }
            }, err => {
                return res.status(200).json({
                    message: message(lang, "something_went_wrong"),
                    success: true,
                    data: {
                        error: err
                    }
                })
            })
    }, err => {
        return res.status(200).json({
            message: message(lang, "something_went_wrong"),
            success: true,
            data: {
                error: err
            }
        })
    })
});
module.exports = router;