/*
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
* @copyright 2018 Thibault Colette
*/

import React from 'react';
import Grid from '@material-ui/core/es/Grid/Grid';
import Typography from '@material-ui/core/es/Typography/Typography';
import withStyles from '@material-ui/core/es/styles/withStyles';
import styles from '../../Theme/form.css';
import AccountCircle from '@material-ui/icons/es/AccountCircle';
import {withApollo} from 'react-apollo/index';
import Query from 'react-apollo/Query';
import userMeGql from '../../Gql/User/me';
import App from '../../Component/Core/app';
import {translate} from 'react-i18next';
import Spinner from '../../Component/Core/spinner';
import Mutation from 'react-apollo/Mutation';
import uploadImgProfilMutation from '../../Gql/User/uploadImgProfil';
import editProfilMutation from '../../Gql/User/editProfil';
import InputField from '../../Component/Core/Form/InputField';
import ModeEditIcon from '@material-ui/icons/es/ModeEdit';
import DoneIcon from '@material-ui/icons/es/Done';
import GlobalFormErrors from '../../Component/Core/Form/GlobalFormErrors';
import {getFormErrors} from '../../Util/core';
import PropTypes from 'prop-types';

class UserProfilPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editEmail: false,
            editUsername: false,
        };
    }

    render() {
        const {classes, t} = this.props;

        return (
            <Grid container justify={'center'} spacing={16}>
                <Grid item xs={12}>
                    <Typography variant="headline" gutterBottom align="center">
                        {t('title')}
                    </Typography>
                </Grid>
                <Query query={userMeGql}>
                    {({loading, error, data}) => {
                        if (loading) return <Spinner/>;
                        if (error) return App.renderErrors({error});

                        let user = data ? data.userMe : null;

                        let editEmailField, editUsernameField = null;

                        return (
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6} key={0}>
                                    {user.imgProfil != null
                                        ? <img style={{maxWidth: '100%'}}
                                               src={'http://site.local:8080/' + user.imgProfil}/>
                                        : <AccountCircle/>
                                    }
                                    <Mutation mutation={uploadImgProfilMutation}>
                                        {(uploadImgProfil, {error}) => {
                                            let formErrors = getFormErrors(error);
                                            if (error && !formErrors) {
                                                return App.renderErrors({error});
                                            }

                                            return (
                                                <div>
                                                    <InputField
                                                        name={'imgProfil'}
                                                        id={'imgProfil'}
                                                        type={'file'}
                                                        label={t('imgProfilUpload')}
                                                        fullWidth={false}
                                                        errors={formErrors}
                                                        onChange={({target: {validity, files: [file]}}) => {
                                                            if (validity.valid) {
                                                                uploadImgProfil({
                                                                    variables: {
                                                                        file: file
                                                                    },
                                                                    refetchQueries: [{query: userMeGql}],
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }}
                                    </Mutation>
                                </Grid>
                                <Mutation mutation={editProfilMutation}>
                                    {(editProfil, {loading, error, data}) => {
                                        if (data && data.editProfil) {
                                            user = data.editProfil;
                                        }

                                        let formErrors = getFormErrors(error);
                                        if (error && !formErrors) {
                                            return App.renderErrors({error});
                                        }

                                        return (
                                            <Grid item xs={12} md={6} key={1}>
                                                {!loading && data &&
                                                <Grid item className={classes.item}>
                                                    <GlobalFormErrors errors={formErrors} t={t}/>
                                                </Grid>
                                                }

                                                <Grid container spacing={24}>
                                                    {(this.state.editEmail || InputField.getErrors(formErrors, 'email').length > 0) &&
                                                    <Grid item xs={12}>
                                                        <InputField
                                                            name={'email'}
                                                            id={'email'}
                                                            type={'text'}
                                                            label={t('email')}
                                                            fullWidth={false}
                                                            errors={formErrors}
                                                            endAdornment={
                                                                <DoneIcon style={{cursor: 'pointer'}}
                                                                          size={32}
                                                                          onClick={() => {
                                                                              let newUser = Object.assign({}, user);
                                                                              newUser.email = editEmailField.value;
                                                                              editProfil({
                                                                                  variables: {
                                                                                      email: newUser.email
                                                                                  },
                                                                                  refetchQueries: [{query: userMeGql}],
                                                                                  optimisticResponse: {
                                                                                      __typename: 'Mutation',
                                                                                      editProfil: {
                                                                                          ...newUser,
                                                                                      }
                                                                                  },
                                                                              });
                                                                              this.editField('editEmail', false);
                                                                          }}
                                                                />
                                                            }
                                                            defaultValue={user.email}
                                                            ref={node => {
                                                                if (node) {
                                                                    node = node.getElementsByTagName('input')[0];
                                                                }

                                                                editEmailField = node;
                                                            }}
                                                        />
                                                    </Grid> ||
                                                    <Grid item xs={12} className={classes.editSpan}
                                                          onClick={this.editField.bind(this, 'editEmail', true)}>
                                                        <b className={classes.bold}>{t('email')}</b>{': ' + user.email + ' '}<ModeEditIcon/>
                                                    </Grid>
                                                    }
                                                </Grid>
                                                <Grid container spacing={24}>
                                                    {(this.state.editUsername || InputField.getErrors(formErrors, 'username').length > 0) &&
                                                    <Grid item xs={12}>
                                                        <InputField
                                                            name={'username'}
                                                            id={'username'}
                                                            type={'text'}
                                                            label={t('username')}
                                                            fullWidth={false}
                                                            errors={formErrors}
                                                            endAdornment={
                                                                <DoneIcon style={{cursor: 'pointer'}}
                                                                          size={32}
                                                                          onClick={() => {
                                                                              let newUser = Object.assign({}, user);
                                                                              newUser.username = editUsernameField.value;
                                                                              editProfil({
                                                                                  variables: {
                                                                                      username: newUser.username,
                                                                                  },
                                                                                  refetchQueries: [{query: userMeGql}],
                                                                                  optimisticResponse: {
                                                                                      __typename: 'Mutation',
                                                                                      editProfil: {
                                                                                          ...newUser,
                                                                                      }
                                                                                  },
                                                                              });
                                                                              this.editField('editUsername', false);
                                                                          }}
                                                                />
                                                            }
                                                            defaultValue={user.username}
                                                            ref={node => {
                                                                if (node) {
                                                                    node = node.getElementsByTagName('input')[0];
                                                                }

                                                                editUsernameField = node;
                                                            }}
                                                        />
                                                    </Grid> ||
                                                    <Grid item xs={12} className={classes.editSpan}
                                                          onClick={this.editField.bind(this, 'editUsername', true)}>
                                                        <b className={classes.bold}>{t('username')}</b>{': ' + user.username + ' '}<ModeEditIcon/>
                                                    </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        );
                                    }}
                                </Mutation>
                            </Grid>
                        );
                    }}
                </Query>
            </Grid>
        );
    }

    editField(name, value) {
        let state = {};
        state[name] = value;

        this.setState(state);
    }
}

UserProfilPage.propTypes = {
    t: PropTypes.func,
    classes: PropTypes.object,
    i18n: PropTypes.object,
    history: PropTypes.object,
};

export default translate('profil')(
    withApollo(
        withStyles(styles, {withTheme: true})(
            UserProfilPage
        )
    )
);

