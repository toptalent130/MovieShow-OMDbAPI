import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/actions';

import {FaCriticalRole} from 'react-icons/fa';


const defaultFormState = {
	first_name: '',
	last_name: '',
	email: '',
	permission: '',
	password: '',
	avatar: 'assets/images/avatars/profile.jpg'
};

function UserDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);
	// const errors = useSelector(({ user }) => user.errors);
	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) {
			setForm({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...contactDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [contactDialog.data, contactDialog.type, setForm]);
	const [show, setShow] = React.useState({
		showPassword: false
	  });
	const handleClickShowPassword = () => {
		setShow({ showPassword: !show.showPassword });
	  };
	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	function closeComposeDialog(e) {
		if(e != undefined || e != null) {
			e.preventDefault();
		}
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}

	function canBeSubmitted() {
		return form.first_name.length > 0 && form.email.length > 0 && form.permission != '' && isEmailValidate();
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addContact(form));
		} else {
			dispatch(updateContact(form));
		}
		closeComposeDialog();
	}

	const [emailVali, setEmailVali] = useState(false);
	useEffect(() => {
		setEmailVali(isEmailValidate());
	}, [form]);
	const isEmailValidate = () => {
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(form.email)
	} 

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'New User' : 'Edit User'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					<Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} />
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{form.first_name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="pt-20 min-w-48">
							<Icon color="action">account_circle</Icon>
						</div>

						<TextField
							className="mb-24 mr-2"
							label="First Name"
							autoFocus
							id="first_name"
							name="first_name"
							value={form.first_name}
							onChange={handleChange}
							variant="outlined"
							error={form.first_name === ''}
						/>

						<TextField
							className="mb-24 ml-2"
							label="Last Name"
							id="lastName"
							name="last_name"
							value={form.last_name}
							onChange={handleChange}
							variant="outlined"
							error={form.last_name === ''}
						/>
					</div>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">email</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							variant="outlined"
							fullWidth
							error = {!emailVali}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">lock</Icon>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="password">Password</InputLabel>
							<OutlinedInput
								className="mb-24"
								labelId="password"
								label="password"
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								type={show.showPassword ? 'text' : 'password'}
								variant="outlined"
								fullWidth
								error={form.password === ''}
								endAdornment={
									<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
									>
										{show.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<FaCriticalRole size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="permission-label">Role</InputLabel>
							<Select
								labelId="permission-label"
								id="permission"
								name="permission"
								value={form.permission}
								onChange={handleChange}
								label="Role"
								fullWidth
								error={form.permission === ''}
							>
								<MenuItem value='user'>user</MenuItem>
								<MenuItem value='admin'>admin</MenuItem>
								<MenuItem value='manager'>manager</MenuItem>
								<MenuItem value='superadmin'>superadmin</MenuItem>
							</Select>
						</FormControl>
					</div>

				</DialogContent>

				{contactDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8 ">
						<div className="flex flex-1 items-center justify-center">
							<div className="px-16">
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
									type="submit"
									disabled={!canBeSubmitted()}
								>
									Add
								</Button>
							</div>
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									onClick={closeComposeDialog}
								>
									Cancel
								</Button>
							</div>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="flex flex-1 items-center justify-center">
							<div className="px-16">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!canBeSubmitted()}
								>
									Save
								</Button>
							</div>
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									onClick={closeComposeDialog}
								>
									Cancel
								</Button>
							</div>
						</div>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default UserDialog;
