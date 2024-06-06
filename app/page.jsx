'use client';

import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { LoginContext } from './provider';

export default function Home() {
	const { user } = useContext(LoginContext);
	const [emails, setEmails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	console.log('user: ', user?.username);

	useEffect(() => {
		const getEmails = async () => {
			if (user) {
				const res = await fetch(`/api/email/${user?.username}`);
				const data = await res.json();
				setEmails(data.emails);
			}
		};
		getEmails();
	}, [user]);
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
