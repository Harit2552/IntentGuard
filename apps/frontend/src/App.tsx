import type { JsonValue } from '@intentguard/shared';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

const placeholderContent = {
  title: 'IntentGuard',
  message: 'Project setup is ready.',
} satisfies JsonValue;

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage title={placeholderContent.title} message={placeholderContent.message} />}
      />
      <Route path="*" element={<main className="p-8">Page not found.</main>} />
    </Routes>
  );
}
