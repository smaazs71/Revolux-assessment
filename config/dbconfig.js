import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgPromise(/* initialization options */);
const db = pgp(
  // 'postgres://postgres:qwerty@localhost:5432/myFirstDB'
  "postgres://" +
    process.env.POSTGRESS_USER +
    ":" +
    process.env.POSTGRESS_PASSWORD +
    "@" +
    process.env.POSTGRESS_HOSTNAME +
    ":" +
    process.env.POSTGRESS_PORT +
    "/" +
    process.env.POSTGRESS_DB_NAME
);

db.connect()
  .then((obj) => {
    console.log("Connected to database");
    obj.done(); // success, release connection;
  })
  .catch((error) => {
    console.error("ERROR in connecting db: ", error.message);
  });

export { db, pgp };
// export function getDB() {
//   return createSingleton("myFirstDB", () => {
//   return {
// db: pgp("postgres://smaazs71@gmail.com:qwerty@host:port/myFirstDB"),
//  db,
//  pgp,
//   };
//   });
// }

// const initOptions = {
//   // initialization options;
// };

// const pgp = require('pg-promise')(initOptions);

// const cn = 'postgres://username:password@host:port/database';
// const db = pgp(cn);

// module.exports = {
//   pgp, db
// };

// import mongoose from "mongoose";
// import {
//   validateUser,
//   insertUser,
//   updateUserById,
// } from "../api/v1/services/userService.js";
// import { generateToken } from "../api/v1/utils/token.js";
// import {
//   ACCESS_ROLES,
//   ADMIN_EMAIL_ID,
//   ADMIN_PASSWORD,
//   ADMIN_USERNAME,
//   COMPANY_GST_NO,
//   GUEST_CUSTOMER_NAME,
// } from "./Constants.js";
// import {
//   getCustomerByName,
//   insertCustomer,
// } from "../api/v1/services/customerService.js";

// import colors from "colors";
// import { getAllBatches, insertBatch } from "../api/v1/services/batchService.js";

// import mongoose from "mongoose";

// export const connectMongoDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(
//       "mongodb://localhost:27017/productionDB",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log(
//       `DB connected at: ${conn.connection.host}:${conn.connection.port}`.rainbow
//         .underline
//     );

//     let user;
//     try {
//       user = await validateUser(admin);
//       // console.log( await validateUser( admin ) );
//       admin._id = user._id;
//       await updateUserById(admin);
//       //   console.log(await updateUserById(admin));
//     } catch (err) {
//       user = await insertUser(admin);
//       // await insertUser( admin )
//       admin._id = user._id;
//       //   await createGuestCustomer(user.id);

//       //   console.log(user);
//     }

//     const guestCustomerData = await createGuestCustomer(user);
//     guestCustomer._id = guestCustomerData._id;

//     const guestBatchData = await createGuestBatch(user);
//     guestBatch._id = guestBatchData._id;

//     // console.log("Admin " + guestCustomerData.toString());
//     generateToken(admin._id);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }

//   // mongoose.connect('mongodb://localhost:27017/companyDB',{
//   //     useNewUrlParser:  true,
//   //     useUnifiedTopology: true
//   // }, () => {
//   //     console.log("DB connected");
//   // });

//   // insertUser()
// };

// const createGuestCustomer = async (user) => {
//   guestCustomer.createdBy = user.id;
//   guestCustomer.lastUpdatedBy = user.id;

//   let guestCustomerData;
//   try {
//     guestCustomerData = await getCustomerByName(guestCustomer.name);

//     if (Object.keys(guestCustomerData).length === 0) {
//       guestCustomerData = await insertCustomer(guestCustomer);
//     }

//     return guestCustomerData;
//   } catch (err) {
//     console.log("error: " + err);
//   }
// };

// const createGuestBatch = async (user) => {
//   guestBatch.createdBy = user.id;
//   guestBatch.lastUpdatedBy = user.id;

//   let guestBatchData;
//   try {
//     guestBatchData = await getAllBatches();

//     if (Object.keys(guestBatchData).length === 0) {
//       guestBatchData = await insertBatch(guestBatch);
//     }

//     return guestBatchData;
//   } catch (err) {
//     console.log("error: " + err);
//   }
// };

// const admin = {
//   userName: ADMIN_USERNAME,
//   emailId: ADMIN_EMAIL_ID,
//   password: ADMIN_PASSWORD,
//   fname: "firstname",
//   lname: "lastname",
//   aadhaar: 123456789012,
//   DOB: "2000-02-29",
//   address: "address",
//   phoneNo: 9876543210,
//   roles: ACCESS_ROLES,
//   createdBy: "63599b926ce1cde34b5643a9",
//   lastUpdatedBy: "63599b926ce1cde34b5643a9",
// };

// const guestCustomer = {
//   name: GUEST_CUSTOMER_NAME,
//   location: "Home",
//   address: {
//     line1: "",
//     line2: "",
//     state: "Maharashtra",
//     district: "Mumbai",
//     pinCode: 400051,
//   },
//   consigneeName: GUEST_CUSTOMER_NAME,
//   consigneeAddress: {
//     line1: "",
//     line2: "",
//     state: "Maharashtra",
//     district: "Mumbai",
//     pinCode: 400051,
//   },
//   GST: COMPANY_GST_NO,
//   phoneNo: 9876543210,
//   outstandingAmt: 0,
//   outstandingBills: [],
// };

// const guestBatch = {
//   batchName: "Guest Batch",
//   date: "2999-12-31",
//   productsQuantity: [],
//   totalQuantity: 0,
//   billSequence: [],
//   status: "active",
//   // deliveredBy: "616eff64d96abc08d630cf87",
//   // deliveryOn: "2999-01-31",
// };
