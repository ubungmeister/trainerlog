import { UsersList } from "../../components/users/UsersList";
import { useGetUsers } from "../../services/users/useGetUsers";
import { UserFormModal } from "../../components/users/UserFormModal";
import { userModalStore } from "../../app/store/user/userModalStore";
export const Home = () => {
  //fetch all clients for the trainer
  const { data: users, isLoading } = useGetUsers();
  const isOpen = userModalStore((state) => state.isOpen);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!users) {
    return <div>No clients found</div>;
  }
  return (
    <div className="app-container justify-center">
      <UsersList />
      {isOpen && <UserFormModal />}
    </div>
  );
};
