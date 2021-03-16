import MomentUtils from '@date-io/moment';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import { createGenerateClassName, jssPreset, StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import React from 'react';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import store from './store';
import './App.css';
import jwt_decode from 'jwt-decode';
import { ConfirmProvider } from 'material-ui-confirm';
import { Auth } from './auth';

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend(), rtl()],
	insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName();

const App = () => {
	return (
		<AppContext.Provider
			value={{
				routes
			}}
		>
			<StylesProvider jss={jss} generateClassName={generateClassName}>
				<Provider store={store}>
				<ConfirmProvider>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<Router history={history}>
							<Auth>
								<FuseTheme>
									<FuseLayout />
								</FuseTheme>
							</Auth>
						</Router>
					</MuiPickersUtilsProvider>
				</ConfirmProvider>
				</Provider>
			</StylesProvider>
		</AppContext.Provider>
	);
};

export default App;
