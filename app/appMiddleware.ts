import express = require('express');

module.exports = function(app: express.Express) {

    app.use((req, res, next) => {
        //console.log('Time: ', Date.now());
    
        res.apiError = function(error: string) {
            return res.json(<APIResponse> {
                err: true,
                msg: 'The API returned an error: ' + error,
                data: []
            });
        };
    
        res.apiResponse = function(respData: object) {
            return res.json(<APIResponse> {
                err: false,
                msg: "",
                data: respData
            });
        };
    
        next();
    });
}