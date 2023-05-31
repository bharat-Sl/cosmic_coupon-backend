const FCM = require('fcm-node');
const moment = require('moment-timezone');
import Users from "../models/Users";
moment.tz.setDefault("Asia/Phnom_Penh");
export function sendNotification(token, title, message, type) {
    var fcm = new FCM("AAAAYeoQgjU:APA91bEEtYatMOv3AlxHGPgcOmQYU-onB_cbTbK6RzLnXpuqF4bDUus2WR_oAnZJLCK0vrcjoMm3Hs7bCLLchloYxgs7lq8uGDNCxhd-lRAMmqKbnd62zSSpMpeUJI4iXNQOjjPY4kSA")
    var message = {
       registration_ids: token,
       data: {
          title: title,
          message: message,
          body: message,
          type: type
       }
    };
    fcm.send(message, function (err, response) {
       // console.log("user_notifications with params user", err, response)
       if (err) {
           console.log(err)
          return err;
       } else {
           console.log("done")
          return response;
       }
    });
 }

 export function sendNotificationToAllUser(title, message, type = null) {
    Users.find({"status":"active"}).then(async user => {
       for(let i of user){
         await sendNotification([i.device_token], title, message, type)
       }
       
    })
 }
 export function sendNotificationToUser(user_id, title, message, type = null) {
   Users.findById(user_id).then(user => {
       sendNotification([user.device_token], title, message, type)
   })
}