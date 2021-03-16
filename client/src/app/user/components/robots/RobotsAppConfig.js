import React from 'react';
import { Redirect } from 'react-router-dom';

const RobotsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/robots',
			component: React.lazy(() => import('./RobotApp'))
		},
	]
};

export default RobotsAppConfig;
