'use client';

import { useState, useContext } from 'react';
import Header from '@/components/Header';
import { LoginContext } from '../provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Login = () => {
	const { login } = useContext(LoginContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const handleLogin = async () => {
		if (username === '' || password === '') {
			toast.error('Please input username and password');
		} else {
			const res = await fetch(`/api/user/${username}`);
			const data = await res.json();
			const userData = data.user;
			if (userData !== undefined) {
				if (userData.password === password) {
					login(userData);
					router.push('/');
					toast.success(`Logged in as ${userData.username}`);
				}
			} else {
				toast.error('Incorrect username or password');
			}
		}
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
				</div>
			</div>
		</main>
	);
};

export default Login;
