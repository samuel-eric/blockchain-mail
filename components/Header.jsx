import React from 'react';
import Link from 'next/link';
import { MdEmail } from 'react-icons/md';

const Header = () => {
	return (
		<header className='flex items-center justify-between px-20 h-28 bg-slate-50 shadow-md'>
			<Link href='/'>
				<div className='flex gap-2 items-center'>
					<MdEmail className='text-4xl' />
					<h1 className='font-bold text-3xl'>Blockchain Mail</h1>
				</div>
			</Link>
			<div className='flex gap-6'>
				<button className='py-3 px-5 bg-blue-50 text-blue-700 font-semibold rounded-md hover:bg-blue-100 transition-all'>
					Log out
				</button>
				<button className='py-3 px-5 bg-blue-500 text-slate-100 font-semibold rounded-md hover:bg-blue-700 transition-all'>
					Add New Email
				</button>
			</div>
		</header>
	);
};

export default Header;
