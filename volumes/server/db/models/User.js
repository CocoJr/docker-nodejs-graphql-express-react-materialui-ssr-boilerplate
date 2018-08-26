import {Model} from 'sequelize';
import {UserError} from 'graphql-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';

export default class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                }
            },
            email: {
                type:  DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            roles: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {0: 'ROLE_USER', 1: 'ROLE_ADMIN'},
            },
            imgProfil: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            token: {
                type: DataTypes.VIRTUAL,
                allowNull: true,
            },
        }, {
            tableName: 'user',
            sequelize,
        });
    }

    static encryptPassword(password) {
        return bcrypt
            .hash(password, 10)
            .catch(() => {
                throw new Error();
            });
    }

    static checkPassword(plainPassword, encryptedPassword) {
        return bcrypt.compare(plainPassword, encryptedPassword);
    }

    static login({username, password}) {
        return User.findOne({
            'where': {
                'username': username,
            }
        }).then(async function(data) {
            if (!data) {
                return data;
            }

            if (await User.checkPassword(password, data.password)) {
                data.token = jwt.sign({
                    id: data.id,
                }, 'nz12fu98ef');

                return data.save();
            }

            return null;
        });
    }

    static async register({email, username, password}) {
        let hashedPassword = await User.encryptPassword(password);

        return User
            .build({
                email,
                username,
                password: hashedPassword
            })
            .save()
            .catch(User.handleValidationErrors)
        ;
    }

    static edit(user, {email, username, ...adminFields}, isAdmin) {
        if (username) {
            user.set('username', username);
        }

        if (email) {
            user.set('email', email);
        }

        if (isAdmin) {
            const {isActive} = adminFields;

            if (isActive !== undefined) {
                user.set('isActive', isActive);
            }
        }

        return user
            .save()
            .catch(User.handleValidationErrors)
        ;
    }

    static async uploadImgProfil(user, file) {
        const { stream, filename, mimetype } = await file;

        if (!mimetype.match(/^image/)) {
            throw new UserError({0: {path: 'imgProfil', message: 'Invalid image', value: filename}, __typename: 'validation'});
        }

        let filePath = 'uploads/imgProfil-' + user.id + '-' + Math.floor(Date.now() / 1000) + '.' + filename.split('.').pop();
        let write = fs.createWriteStream('public/' + filePath);
        stream.pipe(write);

        return new Promise(function(resolve) {
            write.on('finish', () => {
                user.set('imgProfil', filePath);

                resolve(user.save());
            });

            write.on('error', () => {
                throw new Error('Impossible d\'écrire le fichier');
            });
        });
    }

    static async getLoggedUser(authToken) {
        let verify = true;
        try {
            verify = await jwt.verify(authToken, 'nz12fu98ef');
        } catch(e) {
            verify = false;
        }

        if (!verify) {
            return null;
        }

        authToken = jwt.decode(authToken, 'nz12fu98ef');
        return User.findOne({
            'where': {
                'id': authToken.id,
            }
        });
    }

    static getUsers({page, limit, orderBy, orderDir}) {
        return User.findAndCountAll({
            offset: (page - 1) * 10,
            limit: limit,
            order: [[orderBy, orderDir]]
        });
    }

    static handleValidationErrors(errors) {
        let ret = {
            __typename: 'validation'
        };

        let i = 0;
        errors.errors.map(({path, message, value}) => {
            ret[i++] = {
                path,
                message,
                value,
            };
        });

        throw new UserError(ret);
    }
}
