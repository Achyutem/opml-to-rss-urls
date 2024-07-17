const fs = require('fs');
const xml2js = require('xml2js');

fs.readFile('feeds.opml', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    xml2js.parseString(data, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const urls = [];
        const outlines = result.opml.body[0].outline;

        const extractUrls = (outline) => {
            outline.forEach(item => {
                if (item.$.xmlUrl) {
                    urls.push(item.$.xmlUrl);
                }
                if (item.outline) {
                    extractUrls(item.outline);
                }
            });
        };

        extractUrls(outlines);

        fs.writeFile('urls', urls.join('\n'), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('URLs successfully extracted to "urls" file');
        });
    });
});
