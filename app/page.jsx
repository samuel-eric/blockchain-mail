'use client';

import Header from '@/components/Header';
import Email from '@/components/Email';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { LoginContext } from './provider';

export default function Home() {
	const { user } = useContext(LoginContext);
	const [emails, setEmails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	console.log('user: ', user?.username);
	console.log('emails: ', emails);

	useEffect(() => {
		const getEmails = async () => {
			setIsLoading(true);
			if (user) {
				const res = await fetch(`/api/email/${user?.username}`);
				const data = await res.json();
				console.log(data);
				setEmails(data.emails);
			}
			setIsLoading(false);
		};
		getEmails();
	}, [user]);
	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			{user !== null ? (
				emails === null || isLoading ? (
					<div className='flex justify-center items-center h-5/6'>
						<span className='animate-bounce text-2xl'>Loading...</span>
					</div>
				) : emails.length === 0 ? (
					<div className='flex justify-center items-center h-5/6'>
						<span className='text-2xl'>There is no email for you</span>
					</div>
				) : (
					<div className='container mx-auto my-5 p-1'>
						<h1 className='text-4xl font-semibold my-5 mb-5'>
							{emails.length === 1
								? `Hello ${user.username}, there is 1 email for you`
								: `Hello ${user.username}, there are ${emails.length} emails for you`}
						</h1>
						<div className='flex flex-col gap-4'>
							{emails.map((email) => (
								<Email email={email} key={email.signature} />
							))}
						</div>
					</div>
				)
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
