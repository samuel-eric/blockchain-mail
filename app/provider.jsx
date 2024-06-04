'use client';

import { useState, createContext } from 'react';

export const LoginContext = createContext();

export function Provider({ children }) {
	const [user, setUser] = useState(null);
	return (
		<LoginContext.Provider value={{ user, setUser }}>
			{children}
		</LoginContext.Provider>
	);
}
