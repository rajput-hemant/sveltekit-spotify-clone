import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

type Toast = {
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	id: string;
};

const createToastStore = () => {
	const { subscribe, update } = writable<Toast[]>([]);

	const addToast = ({ id, type, message, timeout = 3000 }: Toast & { timeout?: number }) => {
		update((toasts) => [...toasts, { id, type, message }]);

		if (timeout) {
			setTimeout(() => removeToast(id), timeout);
		}
	};

	const removeToast = (id: string) => {
		update((toasts) => toasts.filter((t) => t.id !== id));
	};

	return {
		subscribe,
		info: (message: string, timeout?: number) =>
			addToast({
				id: uuid(),
				type: 'info',
				message,
				timeout
			}),

		warning: (message: string, timeout?: number) =>
			addToast({
				id: uuid(),
				type: 'warning',
				message,
				timeout
			}),

		success: (message: string, timeout?: number) =>
			addToast({
				id: uuid(),
				type: 'success',
				message,
				timeout
			}),

		error: (message: string, timeout?: number) =>
			addToast({
				id: uuid(),
				type: 'error',
				message,
				timeout
			}),

		remove: (id: string) => removeToast(id)
	};
};

export default createToastStore();
