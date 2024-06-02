export const getItem = (key: string) => {
	if (typeof window === "undefined") {
		return null;
	}

	const itemStr = localStorage.getItem(key);

	if (!itemStr) {
		return null;
	}

	const item = JSON.parse(itemStr);
	const now = new Date();

	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key);
		return null;
	}
	return item.value;
};

export const setWithExpiry = (key: string, value: string, ttl: number) => {
	if (typeof window === "undefined") {
		return null;
	}

	const now = new Date();

	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	};
	localStorage.setItem(key, JSON.stringify(item));
};
