'use client';

import { useState } from 'react';

const Email = ({ email }) => {
	const [isExpand, setIsExpand] = useState(false);
	return (
		<div
			className={`p-4 bg-slate-50 rounded shadow-md w-full cursor-pointer ${
				isExpand && 'h-fit'
			}`}
			onClick={() => setIsExpand((old) => !old)}
		>
			<h3 className='text-2xl my-2'>{email.subject}</h3>
			<span className='text-sm my-2 block'>
				{new Date(Number(email.timestamp)).toLocaleDateString()} |{' '}
				{email.sender}
			</span>
			<p className={`text-base ${!isExpand && 'truncate'}`}>{email.body}</p>
		</div>
	);
};

export default Email;
