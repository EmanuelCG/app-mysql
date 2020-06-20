const bcrypt = require('bcryptjs');

helpers = {};

helpers.encryptPass = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
};

helpers.matchPass = async (pass, savePass) => { 
    try {
        return await bcrypt.compare(pass, savePass); //Retorta un boleano true o false
    } catch (e) {
        console.log(e);
    }
}


module.exports = helpers;