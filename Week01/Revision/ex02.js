const paymentStatus = "APPROVED";

if (paymentStatus === "APPROVED") {
    console.log("Payment has been approved.");
}
else if (paymentStatus === "PENDING") {
    console.log("Payment is pending.");
}
else if (paymentStatus === "DECLINED") {
    console.log("Payment has been declined.");
}
else {
    console.log("Unknown payment status.");
}

////Method 2: Using switch statement
// payments.forEach(pet => {
//     switch (true) {
//         case pet.status === "APPROVED":
//             console.log(`Pet-care service for ${pet.petName} confirmed`);
//             break;
            
//         case pet.status === "PENDING":
//             console.log(`Payment for ${pet.petName} is being processed`);
//             break;
            
//         case pet.status === "DECLINED":
//             console.log(`Payment for ${pet.petName} unsuccessful`);
//             break;
//     }
// });