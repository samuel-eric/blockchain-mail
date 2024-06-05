'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { MdEmail, MdLogout } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import { LoginContext } from '@/app/provider';

const Header = () => {
	const { user, logout } = useContext(LoginContext);
	const handleLogout = () => {
		logout();
	};

	return (
		<header className='flex items-center justify-between px-20 h-28 bg-slate-50 shadow-md'>
			<Link href='/'>
				<div className='flex gap-3 items-center'>
					<MdEmail className='text-4xl' />
					<h1 className='font-bold text-3xl'>Blockchain Mail</h1>
				</div>
			</Link>
			{user !== null && (
				<div className='flex gap-6'>
					<button className='btn-secondary' onClick={handleLogout}>
						<MdLogout />
						Log out
					</button>
					<button className='btn-primary'>
						<FaPen />
						Add New Email
					</button>
				</div>
			)}
		</header>
	);
};

export default Header;
