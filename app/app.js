
import { useRouter } from 'next/router';
import Home from './page';


export default function App() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push('/competition')}>Go to Competition</button>
      <Home />
 
    </div>
  );
}