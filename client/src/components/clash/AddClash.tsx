import { CustomUser } from '@/app/api/auth/[...nextauth]/options';
import { clearCache } from '@/app/actions/commonActions';

export default function AddClash({ user }: { user: CustomUser }) {}
