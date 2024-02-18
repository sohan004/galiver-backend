const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    const name = await req.query.name;
    if (!name) {
        res.status(400).send('Name is required');
    }
    const mediaPath = await path.join(__dirname, `../../media`);
    const filePath = await path.join(mediaPath, name);
    if (fs.existsSync(filePath)) {
        const stream = await fs.createReadStream(filePath);
        await stream.pipe(res);
    }
    else {
        res.status(404).send('File not found');
    }
});

module.exports = router;    