'use client';

import { useState, useContext } from 'react';
import Header from '@/components/Header';
import { LoginContext } from '../provider';
import userData from '@/data/db.json';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
	const { user, setUser } = useContext(LoginContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [walletAddress, setWalletAddress] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	const handleSignUp = async () => {
		if (username === '' || password === '' || walletAddress === '') {
			setError('Please input all fields');
		}
		const res = await fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify({ username, password, walletAddress }),
		});
	};
	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			<div className='flex justify-center items-center h-5/6'>
				<div className='flex flex-col gap-5 bg-slate-50 rounded-lg shadow-md w-1/3 px-6 py-14 justify-center items-center'>
					<h1 className='font-semibold text-3xl mb-4'>Sign Up</h1>
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
					<input
						type='text'
						placeholder='Wallet address'
						className='block p-3 rounded w-10/12'
						value={walletAddress}
						onChange={(e) => setWalletAddress(e.target.value)}
					/>
					<button className='btn-primary' onClick={handleSignUp}>
						Sign up
					</button>
					<Link href='/login' className='underline'>
						Have account? Login
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