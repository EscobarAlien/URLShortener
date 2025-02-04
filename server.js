const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const dataFilePath = path.join(__dirname, 'urls.json');

function loadUrls() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch(err) {
        console.error("Error reading urls.json:", err);
        return[];
    }
}

function saveUrls(urls) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(urls, null, 2), 'utf8');
    }
    catch(err) {
        console.error("Error writing to urls.json:", err);
    }
}

function generateShortUrl() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';
    for(let i=0; i<6; i++)
    {
        shortUrl += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortUrl;
}

app.post('/shorten', (req, res) => {
    const longUrl = req.body.longUrl;

    if(!longUrl)
    {
        return res.status(400).json({ error: "Missing longUrl" });
    }

    let urls = loadUrls();
    let shortUrl = generateShortUrl();

    while(urls.some(url => url.shortUrl === shortUrl))
    {
        shortUrl = generateShortUrl();
    }

    urls.push({ longUrl, shortUrl });
    saveUrls(urls);

    res.json({ shortUrl: 'http://localhost:${port}/${shortUrl}' });
});

app.get('/:shortUrl', (req,res) => {
    const shortUrl = req.params.shortUrl;
    const urls = loadUrls();
    const urlData = urls.find(url => url.shortUrl === shortUrl);

    if(urlData)
    {
        res.redirect(urlData.loadUrls);
    }
    else
    {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log('Server listening at http://localhost:${port}');
});