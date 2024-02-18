const genUniqFileName = async (fileName) => {
    const date = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${date}_${random}_${fileName}`;
}

module.exports = genUniqFileName;