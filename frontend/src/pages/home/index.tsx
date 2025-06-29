import { UsersList } from "components/users/UsersList";
import { UserFormModal } from "components/users/UserFormModal";
import { userModalStore } from "app/store/user/userModalStore";
export const Home = () => {
  //fetch all clients for the trainer
  const isOpen = userModalStore((state) => state.isOpen);

  return (
    <div className="bg-primary-bg p-3 ">
      <div className=" min-h-screen bg-primary-surface rounded-3xl ">
        <UsersList />
        {isOpen && <UserFormModal />}
      </div>
    </div>
  );
};
