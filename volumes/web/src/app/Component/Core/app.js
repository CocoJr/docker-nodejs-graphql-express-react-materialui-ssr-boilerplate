/*
 * @author Thibault Colette <thibaultcolette06@hotmail.fr>
 * @copyright 2018 Thibault Colette
 */
// Import npm package
import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {withRouter} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {withApollo} from 'react-apollo';
// Import utils
import {isAdmin, isUser} from '../../Util/core';
// Import Spinner for loadable
import Spinner from './spinner';
// Import routes
import UserProtectedRoute from './UserProtectedRoute';
import {URL_ADMIN_USERS, URL_DASHBOARD, URL_LOGIN, URL_LOGOUT, URL_PROFIL, URL_REGISTER} from '../../routes';
// Material-ui styles && elements
import styles from '../../Theme/app.css.js';
import classNames from 'classnames';
import withStyles from '@material-ui/core/es/styles/withStyles';
import Dialog from '@material-ui/core/es/Dialog/Dialog';
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/es/DialogContentText/DialogContentText';
import Slide from '@material-ui/core/es/Slide/Slide';

import {Helmet} from 'react-helmet';
// Import graphQL
import Query from 'react-apollo/Query';
import userMeGql from '../../Gql/User/me';
import adminNewUserSubscription from '../../Gql/Admin/User/adminNewUserSubscription';
// const NotFoundPage = Loadable({
//     loader: () => import('../../Page/Common/NotFoundPage'),
//     loading: Spinner,
// });
import NotFoundPage from '../../Page/Common/NotFoundPage';
// const UserLoginPage = Loadable({
//     loader: () => import('../../Page/User/UserLoginPage'),
//     loading: Spinner,
// });
import UserLoginPage from '../../Page/User/UserLoginPage';
// const UserRegisterPage = Loadable({
//     loader: () => import('../../Page/User/UserRegisterPage'),
//     loading: Spinner,
// });
import UserRegisterPage from '../../Page/User/UserRegisterPage';
// const UserLogoutPage = Loadable({
//     loader: () => import('../../Page/User/UserLogoutPage'),
//     loading: Spinner,
// });
import UserLogoutPage from '../../Page/User/UserLogoutPage';
// const UserProfilPage = Loadable({
//     loader: () => import('../../Page/User/UserProfilPage'),
//     loading: Spinner,
// });
import UserProfilPage from '../../Page/User/UserProfilPage';
// const UserDashboardPage = Loadable({
//     loader: () => import('../../Page/User/UserDashboardPage'),
//     loading: Spinner,
// });
import UserDashboardPage from '../../Page/User/UserDashboardPage';
// const AdminUserListPage = Loadable({
//     loader: () => import('../../Page/Admin/User/AdminUserListPage'),
//     loading: Spinner,
// });
import AdminUserListPage from '../../Page/Admin/User/AdminUserListPage';

import {translate} from 'react-i18next';
import UIAppBar from '../UI/UIAppBar';
import UIAppDrawer from '../UI/UIAppDrawer';
import {AdminSubscription} from '../Subscription/admin';
import ApolloConsumer from 'react-apollo/ApolloConsumer';
import ReactMaterialUiNotifications from 'react-materialui-notifications';
import moment from 'moment';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {setIsApp} from "../../Reducer/AppReducer";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

/**
 * App main class
 */
