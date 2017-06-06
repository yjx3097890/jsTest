compressor = require "yuicompressor"

compressor.compress "test.min.js" , 
    charset: 'utf8'
    type: "js"
    nomunge: true
    "line-break": 80 ,
    (err, data, extra) -> 
        (console.log(err);return) if err
        console.log data