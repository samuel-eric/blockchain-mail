'use client';

import { useContext, useState, useEffect } from 'react';
import Header from '@/components/Header';
import { LoginContext } from '../provider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const page = () => {
	const [usernames, setUsernames] = useState(null);
	const [approvedSenders, setApprovedSenders] = useState([]);
	const [initialApprovedSenders, setInitialApprovedSenders] = useState([]);
	const { user } = useContext(LoginContext);
	const router = useRouter();
	useEffect(() => {
		const getUsers = async () => {
			const res = await fetch('/api/user');
			const data = await res.json();
			const usernames = data.users.map((user) => user.username);
			setUsernames(usernames);
		};
		getUsers();
	}, []);
	useEffect(() => {
		const getInitialPermission = async () => {
			if (user !== undefined && user !== null) {
				const res = await fetch(`/api/permission/${user.username}`);
				const data = await res.json();
				setApprovedSenders(data.approvedSenders);
				setInitialApprovedSenders(data.approvedSenders);
				console.log(data.approvedSenders);
			}
		};
		getInitialPermission();
	}, [user]);
	const handleChange = (value) => {
		if (!approvedSenders.includes(value)) {
			setApprovedSenders((old) => [...old, value]);
		} else {
			setApprovedSenders((old) => old.filter((o) => o !== value));
		}
		console.log(approvedSenders);
	};
	const handleSubmit = async () => {
		// cek butuh ditambah ke blockchain ga (hanya ditambah kalau ada perubahan)
		let isSame = true;
		approvedSenders.forEach((sender) => {
			if (!initialApprovedSenders.includes(sender)) {
				isSame = false;
			}
		});
		initialApprovedSenders.forEach((sender) => {
			if (!approvedSenders.includes(sender)) {
				isSame = false;
			}
		});
		console.log(isSame);
		if (!isSame) {
			const res = await fetch('/api/permission', {
				method: 'POST',
				body: JSON.stringify({
					username: user.username,
					pubKey: user.publicKey,
					approvedSenders,
				}),
			});
			const data = await res.json();
		}
		router.push('/');
		toast.success('Approved senders updated');
	};

	return (
		<main className='bg-slate-100 h-full rounded-lg box-border text-slate-900 overflow-auto'>
			<Header />
			<div className='flex justify-center items-center h-5/6'>
				<div className='bg-slate-50 rounded-lg shadow-md w-1/3 px-6 py-14'>
					<h1 className='font-semibold text-3xl mb-4 text-center'>
						Add Approved Sender
					</h1>
					{usernames === null && (
						<span className='animate-bounce text-center block my-2 text-xl'>
							Loading...
						</span>
					)}
					{usernames?.length === 0 && (
						<span className='text-center text-xl'>
							There is no other users...
						</span>
					)}
					{usernames?.length > 0 && (
						<>
							<div className='border-2 rounded overflow-auto max-h-24'>
								{usernames.map((username) => {
									if (username !== user?.username) {
										return (
											<div
												className='flex w-full gap-2 items-center text-center border-y p-2 px-4'
												key={username}
											>
												<input
													type='checkbox'
													className='scale-150 me-2 block cursor-pointer'
													id={username}
													value={username}
													onChange={(e) => handleChange(e.target.value)}
													checked={approvedSenders.includes(username)}
												/>
												<label
													htmlFor={username}
													className='block cursor-pointer'
												>
													{username}
												</label>
											</div>
										);
									}
								})}
							</div>
							<button
								className='btn-primary w-full mt-5 justify-center'
								onClick={handleSubmit}
							>
								Add
							</button>
						</>
					)}
				</div>
			</div>
		</main>
	);
};

export default page;
