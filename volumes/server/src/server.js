import http from 'http';
import {Models} from '../db/models/index';
import express from 'express';
import {ApolloServer, GraphQLUpload, PubSub} from 'apollo-server-express';
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} from 'graphql';
const {maskErrors} = require('graphql-errors');
import {userType} from '../db/models/index';
import cors from 'cors';

const {User} = Models;
const port = 8182;

const pubsub = new PubSub();

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            userMe: {
                type: userType,
                resolve: function(source, args, context) {
                    return User.getLoggedUser(context.authToken);
                }
            },
            adminUsers: {
                type: new GraphQLObjectType({
                    name: 'UserPagination',
                    fields: {
                        page: { type: GraphQLInt },
                        limit: { type: GraphQLInt },
                        total: { type: GraphQLInt },
                        items: { type: new GraphQLList(userType) }
                    }
                }),
                args: {
                    page: {
                        description: 'Current page',
                        type: new GraphQLNonNull(GraphQLInt),
                    },
                    limit: {
                        description: 'Limit result',
                        type: new GraphQLNonNull(GraphQLInt),
                    },
                    orderBy: {
                        description: 'Order by',
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    orderDir: {
                        description: 'Order by direction',
                        type: new GraphQLNonNull(GraphQLString),
                    },
                },
                resolve: async function(source, args, context) {
                    const user = await User.getLoggedUser(context.authToken);
                    if (!user) {
                        throw new Error('No-admin user try to access admin page.');
                    }

                    const users = await User.getUsers(args);
                    return {
                        page: args.page,
                        limit: args.limit,
                        total: users.count,
                        items: users.rows,
                    };
                }
            },
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
            login: {
                type: userType,
                args: {
                    username: {
                        description: 'username of the user',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        description: 'password of the user',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(source, args) {
                    return User.login(args);
                }
            },
            register: {
                type: userType,
                args: {
                    email: {
                        description: 'email of the user',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    username: {
                        description: 'username of the user',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        description: 'password of the user',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(source, args) {
                    return User.register(args).then(function(data) {
                        pubsub.publish('ADMIN_NEW_USER', {'ADMIN_NEW_USER': data});

                        return data;
                    });
                }
            },
            editProfil: {
                type: userType,
                args: {
                    email: {
                        description: 'email of the user',
                        type: GraphQLString
                    },
                    username: {
                        description: 'username of the user',
                        type: GraphQLString
                    },
                    password: {
                        description: 'password of the user',
                        type: GraphQLString
                    }
                },
                resolve: async function(source, args, context) {
                    return User.edit(await User.getLoggedUser(context.authToken), args, false);
                }
            },
            uploadImgProfil: {
                type: userType,
                args: {
                    file: {
                        description: 'file of the user profil image',
                        type: GraphQLUpload
                    },
                },
                resolve: async function(source, args, context) {
                    return User.uploadImgProfil(await User.getLoggedUser(context.authToken), args.file);
                }
            },
            adminUserEditProfil: {
                type: userType,
                args: {
                    id: {
                        description: 'id of the user',
                        type: GraphQLInt,
                    },
                    isActive: {
                        description: 'user is active?',
                        type: GraphQLBoolean,
                    },
                    email: {
                        description: 'email of the user',
                        type: GraphQLString,
                    },
                    username: {
                        description: 'username of the user',
                        type: GraphQLString,
                    },
                    password: {
                        description: 'password of the user',
                        type: GraphQLString,
                    },
                    registratedAt: {
                        description: 'registration date of the user',
                        type: GraphQLString,
                    }
                },
                resolve: async function(source, args) {
                    let editUser = await User.findOne({where: {'id': args.id}});

                    return User.edit(editUser, args, true);
                }
            },
            adminUserUploadImgProfil: {
                type: userType,
                args: {
                    id: {
                        description: 'id of the user',
                        type: GraphQLInt,
                    },
                    file: {
                        description: 'file of the user profil image',
                        type: GraphQLUpload
                    },
                },
                resolve: async function(source, args) {
                    let editUser = await User.findOne({where: {'id': args.id}});

                    return User.uploadImgProfil(editUser, args.file);
                }
            },
        }
    }),
    subscription: new GraphQLObjectType({
        name: 'RootSubscriptionType',
        fields: {
            ADMIN_NEW_USER: {
                type: userType,
                subscribe: function() {
                    return pubsub.asyncIterator(['ADMIN_NEW_USER']);
                }
            }
        }
    })
});

maskErrors(schema);

const server = new ApolloServer({
    schema,
    context: (req) => {
        let authToken = req && req.req && req.req.headers
            ? req.req.header('x-auth-token')
            : null;

        return {authToken};
    },
    subscriptions: {
        path: '/subscription'
    }
});

const app = express();
app.use(express.static('public'));
app.use(cors({credentials: true}));
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port}, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
    // eslint-disable-next-line no-console
    console.log(`Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
});
