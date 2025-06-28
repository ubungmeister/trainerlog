import { useGetUsers } from "hooks/users/useGetUsers";
import { type UserType } from "types/userType";
import UserItem from "./UserItem";
import { userModalStore } from "app/store/user/userModalStore";
export const UsersList = () => {
  const { data: users, isLoading } = useGetUsers();

  const openModal = userModalStore((state) => state.openModal);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-white max-h-min min-w-[80%] md:min-w-[400px] p-4 rounded-3xl  ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2 px-2">
          <h2 className="text-3xl font-bold text-primaty-text mb-3">Clients</h2>
          <button
            onClick={() => openModal()}
            className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
          >
            Add Client
          </button>
        </div>
        <div className="border-2 border-primary-button rounded-3xl">
          {users.map((user: UserType) => (
            <UserItem key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
