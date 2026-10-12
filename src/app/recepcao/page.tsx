import { Reception } from '@/components/reception';
import { MockReady } from '@/lib/store';
export default function Page() {
  return <MockReady>
    <Reception />
  </MockReady>;
}
