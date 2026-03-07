import { UsersList, UserFormModal } from "components/users";
import { userModalStore } from "app/store/user";

export default function Users() {
  const isOpen = userModalStore((state) => state.isOpen);

  return (
    <div className="page-content-box">
      <UsersList />
      {isOpen && <UserFormModal />}
    </div>
  );
}
