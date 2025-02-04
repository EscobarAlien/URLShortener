document.addEventListener('DOMContentLoaded', () => {
    const longUrlInput = document.getElementById('long-url');
    const shortenButton = document.getElementById('shorten-button');
    const shortUrlDisplay = document.getElementById('short-url');

    shortenButton.addEventListener('click', async () => {
        const longUrl = longUrlInput.value;

        if(!longUrl)
        {
            alert('Please enter a URL to shorten.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/shorten', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ longUrl: longUrl })
            });

            if(!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }

            const data = await response.json();
            shortUrlDisplay.textContent = 'Shortened URL: ${data.shortUrl}';
            shortUrlDisplay.innerHTML = 'Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>';
        }
        catch (error) {
            console.error('Error shortening URL:', error);
            alert('Error shortening URL. Please try again');
            shortUrlDisplay.textContent = '';
        }
    });
}) ;