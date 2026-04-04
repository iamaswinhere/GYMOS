const crypto = require('crypto');

async function testFrontendSim() {
    const now = new Date();
    // Offset for IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const dateString = `${istDate.getUTCFullYear()}-${istDate.getUTCMonth()}-${istDate.getUTCDate()}-${istDate.getUTCHours()}`;

    // Frontend generates PIN
    const dataString = 'gymos_pin_' + dateString;
    const data = new TextEncoder().encode(dataString);
    const hashBuffer = await crypto.webcrypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const shortCode = parseInt(hashHex.substring(0, 8), 16).toString().substring(0, 6).padStart(6, '0');

    // Backend generates PIN
    const backendHash = crypto.createHash('sha256').update(dataString).digest('hex');
    const backendCode = parseInt(backendHash.substring(0, 8), 16).toString().substring(0, 6).padStart(6, '0');

    console.log("Frontend shortCode:", shortCode);
    console.log("Backend shortCode: ", backendCode);
}
testFrontendSim();
