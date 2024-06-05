'use client';

import { useState, useEffect, createContext } from 'react';

export const LoginContext = createContext();

export function Provider({ children }) {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const usernameLocal = localStorage.getItem('user')
			? localStorage.getItem('user')
			: null;
		if (usernameLocal) {
			const getUserData = async (username) => {
				const res = await fetch(`/api/user/${username}`);
				const data = await res.json();
				console.log(data);
				setUser(data.user);
			};
			getUserData(usernameLocal);
		}
	}, []);
	const login = (data) => {
		setUser(data);
		localStorage.setItem('user', data.username);
	};
	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
	};
	return (
		<LoginContext.Provider value={{ user, login, logout }}>
			{children}
		</LoginContext.Provider>
	);
}
