import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App/App'
import { Provider } from 'react-redux'
import store from './components/store/store'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
                console.log('SW registered:', reg);
            })
            .catch((err) => {
                console.log('SW registration failed:', err);
            });
    });
}

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <App />
    </Provider>
)