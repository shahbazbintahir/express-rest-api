const path = require('path');

const loadModels = () => {
    const modelsDirPath = path.join(process.cwd(), '/src/app/models');
    const models = require('fs').readdirSync(modelsDirPath);
    models.forEach(function (model) {
        try {
            require(modelsDirPath + '/' + model);
        } catch (error) {
            console.log('Error Requiring model: ' + model);
        }
    });
};
module.exports = { loadModels };
