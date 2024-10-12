const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    const name = req?.query?.name;

    // Check if the name query parameter exists
    if (!name) {
        return res.status(400).send('Name is required');
    }

    try {
        const mediaPath = path.join(__dirname, '../../media');
        const filePath = path.join(mediaPath, name);

        // Check if the file exists and if it's a file, not a directory
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            const stream = fs.createReadStream(filePath);

            // Pipe the stream to the response
            stream.pipe(res);

            // Handle errors in the stream
            stream.on('error', (error) => {
                res.status(500).send('Error reading the file');
            });
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
