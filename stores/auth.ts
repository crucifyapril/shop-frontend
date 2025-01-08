import {defineStore} from 'pinia';
import {parse} from 'cookie';

interface User {
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
    }),
    actions: {
        async login(email: string, password: string) {
            const config = useRuntimeConfig();

            const cookies = parse(document.cookie);
            const csrfToken = cookies['XSRF-TOKEN'] ?? '';

            try {
                await $fetch(`${config.public.apiBase}/api/auth/login`, {
                    method: 'POST',
                    body: {email, password},
                    headers: {'X-XSRF-TOKEN': csrfToken},
                    credentials: 'include',
                });
                await this.fetchUser();
                console.log('Успешный вход');
                console.log('isAuthenticated:', this.isAuth());

            } catch (error) {
                throw new Error('Неверные данные для входа');
            }
        },
        async fetchUser() {

            const config = useRuntimeConfig();
            try {
                await this.fetchCsrfToken();
                this.user = await $fetch<User>(`${config.public.apiBase}/api/auth/user`, {
                    credentials: 'include',
                });
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                this.user = null;
            }
        },
        async fetchCsrfToken() {
            try {
                const config = useRuntimeConfig();
                await $fetch(`${config.public.apiBase}/sanctum/csrf-cookie`, {
                    method: 'GET',
                    credentials: 'include',
                });
            } catch (error) {
                console.error('Ошибка при получении CSRF токена:', error);
            }
        },
        async logout() {
            const config = useRuntimeConfig();
            try {
                const cookies = parse(document.cookie);
                const csrfToken = cookies['XSRF-TOKEN'] ?? '';

                await this.fetchCsrfToken();
                await $fetch(`${config.public.apiBase}/api/auth/logout`, {
                    method: 'POST',
                    headers: {'X-XSRF-TOKEN': csrfToken},
                    credentials: 'include',
                });
                this.user = null;
                console.log('Выход выполнен');
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        },
        isAuth() {
            return this.user !== null;
        },
    },
    persist: true,
    // persist: {
    //     storage: import.meta.client ? localStorage : undefined,
    // },
});
