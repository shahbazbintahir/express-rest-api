
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const generatePassword = exports.generatePassword = (passwordLength) => {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var specialChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  var allChars = numberChars + upperChars + lowerChars + specialChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray[3] = specialChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

const shuffleArray = exports.shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

exports.validateErrorFormatting = (obj) => {
  return {
    errors: (obj.details).map((error) => {
      return {
        'message': error.message,
        'path': error.path[0],
        'field': error.context.key
      }
    })
  };
}

const checkToken = (options) => {

  const { token } = options
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  return decode
}
exports.checkToken;

exports.checkAuthUser = async (token) => {
  try {
    const decoded = checkToken({ token })
    return await User.findById(decoded.userId)
  }
  catch (err) {
    console.log(err)
    return false
  }
}


exports.getExtension =  (path) => {
  var basename = path.split(/[\\/]/).pop();  // extract file name from full path ...
                                             // (supports `\\` and `/` separators)
  pos = basename.lastIndexOf(".");       // get last position of `.`

  if (basename === "" || pos < 1)            // if file name is empty or ...
      return "";                             //  `.` not found (-1) or comes first (0)

  return basename.slice(pos + 1);            // extract extension ignoring `.`
}