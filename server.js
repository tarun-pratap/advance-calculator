const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for Wolfram Alpha API
app.get('/wolfram', (req, res) => {
    const query = req.query.query;
    const appId = 'HVV894-YRXVQ29TQ8'; // Replace with your Wolfram Alpha App ID
    const apiUrl = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&format=plaintext&output=JSON&appid=${appId}`;

    https.get(apiUrl, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const result = JSON.parse(data);
                console.log('Wolfram API response:', result); // Log the full response for debugging

                if (result.queryresult.success) {
                    const pods = result.queryresult.pods;
                    let output = 'No result available';

                    for (let pod of pods) {
                        // Adjust this condition based on your expected result structure
                        if (pod.primary || pod.title === "Result" || pod.title === "Decimal approximation") {
                            output = pod.subpods[0].plaintext;
                            break;
                        }
                    }

                    res.json({ result: output });
                } else {
                    res.json({ error: 'Unable to compute result' });
                }
            } catch (error) {
                console.error('Error parsing response:', error);
                res.status(500).json({ error: 'Error parsing response' });
            }
        });
    }).on('error', (e) => {
        console.error('Network error:', e);
        res.status(500).json({ error: 'Network issue' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
