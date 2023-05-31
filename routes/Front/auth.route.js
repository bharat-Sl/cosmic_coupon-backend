import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import multer from "multer";
import Admins from "../../models/Admins";
import Categories from "../../models/Categories";
import Stores from "../../models/Stores";
import Sliders from "../../models/Sliders";
import Giftcard from "../../models/Giftcard";
import Coupon from "../../models/Coupon";
import Offer from "../../models/Offer";
import Deal from "../../models/Deal";
import * as helper from "../../libs/common";
import Users from "../../models/Users";
import Brand from "../../models/Brand";
import Recharge from "../../models/Recharge";
import Task from "../../models/Task";
import Subscribe from "../../models/Subscribe";
import CompletedTask from "../../models/CompletedTask";
import UsedCoupon from "../../models/UsedCoupon";
import ViewDeal from "../../models/ViewDeal";
import ViewOffer from "../../models/ViewOffer";
import WalletAmount from "../../models/Wallet-amount";
import WalletHistory from "../../models/Wallet-history";
import FeaturedDeal from "../../models/FeaturedDeal";
import FeaturedTask from "../../models/FeaturedTodayTask";
import { verifyJWTToken } from "../../libs/user_auth";
import * as user_auth from "../../libs/user_auth";
require("dotenv").config();
import bcrypt from "bcrypt";
import fs from "fs-extra";
import BottomSlider from "../../models/BottomSlider";
import ExclusiveSlider from "../../models/ExclusiveSlider";
import { start } from "repl";
import FeaturedTodayTask from "../../models/FeaturedTodayTask";
const sharp = require('sharp');
var request = require('request');
// import fs from "fs-extra";
const DIR10 = "./uploads/admin/users/";
let storage2 = multer.diskStorage({
    destination: DIR10,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let uploads = multer({
    storage: storage2
});
// router.get("/get/category/featured", (req, res) => {
    router.get("/tracking", (req, res) => {
    console.log("Tracking",req.query)
    if(req.query.userid && req.query.offerid){
        CompletedTask.findOne({"user_id":req.query.userid, "offerid":req.query.offerid}).then(task => {
            if(!task){
                var user = new CompletedTask({
                    user_id: +req.query.userid,
                    offer_id: +req.query.offerid,
                    status:"completed",
                })
                user.save().then(async rr => {
                    
                    var point = await getTaskPoint(req.query.offerid)
                   
                    await helper.sendNotificationToUser(req.query.userid, "Task Completed","Congratulation You Earn "+point+" points in your wallet")
                   await Users.findById(req.query.userid).then(us => {
                        us.point += point;
                        us.save()
                    })
                    return res.status(200).json({
                        message: "Task Completed",
                        success: true,
                        data: req.query
                    })
                })
                
            }else{
                return res.status(200).json({
                    message: "Already completed",
                    success: true,
                    data: req.query
                })
            }
        })
        
    }
    
    
})

async function getTaskPoint(id) {
    return new Promise((resolve, reject) => {
        Task.findById(id).then(task => {
            resolve(task.point);
        })
    })
}

function sendOTP(mobile, message){
    console.log("Adsfasf");
    var url = "http://sms.smsindori.com/http-api.php?";
    // var url = "https://login.easywaysms.com/app/smsapi/index.php?";
    request(`${url}username=Pramodsir&password=12345&senderid=CVENTU&route=06&number=${mobile}&message=${message}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage. 
    }
    else {
        console.log("Error "+response.statusCode)
    }
      
    })
}

router.route("/signup").post((req, res) => {
    var otp = Math.floor(1000 + Math.random() * 9000);
    var mobile_number = (+req.body.data.mobile).toString();
    var message = 'Your Couponventures Verify OTP is '+otp;
    
    Users.findOne({ "mobile": mobile_number }).then(user => {
        if(user){
            return res.status(200).json({
                message: "Phone number already exist",
                success: false,
                data: {}
            })
        }
        if (req.body.data.upline_code) {
            Users.findOne({ "referal_code": req.body.data.upline_code }).then(u => {
                console.log(u)
                if (!u) {
                    return res.status(200).json({
                        message: "Invalid Referal Code",
                        success: false,
                        data: {}
                    })
                }else{
                    var msg = sendOTP(req.body.data.mobile, message);
                    console.log("msg",msg);
                    return res.status(200).json({
                        message: "User registered",
                        success: true,
                        data: {
                            mobile:req.body.data.mobile,
                            otp:otp,
                            name:req.body.data.name
                        }
                    }) 
                }
            })

        }else{
            var msg = sendOTP(req.body.data.mobile, message);
                    console.log("msg",msg);
            return res.status(200).json({
                message: "User registered",
                success: true,
                data: {
                    mobile:req.body.data.mobile,
                    otp:otp,
                    name:req.body.data.name
                }
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

router.route("/verify-otp").post((req, res) => {
    console.log(req.body)
    var user = new Users({
        name: req.body.data.name,
        mobile: req.body.data.mobile,
        otp: req.body.data.otp,
        status:"active",
        registered_via:req.body.data.registered_via,
        point:10,
        upline_code:req.body.data.upline_code,
        device_token:req.body.data.device_token,
        referal_code:Math.random(req.body.data.mobile).toString(36).slice(6)
    })
    user.save().then(resp => {
        
        return res.status(200).json({
            message: "User Added",
            success: true,
            data: {
                data:user,
                token: jwt.sign({ user: user }, process.env.SECRET_JWT_KEY),
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


router.route("/login").post((req, res) => {
    var mobile_number = (+req.body.data.mobile).toString();
    var otp = Math.floor(1000 + Math.random() * 9000);
    var message = 'Couponventures: ' +otp+ ' is your OTP to register yourself on Couponventures Recharge & Bill Payment App. www.couponventures.in';
    var wlt=[]
    Users.findOne({ "mobile": mobile_number }).then(user => {
        
        if(!user){
            return res.status(200).json({
                message: "user not found",
                success: false,
                data: {}
            })
        }else{
            user.otp = otp;
            user.save().then(async rr => {
                await sendOTP(req.body.data.mobile, message);
                WalletAmount.findOne({"user_id":user._id}).select("amount").then( wallet => {
                    return res.status(200).json({
                        message: "Send OTP",
                        success: true,
                        data: {
                            user:user,
                            wallet:wallet
                        }
                    }) 
                })
                // console.log("msg",msg);
                
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

router.route("/verify-login-otp").post((req, res) => {
    console.log(req.body)
    Users.findOne({"mobile":req.body.data.mobile, "otp":req.body.data.otp}).then(user => {
        if(user){
            user.otp = null;
            user.device_token=req.body.data.device_token,
            user.save().then(rr => {
                WalletAmount.findOne({"user_id":user._id}).select("amount").then( wallet => {
                    return res.status(200).json({
                        message: "Loggedin",
                        success: true,
                        data: {
                            token: jwt.sign({ user: user }, process.env.SECRET_JWT_KEY),
                            user:user,
                            wallet:wallet
                        }
                    })
                })
                
            })
        }else{
            return res.status(200).json({
                message: "Invalid OTP",
                success: false,
                data: {
                    
                }
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

router.route("/gmail-login").post((req, res) => {
    
    Users.findOne({ "email": req.body.data.email }).then(user => {
        if(!user){
            var user = new Users({
                name: req.body.data.name,
                social_id: req.body.data.social_id,
                email:req.body.data.email,
                status:"active",
                registered_via:req.body.data.registered_via ? req.body.data.registered_via : 'web',
                login_via:"gmail",
                point:100,
                profile_picture:req.body.data.profile_picture,
                referal_code:Math.random(req.body.data.mobile).toString(36).slice(6)
            })
            user.save().then(async resp => {
               await WalletAmount.findOne({"user_id":resp._id}).select("amount").then( wallet => {
                    return res.status(200).json({
                        message: "Loggedin",
                        success: true,
                        data: {
                            token: jwt.sign({ user: resp }, process.env.SECRET_JWT_KEY),
                            user:resp,
                            wallet:wallet
                        }
                    }) 
                })
                
            })
        }else{
            
            return res.status(200).json({
                message: "Loggedin",
                success: true,
                data: {
                    token: jwt.sign({ user: user }, process.env.SECRET_JWT_KEY),
                    user:user
                }
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

router.route("/facebook-login").post((req, res) => {
    Users.findOne({ "social_id": req.body.data.social_id }).then(user => {
        if(!user){
            var user = new Users({
                name: req.body.data.name,
                social_id: req.body.data.social_id,
                status:"active",
                registered_via:req.body.data.registered_via ? req.body.data.registered_via : 'web',
                login_via:"facebook",
                point:100,
                profile_picture:req.body.data.profile_picture,
                referal_code:Math.random(req.body.data.mobile).toString(36).slice(6)
            })
            user.save().then(async resp => {
               await WalletAmount.findOne({"user_id":resp._id}).select("amount").then( wallet => {
                    return res.status(200).json({
                        message: "Loggedin",
                        success: true,
                        data: {
                            token: jwt.sign({ user: resp }, process.env.SECRET_JWT_KEY),
                            user:resp,
                            wallet:wallet
                        }
                    })
                })
                 
            })
        }else{
            
            return res.status(200).json({
                message: "Loggedin",
                success: true,
                data: {
                    token: jwt.sign({ user: user }, process.env.SECRET_JWT_KEY),
                    user:user
                }
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


router.route("/redeem/point").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    Users.findById(tkn.user._id).then(async user => {
       await WalletAmount.findOne({"user_id":tkn.user._id}).then(wallet => {
        console.log(user.point)
            if(wallet){
                wallet.amount+= user.point/1000
                // wallet.amount+= 100
                wallet.save()
            }else{
                var wallet = new WalletAmount({
                    user_id: tkn.user._id,
                    // amount:100,
                    amount:user.point/1000,
                    type:req.body.type
                })
                wallet.save()
            }
        })
        
        user.point = 0;
        user.save().then(resp => {
        
            return res.status(200).json({
                message: "Point Redeem successfully",
                success: true,
                data: {
                    data:user
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
    
}, err => {
    return res.status(401).json({
        message: message(lang, "session_expired"),
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.get("/get/category/latest", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"latest"})
        // .sort(sort)
        .limit(26)
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

router.get("/get/category/featured", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"featured"})
        // .sort(sort)
        .limit(26)
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


router.get("/get/all-category", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active"})
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

router.post("/get/all-filter-category", (req, res) => {
    // var sort = { created_at: -1 }
    console.log(req.body)
    if(req.body.data.type != null && req.body.data.type != 'All'){
        var match = { "status": "active", "cat_name": {$regex: '^' + req.body.data.type, $options: 'i'} };
    }else{
        var match = {"status":"active"};
    }
    console.log(match)
    Categories.find(match)
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



router.post("/get/all-filter-store", (req, res) => {
    // var sort = { created_at: -1 }
    console.log(req.body)
    if(req.body.data.type != null && req.body.data.type != 'All'){
        var match = { "status": "active", "name": {$regex: '^' + req.body.data.type, $options: 'i'} };
    }else{
        var match = {"status":"active"};
    }
    console.log(match)
    Stores.find(match)
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


router.post("/get/search-data", (req, res) => {
    // var sort = { created_at: -1 }
    console.log(req.body)
    var match = { "status": "active", "cat_name": { $regex: req.body.data, $options: 'i' }  };
    var match2 = { "status": "active", "name": { $regex: req.body.data, $options: 'i' } };
    Promise.all([
        Categories.find({ $or: [match, match2] }),
        Stores.find({ $or: [match, match2] })
        .populate("category_id")
    ]).then(resutl => {
        const[category, store] = resutl;
        // console.log(store)
        return res.status(200).json({
            message: "Home list",
            success: true,
            data: {
                category: category,
                store:store
            }
        })
    })
 
})

router.get("/get/category/trending", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"trending"})
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

router.get("/get/category/travel", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"travel"})
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

router.get("/get/category/fashion", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"fashion"})
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

router.get("/get/category/recharge", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"recharge"})
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

router.get("/get/category/food", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"food"})
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

router.get("/get/category/electronics", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"electronics"})
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

router.get("/get/category/others", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"others"})
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

router.get("/get/category/popular", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":"popular"})
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

router.get("/get/all-category", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active"})
    .populate("store_id")
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

router.get("/get/all-brand", (req, res) => {
    // var sort = { created_at: -1 }
    Brand.find({"status":"active"})
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

router.get("/get/all-store", (req, res) => {
    // var sort = { created_at: -1 }
    Stores.find({"status":"active"})
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

router.get("/get/latest-store", (req, res) => {
    var sort = { created_at: -1 }
    Stores.find({"status":"active", "type":'latest'})
    // .sort(sort)
        .limit(26)
    .populate("category_id")
        
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

router.get("/get/popular-store", (req, res) => {
    // var sort = { created_at: -1 }
    Stores.find({"status":"active", "type":'popular'})
    .populate("category_id")
        // .sort(sort)
        .limit(26)
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

router.get("/get/trending-store", (req, res) => {
    // var sort = { created_at: -1 }
    Stores.find({"status":"active", "type":'trending'})
    .populate("category_id")
        // .sort(sort)
        .limit(26)
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


router.get("/get/featured-store", (req, res) => {
    // var sort = { created_at: -1 }
    Stores.find({"status":"active", "type":'featured'})
    .populate("category_id")
    .limit(26)
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

router.get("/get/brand", (req, res) => {
    // var sort = { created_at: -1 }
    Brand.find({"status":"active"})
    .populate("category_id")
    .limit(5)
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
async function getTodayCompltedTask(user_id) {
    return new Promise((resolve, reject) => {
        CompletedTask.find({"user_id":user_id})
        .then(task => {
            resolve(task);
        })
    })
}

router.get("/get/user-detail", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        Promise.all([
            Users.findById(tkn.user._id),
            WalletAmount.findOne({"user_id":tkn.user._id}),
        ]).then(result => {
            var [user_detail, Wallet_amount] = result;
            return res.status(200).json({message:"Detail get Successfull",success:true, data: {user_detail, Wallet_amount}})
        })
    }, err => {
        return res.status(401).json({
            message: "Session Expired",
            success: false,
            data: {
                error: err
            }
        })
    })
})

router.get("/my-account", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        Promise.all([
            Users.findById(tkn.user._id),
            WalletAmount.findOne({"user_id":tkn.user._id}),
            CompletedTask.find({'user_id':tkn.user._id}).select("amount"),
            ViewOffer.find({"user_id":tkn.user._id}),
            Task.find({"status":"active"})
            .populate("category_id")
            .populate("store_id")
            .populate("brand_id"),
            UsedCoupon.find({"user_id":tkn.user._id}),
            ViewDeal.find({"user_id":tkn.user._id})
            .populate("deal_id"),
            CompletedTask.find({'user_id':tkn.user._id})
            .populate("offer_id")
            .populate("user_id"),
            WalletHistory.find({"user_id":tkn.user._id}),
            Recharge.find({"user_id":tkn.user._id})
        ]).then(result => {
            var [user_detail, Wallet_amount,Completed_task, View_Offer, Total_Task, Used_Coupon, View_Deal, Today_Activity, Wallet_History, Recharge_history ] = result;
            return res.status(200).json({
                message: "Home list",
                success: true,
                
                    data: [
                    {user_detail, "type":"user_detail" },
                    {Wallet_amount, "type":"Wallet_amount" },
                    {Completed_task, "type":"Completed_task"},
                    {View_Offer, "type":"Saved_offer"},
                    {Total_Task, "type":"Today_task"},
                    {Used_Coupon, "type":"Coupon_saved"},
                    {View_Deal, "type":"Deal_saved"},
                    {Today_Activity, "type":"Today_Activity"},
                    {Wallet_History, "type":"Wallet_History"},
                    {Recharge_history,"type":"Recharge_history"}
                                        ]
               
            })
        })
    }, err => {
        return res.status(401).json({
            message: "Session Expired",
            success: false,
            data: {
                error: err
            }
        })
    })
})

router.get("/get/login-user", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        console.log(tkn)
        Users.findById(tkn.user._id)
            .then(async cat => {
                if (cat) {
                    var compltedTodayTask = await getTodayCompltedTask(tkn.user._id);
                    return res.status(200).json({
                        message: "User List",
                        success: true,
                        data: {
                            category: cat,
                            compltedTodayTask:compltedTodayTask
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
    }, err => {
        return res.status(401).json({
            message: message(lang, "session_expired"),
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.get("/get/completed-task", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        console.log(tkn)
        CompletedTask.find({'user_id':tkn.user._id})
        .populate("offer_id")
        .populate("user_id")
            .then(async cat => {
                if (cat) {
                    return res.status(200).json({
                        message: "Task List",
                        success: true,
                        data: {
                            category: cat,
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
    }, err => {
        return res.status(401).json({
            message: message(lang, "session_expired"),
            success: false,
            data: {
                error: err
            }
        })
        })
})


router.get("/get/wallet-amount", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        console.log(tkn)
        WalletAmount.findOne({"user_id":tkn.user._id})
            .then(async cat => {
                if (cat) {
                    return res.status(200).json({
                        message: "Wallet List",
                        success: true,
                        data: {
                            category: cat,
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
    }, err => {
        return res.status(401).json({
            message: message(lang, "session_expired"),
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.get("/get/feature-deal", (req, res) => {
    // var sort = { created_at: -1 }
    FeaturedDeal.findOne()
    .populate("deal_id")
        // .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Feature List",
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

router.get("/get/slider", (req, res) => {
    // var sort = { created_at: -1 }
    Sliders.find({"status":"active"})
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

router.get("/get/bottom-slider", (req, res) => {
    // var sort = { created_at: -1 }
    BottomSlider.find({"status":"active"})
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

router.get("/get/coupon", (req, res) => {
    // var sort = { created_at: -1 }
    Coupon.find({"status":"active"})
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

router.get("/get/offer", (req, res) => {
    // var sort = { created_at: -1 }
    Offer.find({"status":"active"})
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

router.get("/get/deal", (req, res) => {
    // var sort = { created_at: -1 }
    Deal.find({status:"active"})
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


router.post("/update/user-image", uploads.single('image'), (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(tkn => {
        console.log(req.file)
    Users.findById(tkn.user._id).then(resp => {
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
            resp.profile_picture= req.file.filename
            
            resp.save().then(resp => {
                return res.status(200).json({
                    message: "Image Updated",
                    data: {
                        profile_picture:"https://www.couponventures.in/uploads/admin/users/"+req.file.filename,
                    },
                   
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
}, err => {
    return res.status(401).json({
        message: "Token Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.get("/get/task", (req, res) => {
    // var sort = { created_at: -1 }
    Task.find({status:"active"})
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

router.get("/get/offer", (req, res) => {
    // var sort = { created_at: -1 }
    Offer.find({status:"active"})
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

router.route("/check/electricity-bill").post((req, res) => {
    console.log(req.body)
    var txid = (new Date()).getTime()
    // var url = "https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number;
    request("https://mobilerechargenow.com/api/bill-fetch.php?username=G263802891&apikey=4688691946&format=json&no="+req.body.phone_number+"&operator="+req.body.operator+"&txnid="+txid, function (error, response, body) {
        console.log(response)
            return res.status(200).json({
                message: "Recharge Operator",
                success: true,
                data: JSON.parse(body)
                
            })
        
    });
})


router.route("/recharge/check-operator").post((req, res) => {
    console.log(req.body)
    // var url = "https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number;
    request("https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Recharge Operator",
                success: true,
                data: {
                    circle: dd.circle,
                    operator:dd.operator
                }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
})

router.route("/recharge/get/dth-plans").post((req, res) => {
    console.log("req.body.data",req.body.data)
    // var url = "https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number;
    request(`https://mobilerechargenow.com/dth-plan.php?username=G263802891&apikey=4688691946&circle=${req.body.data.circle}&operator=${req.body.data.operator}&type=${req.body.data.type}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(dd) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Recharge Operator",
                success: true,
                data : {
                    details: JSON.parse(body)
                }
                
                // data: {
                //     details:JSON.parse(body)
                // }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
})

router.route("/recharge/get-plans").post((req, res) => {
    console.log("req.body.data",req.body.data)
    // var url = "https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number;
    request(`https://mobilerechargenow.com/recharge-plan.php?username=G263802891&apikey=4688691946&circle=${req.body.data.circle}&operator=${req.body.data.operator}&type=${req.body.data.type}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(dd) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Recharge Operator",
                success: true,
                data : {
                    details: JSON.parse(body)
                }
                
                // data: {
                //     details:JSON.parse(body)
                // }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
})


router.route("/electricity-recharge").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        var transaction_id = (new Date()).getTime()
        console.log("req.bod",req.body.data);
        if(req.body.data.payment_mode === 'online'){
            request(`https://mobilerechargenow.com/billpay/payment.php?username=G263802891&apikey=4688691946&type=${req.body.data.type}&format=json&no=${req.body.data.phone_number}&amount=${req.body.data.amount}&operator=${req.body.data.operator}&txnid=${transaction_id}`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var dd = JSON.parse(body);
                    if(dd.status == "SUCCESS"){
                        helper.sendNotificationToUser(tkn.user._id, "Bill Pay Successfully","₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number)
                    }
                    console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
                    // return body;
                    var recharge = new Recharge({
                        user_id:tkn.user._id,
                        amount:req.body.data.amount,
                        mobile_number:req.body.data.phone_number,
                        transaction_id:dd.TransId,
                        order_id:transaction_id,
                        payment_mode:"online",
                        payment_id:req.body.data.payment_id,
                        operator:req.body.data.operator,
                        circle:req.body.data.circle,
                        recharge_type:req.body.data.type,
                        status:dd.status,
                        message:dd.resText
                    })
                    recharge.save().then(async rr => {
                        return res.status(200).json({
                            message: dd.resText,
                            success: dd.status,
                            data: {
                                details:dd
                            }
                        })
                    })
                    
                }
                else {
                    console.log("Error "+response.statusCode)
                }
        });
        }else{
        await WalletAmount.findOne({"user_id":tkn.user._id}).then(user => {
            // console.log("user",user);
            if(user && user.amount > req.body.data.amount){
                request(`https://mobilerechargenow.com/billpay/payment.php?username=G263802891&apikey=4688691946&type=${req.body.data.type}&format=json&no=${req.body.data.phone_number}&amount=${req.body.data.amount}&operator=${req.body.data.operator}&txnid=${transaction_id}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var dd = JSON.parse(body);
                if(dd.status == "SUCCESS"){
                    user.amount = user.amount-req.body.data.amount
                    user.save();
                    var walletHitory = new WalletHistory({
                        user_id: tkn.user._id,
                        amount: req.body.data.amount,
                        txn_fee:0,
                        total_amount:req.body.data.amount,
                        type:"Recharge",
                        message:"₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number
                    })
                    walletHitory.save()
                    helper.sendNotificationToUser(tkn.user._id, "Bill Pay Successfully","₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number)
                }
                console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
                // return body;
                var recharge = new Recharge({
                    user_id:tkn.user._id,
                    amount:req.body.data.amount,
                    mobile_number:req.body.data.phone_number,
                    transaction_id:dd.TransId,
                    order_id:transaction_id,
                    operator:req.body.data.operator,
                    circle:req.body.data.circle,
                    recharge_type:req.body.data.type,
                    status:dd.status,
                    message:dd.resText
                })
                recharge.save().then(async rr => {
                    
                    return res.status(200).json({
                        message: dd.resText,
                        success: dd.status,
                        data: {
                            details:dd
                        }
                    })
                })
                
            }
            else {
                console.log("Error "+response.statusCode)
            }
        });
            }else{
                return res.status(200).json({
                    message: "Insufficent Balance",
                    success: "Insufficent Balance",
                    data: {
                        
                    }
                })
            }
        })
    }
        
    }, err => {
        return res.status(401).json({
            message: "Token Expired",
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.route("/recharge").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        var transaction_id = (new Date()).getTime()
        console.log("req.bod",req.body.data);
        if(req.body.data.payment_mode === 'online'){
            request(`https://mobilerechargenow.com/recharge.php?username=G263802891&apikey=4688691946&type=${req.body.data.type}&format=json&no=${req.body.data.phone_number}&amount=${req.body.data.amount}&operator=${req.body.data.operator}&circle=${req.body.data.circle}&user=${transaction_id}`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var dd = JSON.parse(body);
                    if(dd.status == "SUCCESS"){
                        helper.sendNotificationToUser(tkn.user._id, "Recharge Successfully","₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number)
                    }
                    console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
                    // return body;
                    var recharge = new Recharge({
                        user_id:tkn.user._id,
                        amount:req.body.data.amount,
                        mobile_number:req.body.data.phone_number,
                        transaction_id:dd.TransId,
                        order_id:transaction_id,
                        payment_mode:"online",
                        payment_id:req.body.data.payment_id,
                        operator:req.body.data.operator,
                        circle:req.body.data.circle,
                        recharge_type:req.body.data.type,
                        status:dd.status,
                        message:dd.resText
                    })
                    recharge.save().then(async rr => {
                        return res.status(200).json({
                            message: dd.resText,
                            success: dd.status,
                            data: {
                                details:dd
                            }
                        })
                    })
                    
                }
                else {
                    console.log("Error "+response.statusCode)
                }
        });
        }else{
        await WalletAmount.findOne({"user_id":tkn.user._id}).then(user => {
            // console.log("user",user);
            if(user && user.amount > req.body.data.amount){
                request(`https://mobilerechargenow.com/recharge.php?username=G263802891&apikey=4688691946&type=${req.body.data.type}&format=json&no=${req.body.data.phone_number}&amount=${req.body.data.amount}&operator=${req.body.data.operator}&circle=${req.body.data.circle}&user=${transaction_id}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var dd = JSON.parse(body);
                if(dd.status == "SUCCESS"){
                    user.amount = user.amount-req.body.data.amount
                    user.save();
                    var walletHitory = new WalletHistory({
                        user_id: tkn.user._id,
                        amount: req.body.data.amount,
                        txn_fee:0,
                        total_amount:req.body.data.amount,
                        type:"Recharge",
                        message:"₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number
                    })
                    walletHitory.save()
                    helper.sendNotificationToUser(tkn.user._id, "Recharge Successfully","₹"+req.body.data.amount+" recharge on "+req.body.data.operator+ " phone number "+req.body.data.phone_number)
                }
                console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
                // return body;
                var recharge = new Recharge({
                    user_id:tkn.user._id,
                    amount:req.body.data.amount,
                    mobile_number:req.body.data.phone_number,
                    transaction_id:dd.TransId,
                    order_id:transaction_id,
                    operator:req.body.data.operator,
                    circle:req.body.data.circle,
                    recharge_type:req.body.data.type,
                    status:dd.status,
                    message:dd.resText
                })
                recharge.save().then(async rr => {
                    
                    return res.status(200).json({
                        message: dd.resText,
                        success: dd.status,
                        data: {
                            details:dd
                        }
                    })
                })
                
            }
            else {
                console.log("Error "+response.statusCode)
            }
        });
            }else{
                return res.status(200).json({
                    message: "Insufficent Balance",
                    success: "Insufficent Balance",
                    data: {
                        
                    }
                })
            }
        })
    }
        
    }, err => {
        return res.status(401).json({
            message: "Token Expired",
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.get("/get/rechage/history", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(tkn => {
    Recharge.find({"user_id":tkn.user._id})
        // .sort(sort)
        .then(recharge => {
            if (recharge) {
                return res.status(200).json({
                    message: "Recharge List",
                    success: true,
                    data : {
                        recharge_detail: recharge
                    }
                    // data: {
                    //     category: recharge
                    // }
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
    }, err => {
        return res.status(401).json({
            message: "Token Expired",
            success: false,
            data: {
                error: err
            }
        })
        })
})


router.get("/check/access", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(tkn => {
    Users.findById(tkn.user._id)
        // .sort(sort)
        .then(user => {
            if (user) {
                return res.status(200).json({
                    message: "User List",
                    success: true,
                    data: {
                        category: user
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
    }, err => {
        return res.status(401).json({
            message: "Token Expired",
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.route("/transfer/register").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(tkn.user.mobile)
    request("https://mobilerechargenow.com/api/v2/dmt/cusdetails.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile_number, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var dd = JSON.parse(body);
            console.log(dd)
            if(dd.Status == 'FAILED'){
               
                request("https://mobilerechargenow.com/api/v2/dmt/cusregistration.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&name="+req.body.name, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var kk = JSON.parse(body)
                        console.log(kk)
                        return res.status(200).json({
                            message: "Number Regestired sucessfully",
                            success: true,
                            data: {
                                status: kk.Status,
                                msg:kk.resText
                            }
                        })
                    }
                })
            }
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.route("/transfer/verify/registration/otp").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(req.body.otp)
    request("https://mobilerechargenow.com/api/v2/dmt/customerverify.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&otp="+req.body.otp, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            Users.findById(tkn.user._id).then(user => {
                user.imps_access = 1;
                user.save().then(rr => {
                    return res.status(200).json({
                        message: "OPT Verified",
                        success: true,
                        data: {
                            status:dd.Status,
                            msg:dd.resText
                        }
                    })
                })
            })
            
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})


router.route("/add/beneficiary").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(req.body)
    var name = req.body.bene_name.replace(/ /g, '%20');
    console.log(name)
    // var url = "https://mobilerechargenow.com/api/mobileinfo.php?username=G263802891&apikey=4688691946&format=json&mobile="+req.body.phone_number;
    request("https://mobilerechargenow.com/api/v2/dmt/addbeneficiary.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&beneficiaryname="+name+"&beneficiaryno="+req.body.bene_mobile+"&beneficiaryacc="+req.body.bene_account_number+"&ifsccode="+req.body.bene_ifsc, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Bank add successfully! OTP Sent to Mobile Number",
                success: true,
                data: {
                    status: dd.status,
                    bene_id:dd.beneficiaryId
                }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})


router.route("/transfer/verify/otp").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(req.body)
    request("https://www.mobilerechargenow.com/api/v2/dmt/beneficiaryverifiy.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&otp="+req.body.otp+"&beneficiaryid="+req.body.bene_id, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Bank successfully verify",
                success: true,
                data: {
                    circle: dd.circle,
                    operator:dd.operator
                }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.route("/transfer/get/beneficiary/list").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(req.body)
    request("https://www.mobilerechargenow.com/api/v2/dmt/beneficiarylist.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile, function (error, response, body) {
        console.log(body)
        if (body != "null") {
            var dd = JSON.parse(body);
            // console.log(dd.beneficiaryId) // Show the HTML for the Google homepage. 
            // return body;
            if(dd.beneficiaryId != "null"){
                return res.status(200).json({
                    message: "Beneficiery List",
                    success: true,
                    data: {
                        data:dd
                    }
                })
            }else{
                return res.status(200).json({
                    message: "Beneficiery List",
                    success: true,
                    data: { 
                        data:[]
                    }
                })
            }
        }
        else {
            return res.status(200).json({
                message: "Something went wrong",
                success: true,
            })
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.route("/transfer/resend/bene/otp").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    console.log(req.body)
    request("https://www.mobilerechargenow.com/api/v2/dmt/beneficiaryotp.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&beneficiaryid="+req.body.bene_id, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Bank verify OTP Sent again",
                success: true,
                data: {
                    status:dd.Status
                }
            })
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.route("/transfer/send/amount").post((req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    // console.log(req.body); return false
    var txnid = Math.floor(5000000 + Math.random() * 9000000);
    await WalletAmount.findOne({"user_id":tkn.user._id}).then(user => {
        // console.log(amount); return false;
        if(user && user.amount > req.body.amount){
            request("https://www.mobilerechargenow.com/api/v2/dmt/transfer.php?username=G263802891&apikey=4688691946&number="+tkn.user.mobile+"&beneficiaryid="+req.body.bene_id+"&amount="+req.body.amount+"&txnid="+txnid, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var dd = JSON.parse(body);
            if(dd.Status != 'FAILED'){
                user.amount = user.amount-dd.billAmount
                user.save()
                var walletHitory = new WalletHistory({
                    user_id: tkn.user._id,
                    amount: req.body.amount,
                    txn_fee:dd.Fees,
                    total_amount:dd.billAmount,
                    type:"Bank Transfer",
                    message:"₹"+req.body.amount+" transfer to "+req.body.BeneficiaryName+ " account "+req.body.AccountNumber+". Transaction Fee: ₹"+dd.Fees+" and Total amount deduct from your wallet ₹"+dd.billAmount
                })
                walletHitory.save()
                helper.sendNotificationToUser(tkn.user._id, "Amount Transfer","₹"+req.body.amount+" transfer to "+req.body.BeneficiaryName+ " account "+req.body.AccountNumber+". Transaction Fee: ₹"+dd.Fees+" and Total amount deduct from your wallet ₹"+dd.billAmount)
            console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            // return body;
            return res.status(200).json({
                message: "Amount Send Successfully",
                success: true,
                data: {
                    data:dd
                }
            })
            }else{
                return res.status(200).json({
                    message: dd.resText,
                    success: true,
                    data: { }
                })
            }
            
        }
        else {
            console.log("Error "+response.statusCode)
        }
    });
        }else{
            return res.status(200).json({
                message: "Insufficent Balance",
                success: true,
                data: { }
            })
        }
    })
    
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})



async function getStoreCoupon(match) {
    return new Promise((resolve, reject) => {
        Coupon.find(match)
            .populate("category_id")
            .populate("brand_id")
            .then(coupon => {
                resolve(coupon);
            })
    })
}

router.post("/get/store-deal", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    if(req.body.data.category_id != "" && req.body.data.category_id.length >0 ){
        var match = { "category_id": { $in: req.body.data.category_id } }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0){
        var match = { "store_id": {$in : req.body.data.stores} }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0 && req.body.data.category_id != "" && req.body.data.category_id.length > 0){
        var match = { "category_id": { $in: req.body.data.category_id }, "store_id": {$in : req.body.data.stores} }
    }
    else{
        var match = {"store_id":+req.body.data.store_id}
    }
    console.log(match)
    Deal.find(match)
    .populate("category_id")
    .populate("brand_id")
        // .sort(sort)
        .then(async cat => {
           var StoreCoupon = await getStoreCoupon(match)
            if (cat) {
                return res.status(200).json({
                    message: "Store List",
                    success: true,
                    data: {
                        category: cat,
                        StoreCoupon:StoreCoupon
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


async function getCategoryCoupon(match) {
    return new Promise((resolve, reject) => {
        Coupon.find(match)
            .populate("store_id")
            .populate("brand_id")
            .then(coupon => {
                resolve(coupon);
            })
    })
}

router.post("/get/category-deal", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    if(req.body.data.category != "" && req.body.data.category.length >0 ){
        var match = { "category_id": { $in: req.body.data.category } }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0){
        var match = { "store_id": {$in : req.body.data.stores} }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0 && req.body.data.category != "" && req.body.data.category.length > 0){
        var match = { "category_id": { $in: req.body.data.category }, "store_id": {$in : req.body.data.stores} }
    }
    else{
        var match = {"category_id":+req.body.data.cat_id}
    }
    console.log(match)
    Deal.find(match)
    .populate("store_id")
    .populate("brand_id")
        // .sort(sort)
        .then(async cat => {
            var CategoryCoupon = await getCategoryCoupon(match)
            if (cat) {
                return res.status(200).json({
                    message: "Store List",
                    success: true,
                    data: {
                        category: cat,
                        CategoryCoupon:CategoryCoupon
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


router.post("/get/brand-deal", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    if(req.body.data.category != "" && req.body.data.category.length >0 ){
        var match = { "category_id": { $in: req.body.data.category } }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0){
        var match = { "store_id": {$in : req.body.data.stores} }
    }else if(req.body.data.stores != "" && req.body.data.stores.length > 0 && req.body.data.category != "" && req.body.data.category.length > 0){
        var match = { "category_id": { $in: req.body.data.category }, "store_id": {$in : req.body.data.stores} }
    }
    else{
        var match = {"brand_id":+req.body.data.brand_id}
    }
    console.log(match)
    Deal.find(match)
    .populate("store_id")
    .populate("category_id")
        // .sort(sort)
        .then(async cat => {
            var CategoryCoupon = await getCategoryCoupon(match)
            if (cat) {
                return res.status(200).json({
                    message: "Store List",
                    success: true,
                    data: {
                        category: cat,
                        CategoryCoupon:CategoryCoupon
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



router.post("/get/single-task", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    Task.findById(+req.body.data)
    .populate("category_id")
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


router.post("/get/category-task", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    Task.find({"category_id":+req.body.data})
    .populate("store_id")
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

router.post("/get/single-store", (req, res) => {
    // var sort = { created_at: -1 }
    console.log("data",req.body.data)
    Stores.findById(+req.body.data)
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

router.post("/get/single-category", (req, res) => {
    console.log("data",req.body.data)
    Categories.findById(+req.body.data)
    
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


router.post("/get/single-brand", (req, res) => {
    console.log("data",req.body.data)
    Brand.findById(+req.body.data)
    
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

router.post("/get/single-coupon", (req, res) => {
    // var sort = { created_at: -1 }
    Coupon.findById(req.body.id)
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

router.post("/get/single-offer", (req, res) => {
    // var sort = { created_at: -1 }
    Offer.findById(req.body.id)
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


router.route("/save-coupon").post((req, res) => {
    console.log(req.body)
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    UsedCoupon.findOne({"user_id":tkn.user._id, "coupon_id":req.body.coupon_id}).then(coupon => {
        if(!coupon){
            var user = new UsedCoupon({
                user_id: tkn.user._id,
                coupon_id:req.body.coupon_id
            })
            user.save().then(resp => {
                return res.status(200).json({
                    message: "Coupon saved",
                    success: true,
                    data: {
                        data:user
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
        }else{
            return res.status(200).json({
                message: "Coupon Already saved",
                success: true,
                data: {}
            })
        }
    })
    
}, err => {
    return res.status(401).json({
        message: "Session Expired",
        success: false,
        data: {
            error: err
        }
    })
    })
})

router.get("/get/user-coupon", (req, res) => {
   
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
    var match = { user_id:tkn.user._id };
    UsedCoupon.aggregate([{
        $match: match
    },
    {
        $lookup: {
            from: 'coupons',
            localField: 'coupon_id',
            foreignField: '_id',
            as: 'usedcoupon'
        }
    },
    {
        $unwind: {
            path: "$usedcoupon",
            preserveNullAndEmptyArrays: true
        }
    },
        // .sort(sort)
    ]).then(cat => {
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
    }, err => {
        return res.status(401).json({
            message: "Session Expired",
            success: false,
            data: {
                error: err
            }
        })
        })
})


router.post("/add/view-deal", (req, res) => {
    console.log(req.body.deal_id)
    user_auth.verifyJWTToken(req.headers.token).then( tkn => {
        ViewDeal.findOne({"user_id":tkn.user._id, 'deal_id':+req.body.deal_id}).then(deal => {
            if(deal){
                return res.status(200).json({
                    message: "Record Already added",
                    success: true,
                    data: {}
                })
             
            }else{
                var category = new ViewDeal({
                    user_id:tkn.user._id,
                    deal_id:+req.body.deal_id,
                })
                category.save().then(resp => {
                    
                    return res.status(200).json({
                        message: "Record Added",
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
            
        }, err => {
            return res.status(401).json({
                message: "session_expired",
                success: false,
                data: {
                    error: err
                }
            })
            })

})

router.post("/add/view-offer", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then( tkn => {
        ViewOffer.findOne({"user_id":tkn.user._id, 'offer_id':+req.body.offer_id}).then(offer => {
            if(offer){
                return res.status(200).json({
                    message: "Record Already added",
                    success: true,
                    data: {}
                })
             
            }else{
                var category = new ViewOffer({
                    user_id:tkn.user._id,
                    offer_id:+req.body.offer_id,
                })
                category.save().then(resp => {
                    
                    return res.status(200).json({
                        message: "Record Added",
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
            
        }, err => {
            return res.status(401).json({
                message: message(lang, "session_expired"),
                success: false,
                data: {
                    error: err
                }
            })
            })

})


router.get("/get/view-offer", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then( tkn => {
      ViewOffer.find({"user_id":tkn.user._id})
      .populate("user_id")
      .populate("offer_id")
      .sort({created_at: -1})
          .then(cat => {
              if (cat) {
                  return res.status(200).json({
                      message: "View Offer List",
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
      }, err => {
          return res.status(401).json({
              message: message(lang, "session_expired"),
              success: false,
              data: {
                  error: err
              }
          })
          })
  })

router.get("/get/view-deal", (req, res) => {
  user_auth.verifyJWTToken(req.headers.token).then( tkn => {
    ViewDeal.find({"user_id":tkn.user._id})
    .populate("user_id")
    .populate("deal_id")
    .populate({
        path: "deal_id",
        populate: {
            path: "category_id",
            populate: { path: "category" }
        },
    })
    .populate({
        path: "deal_id",
        populate: {
            path: "brand_id",
            populate: { path: "brand" }
        },
    })
    .populate({
        path: "deal_id",
        populate: {
            path: "store_id",
            populate: { path: "store" }
        },
    })
    .sort({created_at: -1})
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "View Deal List",
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
    }, err => {
        return res.status(401).json({
            message: message(lang, "session_expired"),
            success: false,
            data: {
                error: err
            }
        })
        })
})

router.get("/get/wallet-history", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then( tkn => {
      WalletHistory.find({"user_id":tkn.user._id})
      .sort({created_at: -1})
          .then(cat => {
              if (cat) {
                  return res.status(200).json({
                      message: "Wallet History List",
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
      }, err => {
          return res.status(401).json({
              message: message(lang, "session_expired"),
              success: false,
              data: {
                  error: err
              }
          })
          })
  })

  router.get("/get/gift-card", (req, res) => {
    // var sort = { created_at: -1 }
    Giftcard.find({"status":"active"})
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



router.get("/get/allData", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then( tkn => {
    Promise.all([
        CompletedTask.countDocuments({"user_id":tkn.user._id}),
        WalletAmount.findOne({"user_id":tkn.user._id}),
        
    ]).then(d => {
        // console.log(d)
        const [CompletedTask,WalletAmount] = d;
        return res.status(200).json({
            message: "Data list",
            success: true,
            CompletedTask: CompletedTask,
            WalletAmount:WalletAmount,
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
}, err => {
    return res.status(401).json({
        message: message(lang, "session_expired"),
        success: false,
        data: {
            error: err
        }
    })
    })
});

router.get("/get/exclusive-slider", (req, res) => {
    // var sort = { created_at: -1 }
    ExclusiveSlider.find({"status":"active"})
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

router.get("/get/home-data", (req, res) => {
    var now = new Date();
    var sort = { created_at: -1 }
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var data2=[];
    Promise.all([
        Sliders.find({"status":"active"})
        .limit(5)
        .sort(sort),
        Deal.find({"status":"active",start_date: {$lte: startOfToday}, end_date :{$gte: startOfToday}})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .skip(8)
        .limit(9)
        .sort(sort),
        Offer.find({"status":"active"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .skip(8)
        .limit(9)
        .sort(sort),
        FeaturedDeal.find()
        .populate({
            path: "deal_id",
            populate: {
                path: "category_id store_id brand_id",
                populate: { path: "category_id store_id brand_id" }
            },
        }),
        // .populate("deal_id"),
        Deal.find({"status":"active"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .skip(8)
        .limit(9)
        .sort(sort),
        FeaturedTodayTask.find()
        .populate("task_id"),
        Task.find({"status":"active"})
        .skip(8)
        .limit(8)
        .sort(sort)
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id"),
        
        Coupon.find({"status":"active"}).skip(8).limit(9)
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .sort(sort),
        Offer.find({"status":"active"}).skip(8).limit(9)
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .sort(sort),
        Offer.find({"status":"active","exclusive":"yes"}).skip(8).limit(9)
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id")
        .sort(sort),
        Stores.find({"status":"active"}).skip(8).limit(9)
        .populate("brand_id")
        .populate("category_id")
        .sort(sort),
        BottomSlider.find({"status":"active"}),
        
        
        
    ]).then(result => {
        var [slider,deal_of_day,today_offer,featured_deal, trending_deal,featured_task,today_task,top_coupon,popular_offer,exclusive_offer,fav_store,bottom_slider] = result
        data2 = result
        return res.status(200).json({
            message: "Home list",
            success: true,
            
            // data :{
                data: [
                {slider, "type":"slider" },
                {deal_of_day, "type":"deal_of_day"},
                {today_offer, "type":"today_offer"},
                {featured_deal, "type":"featured_deal"},
                {trending_deal, "type":"trending_deal"},
                {featured_task, "type":"featured_task"},
                {today_task, "type":"today_task"},
                {top_coupon, "type":"top_coupon"},
                {popular_offer,"type":"popular_offer"},
                {exclusive_offer, "type":"exclusive_offer"},
                {fav_store, "type":"fav_store"},
                {bottom_slider, "type":"bottom_slider"},
                
                
                ]
               
            // }
            
            
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



router.get("/get/exclusive", (req, res) => {
    var now = new Date();
    var sort = { created_at: -1 }
    var data2=[];
    Promise.all([
        Offer.find({"status":"active", "exclusive":"yes"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id").limit(10)
        .sort(sort),
        Coupon.find({"status":"active", "exclusive":"yes"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id").limit(12)
        .sort(sort),
        Categories.find({"status":"active", "exclusive":"yes"}).limit(10)
        .sort(sort),
        Deal.find({"status":"active", "exclusive":"yes"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id").limit(20)
        .sort(sort),
        Deal.find({"status":"active", "hot_deal":"yes"})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id").limit(16)
        .sort(sort),
        
    ]).then(result => {
        var [offer,coupon,category,deal,hot_deal] = result
        data2 = result
        return res.status(200).json({
            message: "Exclusive list",
            success: true,
            
            // data :{
                data: [
                {offer, "type":"offer" },
                {coupon, "type":"coupon"},
                {category, "type":"category"},
                {deal, "type":"deal"},
                {hot_deal, "type":"hot_deal"}
                ]
               
            // }
            
            
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

router.get("/get/all-deal", (req, res) => {
   var exclusive = req.query.type;
   console.log(exclusive);
   if(exclusive){
    var match = { "status": "active", "exclusive": "yes"  };
   }else{
    var match = { "status": "active"  };
   }
    // var sort = { created_at: -1 }
    Deal.find(match)
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

router.get("/get/all-coupon", (req, res) => {
    var exclusive = req.query.type;
   if(exclusive){
    var match = { "status": "active", "exclusive": "yes"  };
   }else{
    var match = { "status": "active"  };
   }
    Coupon.find(match)
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

router.post("/get/singleCategory", (req, res) => {
    var data2=[];
    var all=[]
    Promise.all([
        Categories.findById(req.body.category_id),
        Coupon.find({"category_id":+req.body.category_id})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id"),
        Deal.find({"category_id": +req.body.category_id})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id"),
       
        
    ]).then(result => {
        var [category, coupon,deal] = result
        data2 = result;
        var all = coupon.concat(deal);
        return res.status(200).json({
            message: "Single Categry list",
            success: true,
            
            // data :{
                data: [
                {category, "type":"category" },
                {coupon, "type":"coupon"},
                {deal, "type":"deal"},
                {all, "type":"all"}
                ]
               
            // }
            
            
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

router.post("/get/singleStore", (req, res) => {
    var data2=[];
    Promise.all([
        Stores.findById(req.body.store_id)
        .populate("category_id"),
        Coupon.find({"store_id":+req.body.store_id})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id"),
        Deal.find({"store_id": +req.body.store_id})
        .populate("category_id")
        .populate("store_id")
        .populate("brand_id"),
       
        
    ]).then(result => {
        var [store, coupon,deal] = result
        data2 = result;
        var all = coupon.concat(deal);
        return res.status(200).json({
            message: "Single Store list",
            success: true,
            
            // data :{
                data: [
                {store, "type":"store" },
                {coupon, "type":"coupon"},
                {deal, "type":"deal"},
                {all, "type":"all"},
                ]
               
            // }
            
            
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

router.get("/get/all/feature-deal", (req, res) => {
    var sort = { created_at: -1 }
    FeaturedDeal.find()
    .populate("deal_id")
        .sort(sort)
        .then(cat => {
            if (cat) {
                return res.status(200).json({
                    message: "Feature List",
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

router.get("/get/all/today-task", (req, res) => {
    var sort = { created_at: -1 }
    Task.find({"status":"active"})
    // .populate("deal_id")
        .sort(sort)
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

router.get("/get/all/offer", (req, res) => {
    var sort = { created_at: -1 }
    Offer.find({"status":"active"})
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
        .sort(sort)
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

router.get("/get/all/exclusive-offer", (req, res) => {
    var sort = { created_at: -1 }
    Promise.all([
        ExclusiveSlider.find({"status":"active"}),
    Offer.find({"status":"active","exclusive":"yes"})
    .populate("category_id")
    .populate("store_id")
    .populate("brand_id")
    .sort(sort)
    ]).then(cat => {
            var [slider, cat] = cat
            if (cat) {
                return res.status(200).json({
                    message: "Exclusive Offer List",
                    success: true,
                    data: {
                        category: cat,
                        banner:slider
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

router.get("/get/all/store", (req, res) => {
    var sort = { created_at: -1 }
    Stores.find({"status":"active"})
    .populate("category_id")
    // .populate("store_id")
    .populate("brand_id")
    .limit(30)
        .sort(sort)
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

router.get("/get/all-task", (req, res) => {
    user_auth.verifyJWTToken(req.headers.token).then(async tkn => {
        console.log(tkn.user._id)
    var match = { "status": "active" };
    Task.
    aggregate([{
        $match: match
        
    },
    {
        $lookup: {
            from: "brands",
            localField: "brand_id",
            foreignField: "_id",
            as: "brand_id"
        }
    },
    {
        $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_id"
        }
    },
    {
        $lookup: {
            from: "stores",
            localField: "store_id",
            foreignField: "_id",
            as: "store_id"
        }
    },
    {
        $lookup: {
            from: 'completedtasks',
            // localField: 'offer_id',
            //             foreignField: 'offer_id',
            let: {
                id: "$_id"
            },
            
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user_id", tkn.user._id] },
                                { $eq: ["$$id", "$offer_id"] }
                            ]
                        }
                    },
                },
               
            ],
            as: 'completedtask',
        }
    },
    // {
    //     $unwind: {
    //         path: "$completedtask",
    //         preserveNullAndEmptyArrays: true
    //     }
    // },
    {
        $unwind: {
            path: "$brand_id",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: "$store_id",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: "$category_id",
            preserveNullAndEmptyArrays: true
        }
    },
]).then(result => {
    console.log(result)
    return res.status(200).json({
        message: "Task List",
        success: true,
        data: {
            category: result
        }
    })
}, err => {
    return res.status(401).json({
        // message: message(lang, "session_expired"),
        success: false,
        data: {
            error: err
        }
    })
    })
})
   
})
router.post("/type-wise/category", (req, res) => {
    // var sort = { created_at: -1 }
    Categories.find({"status":"active","type":{$regex: '^' + req.body.type, $options: 'i'}})
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

router.get("/get/featured-today-task", (req, res) => {
    // var sort = { created_at: -1 }
    FeaturedTodayTask.find()
    .populate("task_id")
    .populate({
        path: "task_id",
        populate: {
            path: "brand_id",
            populate: { path: "brands" }
        },
    })
    .populate({
        path: "task_id",
        populate: {
            path: "category_id",
            populate: { path: "brands" }
        },
    })
    .populate({
        path: "task_id",
        populate: {
            path: "store_id",
            populate: { path: "stores" }
        },
    })
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



module.exports = router;