class App extends Component {
    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    /**
     * Bind function to this
     * Set default state
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            adminOpen: false,
            anchorEl: null,
        };

        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.handleAdminCollapse = this.handleAdminCollapse.bind(this);
    }

    getParameterByName(name) {
        name = name.replace(/[[\]]/g, '\\$&');

        let url = this.props.location.search;
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);

        if (!results) return null;

        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
     * Render the global errors in dialog
     *
     * @returns <Dialog/>
     */
    static renderErrors({error, title = 'Error', open = true}) {
        return (
            <Dialog
                key={'error-dialog'}
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                TransitionComponent={Transition}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {error.message}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }

    /**
     * MAIN RENDER
     *
     * @returns {*}
     */
    render() {
        const {dispatch, location, classes, i18n, t, isApp} = this.props;

        let newIsApp = this.getParameterByName('isApp') === '1';
        if (isApp !== newIsApp) {
            dispatch(setIsApp(newIsApp));
            return null;
        }

        if (isApp) {
            return App.renderErrors({title: 'MOBILE', error: 'TU ES SUR MOBILE !'});
        }

        return (
            <Query query={userMeGql}>
                {({subscribeToMore, loading, error, data}) => {
                    if (loading) return <Spinner plainPage={true}/>;
                    if (error) return App.renderErrors({error});

                    let user = data ? data.userMe : null;

                    const open = (this.state.open && isUser(user));

                    return (
                        <div className={classes.root}>
                            <Helmet>
                                <title>MyApp</title>
                                <meta name="description" content="Welmcome to my app!"/>
                                <meta name="viewport"
                                      content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
                                <link rel="icon" type="image/png" href="/dist/img/favicon.png"/>
                                <link rel="stylesheet" type="text/css"
                                      href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.css"/>
                            </Helmet>
                            <div className={classes.appFrame}>
                                <UIAppBar
                                    classes={classes}
                                    t={t}
                                    i18n={i18n}
                                    user={user}
                                    open={this.state.open}
                                    adminOpen={this.state.adminOpen}
                                    anchorEl={this.state.anchorEl}
                                    handleDrawerOpen={this.handleDrawerOpen}
                                    handleDrawerClose={this.handleDrawerClose}
                                    handleMenu={this.handleMenu}
                                    handleCloseMenu={this.handleCloseMenu}
                                    handleChangeLanguageFr={this.handleChangeLanguage.bind(this, 'fr')}
                                    handleChangeLanguageEn={this.handleChangeLanguage.bind(this, 'en')}

                                />
                                <UIAppDrawer
                                    classes={classes}
                                    t={t}
                                    i18n={i18n}
                                    user={user}
                                    open={this.state.open}
                                    adminOpen={this.state.adminOpen}
                                    anchorEl={this.state.anchorEl}
                                    handleAdminCollapse={this.handleAdminCollapse}
                                />
                                <ReactMaterialUiNotifications
                                    desktop={false}
                                    transitionName={{
                                        leave: 'dummy',
                                        leaveActive: 'fadeOut',
                                        appear: 'dummy',
                                        appearActive: 'zoomInUp'
                                    }}
                                    transitionAppear={true}
                                    transitionLeave={true}
                                    rootStyle={{zIndex: 1200, right: 0}}
                                    maxNotifications={3}
                                />
                                {this.renderSubscriptionsAlert(user, subscribeToMore)}
                                <TransitionGroup component="main" className={classNames(classes.content, {
                                    [classes.contentShift]: open,
                                })} onClick={this.handleDrawerClose}>
                                    <CSSTransition key={location.pathname}
                                                   timeout={{enter: 1200, exit: 600}}
                                                   enter={true}
                                                   exit={false}
                                                   classNames={'fade'}
                                                   appear
                                    >
                                        <Switch location={location}>
                                            <Route exact path={URL_LOGIN} component={UserLoginPage}/>
                                            <Route exact path={'/' + i18n.language + URL_LOGIN}
                                                   component={UserLoginPage}/>
                                            <Route exact path={'/' + i18n.language + URL_REGISTER}
                                                   component={UserRegisterPage}/>
                                            <UserProtectedRoute user={user} exact
                                                                path={'/' + i18n.language + URL_LOGOUT}
                                                                component={UserLogoutPage}/>
                                            <UserProtectedRoute user={user} exact
                                                                path={'/' + i18n.language + URL_PROFIL}
                                                                component={UserProfilPage}/>
                                            <UserProtectedRoute user={user} exact
                                                                path={'/' + i18n.language + URL_DASHBOARD}
                                                                component={UserDashboardPage}/>
                                            <UserProtectedRoute user={user} exact
                                                                path={'/' + i18n.language + URL_ADMIN_USERS}
                                                                component={AdminUserListPage}/>
                                            <Route component={NotFoundPage}/>
                                        </Switch>
                                    </CSSTransition>
                                </TransitionGroup>
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }

    renderSubscriptionsAlert(user, subscribeToMore) {
        if (!isAdmin(user)) {
            return null;
        }

        return (
            <ApolloConsumer>
                {() => (
                    <AdminSubscription
                        subscribeToNewUsers={() =>
                            subscribeToMore({
                                document: adminNewUserSubscription,
                                updateQuery: (prev, {subscriptionData}) => {
                                    if (!subscriptionData.data) return prev;

                                    ReactMaterialUiNotifications.showNotification({
                                        title: 'New user',
                                        additionalText: 'New uer registrated: ' + subscriptionData.data['ADMIN_NEW_USER'].username,
                                        timestamp: moment().format('h:mm A'),
                                        autoHide: 3000,
                                    });

                                    return prev;
                                }
                            })
                        }
                    >
                    </AdminSubscription>
                )}
            </ApolloConsumer>
        );
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme()
        };
    }

    /**
     * Scroll to top when the route is changed
     *
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    /**
     * Open the Drawer (left sidebar)
     */
    handleDrawerOpen() {
        this.setState({open: true});
    }

    /**
     * Close the Drawer (left sidebar)
     */
    handleDrawerClose() {
        this.setState({open: false});
    }

    /**
     * Open anchor menu
     *
     * @param event
     */
    handleMenu(event) {
        this.setState({anchorEl: event.currentTarget});
    }

    /**
     * Close anchor menu
     */
    handleCloseMenu() {
        this.setState({anchorEl: null});
    }

    handleAdminCollapse() {
        this.setState({adminOpen: !this.state.adminOpen});
    }

    handleChangeLanguage(language) {
        const {location} = this.props;

        window.location.href = location.pathname.replace(/^\/(fr|en)\/(.*)?$/, '/' + language + '/$2');
    }
}

App.propTypes = {
    location: PropTypes.object,
    classes: PropTypes.object,
    i18n: PropTypes.object,
    t: PropTypes.func,
    isApp: PropTypes.bool,
    dispatch: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        isApp: state.AppReducer.isApp,
    };
}

export default withRouter(
    translate()(
        withApollo(
            withStyles(styles, {withTheme: true})(
                connect(mapStateToProps)(
                    App
                )
            )
        )
    )
);
