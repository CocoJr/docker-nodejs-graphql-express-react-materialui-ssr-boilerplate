import Sequelize from 'sequelize';
import dbConfig from '../../config/db.json';
import User from './User';
import {attributeFields} from 'graphql-sequelize';
import {GraphQLObjectType} from 'graphql';

const db = {};
const Models = {};
const ModelsList = {
    User
};

let env = process.env.NODE_ENV || 'development';
let config = dbConfig[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(ModelsList).forEach((model) => {
    Models[model] = ModelsList[model].init(sequelize, Sequelize.DataTypes);
    if (Models[model].associate) {
        Models[model].associate(Models);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

attributeFields(Models.User, {
    // ... options
    exclude: [], // array of model attributes to ignore - default: []
    only: [], // only generate definitions for these model attributes - default: null
    globalId: false, // return an relay global id field - default: false
    map: {}, // rename fields - default: {}
    allowNull: true, // disable wrapping mandatory fields in `GraphQLNonNull` - default: false
    commentToDescription: false, // convert model comment to GraphQL description - default: false
    cache: {}, // Cache enum types to prevent duplicate type name error - default: {}
});
// let userFields = {};

const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: attributeFields(Models.User)
});

export {Models, db, userType};