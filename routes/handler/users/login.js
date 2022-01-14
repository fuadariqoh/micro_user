const bcrypt = require('bcrypt');
const { User } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
  const schema = {
    email: 'email|empty:false',
    password: 'string|min:6'
  }
  
  console.log("masuk micro user",req.body)

  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      status: 'error',
      message: validate
    });
  }
  
  console.log("lewat validate")

  const user = await User.findOne({
    where: { email: req.body.email }
  });
  
  console.log(user,"user @ micro_user")

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }
  
  console.log(req.body.password,user.password)

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }

  res.json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profession: user.profession
    }
  });
}
