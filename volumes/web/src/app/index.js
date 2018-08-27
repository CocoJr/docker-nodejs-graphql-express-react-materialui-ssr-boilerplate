import 'isomorphic-fetch';
import es6Promise from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {setContext} from 'apollo-link-context';
import {createUploadLink} from 'apollo-upload-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createBrowserHistory} from 'history';
import {Router} from 'react-router-dom';
import Main from './Component/Core/main';
import {getCookie} from './Util/core';
import {MuiThemeProvider} from '@material-ui/core/es/styles/index';
import Theme from './Theme/theme';
import {I18nextProvider} from 'react-i18next';
import i18n from './locales/client';
import Moment from 'react-moment';

es6Promise.polyfill();


if (document.getElementById('root') !== null) {
    const history = createBrowserHistory();

    let language = history.location.pathname.replace(/^\/(fr|en)\/.*$/, '$1');
    if (!language.match(/(fr|en)/)) {
        language = i18n.options.fallbackLng[0];
    }

    i18n.on('languageChanged', function (lng) {
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
    i18n.changeLanguage(language);

    // GraphQL
    const uploadLink = createUploadLink({
        uri: 'http://site.local:8080/graphql',
        credentials: 'same-origin',
    });

    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                'X-Auth-Token': getCookie('token'),
                'X-Locale': i18n.language,
            }
        };
    }).concat(uploadLink);

    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
        uri: 'ws://site.local:8080/subscription',
        options: {
            reconnect: true
        }
    });

    const finalLink = split(
        ({query}) => {
            const {kind, operation} = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        authLink,
    );

    const client = new ApolloClient({
        link: finalLink,
        cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    });

    ReactDOM.hydrate(
        <MuiThemeProvider theme={Theme}>
            <ApolloProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <Router history={history}>
                        <Main/>
                    </Router>
                </I18nextProvider>
            </ApolloProvider>
        </MuiThemeProvider>,
        document.getElementById('root')
    );
}
