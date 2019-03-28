import express = require('express');

module.exports = (app: express.Express) => {

    app.use((req, res, next) => {
        // console.log('Time: ', Date.now());

        res.apiError = (error: string) => {
            return res.json({
                data: [],
                err: true,
                msg: 'The API returned an error: ' + error,
            } as APIResponse);
        };

        res.apiResponse = (respData: object) => {
            return res.json({
                data: respData,
                err: false,
                msg: '',
            } as APIResponse);
        };

        next();
    });
};
