import { createRoot } from 'react-dom/client';
import Index from './pages/index.js';

const root = createRoot(document.querySelector('#root'));
root.render(<Index tab="home" />);
