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
	const [walletAddress, setWalletAddress] = useState('');
	const router = useRouter();
	const checkDuplicate = async (username, walletAddress) => {
		const res = await fetch('/api/user');
		const data = await res.json();
		const userData = data.users;
		for (let i = 0; i < userData.length; i++) {
			if (
				userData[i].username === username ||
				userData[i].walletAddress === walletAddress
			) {
				return true;
			}
		}
		return false;
	};
	const handleSignUp = async () => {
		if (username === '' || password === '' || walletAddress === '') {
			toast.error('Please input all fields');
		} else {
			const isDuplicate = await checkDuplicate(username, walletAddress);
			if (isDuplicate) {
				toast.error('Username or address has taken');
			} else {
				const res = await fetch('/api/user', {
					method: 'POST',
					body: JSON.stringify({ username, password, walletAddress }),
				});
				const data = await res.json();
				login(data.user);
				router.push('/');
				toast.success(`Signed up as ${data.user.username}`);
			}
		}
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
				</div>
			</div>
		</main>
	);
};

export default Login;
