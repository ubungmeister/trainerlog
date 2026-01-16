import { UsersList } from "components/users/UsersList";
import { UserFormModal } from "components/users/UserFormModal";
import { userModalStore } from "app/store/user/userModalStore";
export default function Home() {
  //fetch all clients for the trainer
  const isOpen = userModalStore((state) => state.isOpen);

  return (
    <div className="page-container">
      <div className="page-content-box">
        <UsersList />
        {isOpen && <UserFormModal />}
      </div>
    </div>
  );
}
