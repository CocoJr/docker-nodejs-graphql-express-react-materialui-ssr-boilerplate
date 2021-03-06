import React from 'react';
import {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {createGenerateClassName, MuiThemeProvider,} from '@material-ui/core/es/styles/index';
import Theme from './app/Theme/theme';
import ReactDOMServer from 'react-dom/server';
import cookieParser from 'cookie-parser';
import express from 'express';
import fetch from 'node-fetch';
import {ApolloProvider, getDataFromTree} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {StaticRouter} from 'react-router-dom';
import {createUploadLink} from 'apollo-upload-client/lib/main/index';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import App from './app/Component/Core/app';
import Loadable from 'react-loadable';
import {I18nextProvider} from 'react-i18next';
import i18n from './app/locales/server';
import {Helmet} from 'react-helmet';
import Moment from 'react-moment';
import {handle as middlewareI18nHandle} from 'i18next-express-middleware';
import PropTypes from 'prop-types';
import {combineReducers, compose, createStore} from "redux";
import {AppReducer} from "./app/Reducer/AppReducer";
import Provider from "react-redux/es/components/Provider";

const server = express();

server.use(middlewareI18nHandle(i18n));
server.use(cookieParser());
server.use('/dist', express.static('dist'));

server.use((req, res) => {
    let language = req.url.replace(/^\/(fr|en)\/.*$/, '$1');
    if (!language.match(/(fr|en)/)) {
        language = i18n.options.fallbackLng[0];
        res.redirect('/' + language + req.url);
    }

    req.i18n.on('languageChanged', function (lng) {
        Moment.globalLocale = lng;
        switch (lng) {
            case 'fr':
                Moment.globalFormat = 'DD/MM/YYYY HH:mm';
                break;
            case 'en':
                Moment.globalFormat = 'YYYY-MM-DD hh:mma';
                break;
        }
    });
    req.i18n.changeLanguage(language);

    const generateClassName = createGenerateClassName();

    let disableStylesGeneration = true;
    const getDisableStylesGeneration = () => disableStylesGeneration;

    const uploadLink = createUploadLink({
        fetch: fetch,
        uri: 'http://server:8182/graphql',
        credentials: 'same-origin',
        headers: {
            cookie: req.header('Cookie'),
        },
    });

    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                'X-Auth-Token': req.cookies['token'],
                'X-Locale': req.i18n.language,
            }
        };
    }).concat(uploadLink);

    const client = new ApolloClient({
        ssrMode: true,
        link: authLink,
        cache: new InMemoryCache(),
    });

    const store = createStore(
        combineReducers({
            AppReducer: AppReducer,
        }),
        {}, // initial state
        compose(
            // If you are using the devToolsExtension, you can add it here also
            f => f,
        )
    );

    const sheetsRegistry = new SheetsRegistry();

    const app = <Server
        client={client}
        store={store}
        req={req}
        sheetsRegistry={sheetsRegistry}
        getDisableStylesGeneration={getDisableStylesGeneration}
        generateClassName={generateClassName}
    />;

    getDataFromTree(app).then(() => {
        disableStylesGeneration = false;
        const content = ReactDOMServer.renderToStaticMarkup(app);
        const initialState = client.extract();
        const css = sheetsRegistry.toString();
        const helmet = Helmet.renderStatic();

        const html = <Html content={content} state={initialState} css={css} helmet={helmet}/>;

        res.status(200);
        res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
        res.end();
    }).catch((error) => {
        res.status(500);
        res.send(`<!doctype html><html>ERROR !<br>${error}</html>`);
        res.end();
    });
});

Loadable.preloadAll().then(() => {
    // eslint-disable-next-line no-console
    server.listen(8181, () => console.log('Server is ready'));
});

class Html extends React.Component {
    render() {
        const {content, state, css, helmet} = this.props;

        return (
            <html lang="fr">
                <head>
                    {helmet && helmet.title.toComponent()}
                    {helmet && helmet.meta.toComponent()}
                    {helmet && helmet.link.toComponent()}
                </head>
                <body>
                    <div id="root" dangerouslySetInnerHTML={{__html: content}}></div>
                    <script dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
                    }}></script>
                    <style id="jss-server-side" dangerouslySetInnerHTML={{__html: css}}></style>
                    <script src="/dist/vendor.js"></script>
                    <script src="/dist/bundle.js"></script>
                </body>
            </html>
        );
    }
}

Html.propTypes = {
    content: PropTypes.string,
    state: PropTypes.object,
    css: PropTypes.string,
    helmet: PropTypes.object,
    generateClassName: PropTypes.func,
};

class Server extends React.Component {
    render() {
        const {client, req, sheetsRegistry, getDisableStylesGeneration, generateClassName, store} = this.props;
        const context = {};

        return (
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider
                    theme={Theme}
                    sheetsManager={new Map()}
                    disableStylesGeneration={getDisableStylesGeneration()}
                >
                    <Provider store={store}>
                        <ApolloProvider client={client}>
                            <I18nextProvider i18n={req.i18n} initialLanguage={req.i18n.language}>
                                <StaticRouter location={req.url} context={context}>
                                    <App />
                                </StaticRouter>
                            </I18nextProvider>
                        </ApolloProvider>
                        </Provider>
                </MuiThemeProvider>
            </JssProvider>
        );
    }
}

Server.propTypes = {
    client: PropTypes.instanceOf(ApolloClient),
    req: PropTypes.object,
    sheetsRegistry: PropTypes.instanceOf(SheetsRegistry),
    getDisableStylesGeneration: PropTypes.func,
    generateClassName: PropTypes.func,
    store: PropTypes.object,
};
