'use client';

import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { LoginContext } from './provider';

export default function Home() {
	const { user } = useContext(LoginContext);
	const router = useRouter();
	console.log(user);
	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			{user !== null ? (
				<div>This is email</div>
			) : (
				<div className='flex justify-center items-center h-5/6'>
					<button className='btn-primary' onClick={() => router.push('/login')}>
						Please log in first
					</button>
				</div>
			)}
		</main>
	);
}
