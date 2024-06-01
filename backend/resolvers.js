const { Restaurant, User } = require('./models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const resolvers = {
  Query: {
    restaurants: async(_, {page = 1, pageSize = 10}) => {
      const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      return await Restaurant.findAll({offset, limit: parseInt(pageSize, 10)})
    },
    searchRestaurants: async(_, {searchTerm, page = 1, pageSize = 10}) => {
      const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      return await Restaurant.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { address: { [Op.like]: `%${searchTerm}%` } }
          ],
        },
        offset,
        limit: parseInt(pageSize, 10)
      });
    },
  },
  Mutation : {
    createRestaurant: async(_, {name, address, email, phone}) => {
      return await Restaurant.create({name, address, email, phone})
    },
    updateRestaurant: async(_, {id, name, address, email, phone}) => {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) throw new Error('Restaurant not found');

      return await restaurant.update({name, address, email, phone});
    },
    deleteRestaurant: async(_, {id}) => {
      const result = await Restaurant.destroy({where: {id}});
      if (result === 0) {
        throw new Error('Restaurant not found');
      }

      return true;
    },
    register: async(_, {email, password}) => {
      const existingUser = await User.findOne({where: {email}});
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = bcrypt.hashSync(password, 8);
      const user = await User.create({email, password: hashedPassword});

      return generateToken(user);
    },
    login: async(_, {email, password}) => {
      const user = await User.findOne({where: {email}});
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid email or password');
      }

      return generateToken(user);
    },
  },
}

module.exports = resolvers;