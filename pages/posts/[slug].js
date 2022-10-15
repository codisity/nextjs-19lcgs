import { useRouter } from 'next/router';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;

  return <h1>Post {slug}</h1>;
}
