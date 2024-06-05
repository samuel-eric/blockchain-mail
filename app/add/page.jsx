'use client';

import { useContext, useState } from 'react';
import Header from '@/components/Header';
import { LoginContext } from '../provider';

const Add = () => {
	const { user } = useContext(LoginContext);
	const [receiver, setReceiver] = useState('');
	const [subject, setSubject] = useState('');
	const [body, setBody] = useState('');
	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			<div className='h-5/6 container mx-auto py-10'>
				<h1 className='text-3xl font-semibold'>Add new email</h1>
				<div className='flex flex-col mt-3 h-full w-full'>
					<div className='my-2 flex items-center gap-4'>
						<label htmlFor='sender' className='w-16'>
							Sender
						</label>
						<input
							type='text'
							id='sender'
							disabled
							value={`${user?.username} (@${user?.walletAddress})`}
							className='p-3 rounded flex-1'
						/>
					</div>
					<div className='my-2 flex items-center gap-4'>
						<label htmlFor='receiver' className='w-16'>
							Receiver
						</label>
						<input
							type='text'
							id='receiver'
							value={receiver}
							onChange={(e) => setReceiver(e.target.value)}
							className='p-3 rounded flex-1'
							placeholder='Enter receiver username'
						/>
					</div>
					<div className='my-2 mb-4 flex items-center gap-4'>
						<label htmlFor='subject' className='w-16'>
							Subject
						</label>
						<input
							type='text'
							id='subject'
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className='p-3 rounded flex-1'
							placeholder={`Enter email's subject`}
						/>
					</div>
					<hr />
					<div className='my-4 flex-1'>
						<label htmlFor='body' className='block mb-3'>
							Body
						</label>
						<textarea
							name='body'
							id='body'
							placeholder={`Enter email's body`}
							className='w-full h-5/6 p-3 my-2 rounded resize-none'
							value={body}
							onChange={(e) => setBody(e.target.value)}
						></textarea>
					</div>
					<div className='mt-4'>
						<button className='btn-primary w-full justify-center'>Send</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Add;
