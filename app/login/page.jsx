'use client';

import { useState, useContext } from 'react';
import Header from '@/components/Header';
import { LoginContext } from '../provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
	const { login } = useContext(LoginContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	const handleLogin = async () => {
		if (username === '' || password === '') {
			setError('Please input username and password');
		}
		const res = await fetch('/api/user');
		const data = await res.json();
		const userData = data.users;
		let isLoggedIn = false;
		userData.forEach((data) => {
			if (data.username === username) {
				if (data.password === password) {
					login(data);
					isLoggedIn = true;
				}
			}
		});
		if (!isLoggedIn) {
			setError('Incorrect username or password');
		} else {
			router.push('/');
		}
		console.log(userData);
	};
	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			<div className='flex justify-center items-center h-5/6'>
				<div className='flex flex-col gap-5 bg-slate-50 rounded-lg shadow-md w-1/3 px-6 py-14 justify-center items-center'>
					<h1 className='font-semibold text-3xl mb-4'>Login</h1>
					<input
						type='text'
						placeholder='Username'
						className='block p-3 rounded w-10/12'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type='password'
						placeholder='Password'
						className='block p-3 rounded w-10/12'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className='btn-primary' onClick={handleLogin}>
						Login
					</button>
					<Link href='/sign-up' className='underline'>
						Don't have account? Sign up
					</Link>
					{error !== '' && (
						<div className='bg-red-200 w-10/12 p-3 flex justify-center items-center rounded-md'>
							{error}
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default Login;
