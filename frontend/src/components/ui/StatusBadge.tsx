import { USER_STATUS_LABELS, type UserStatus } from '../../types/user';

export function StatusBadge({ status }: { status: UserStatus }) {
  return <span className={`badge badge--${status}`}>{USER_STATUS_LABELS[status]}</span>;
}
