const payments = [
    { petName: "Chester", amount: 50, status: "APPROVED" },
    { petName: "Mochi", amount: 80, status: "PENDING" },
    { petName: "Mira", amount: 40, status: "DECLINED" }
]

// a) Displaying Mochi's payment status
for (let i = 0; i < payments.length; i++) {
    if (payments[i].petName === "Mochi") {
        console.log(`Mochi's payment status: ${payments[i].status}`);
        break;
    }
}

// b) Looping though to display payment details for each pet
payments.forEach(pet => {
    switch (pet.status) {
        case "APPROVED":
            console.log(`Pet-care service for ${pet.petName} confirmed`);
            break;
        case "PENDING":
            console.log(`Payment for ${pet.petName} is being processed`);
            break;
        case "DECLINED":
            console.log(`Payment for ${pet.petName} unsuccessful`);
            break;
    }
});