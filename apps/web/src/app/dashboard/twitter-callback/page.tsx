import { redirect } from 'next/navigation';

// Retire old bookmarks and in-flight callbacks without processing OAuth codes.
export default function RetiredAccountCallback() {
  redirect('/dashboard/profile');
}
