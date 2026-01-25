import { useGetUsers } from "hooks/users/useGetUsers";
import { type UserType } from "types/userType";
import { UserItem } from "./UserItem";
import { userModalStore } from "app/store/user/userModalStore";
import { DataLoading } from "components/ui/DataLoading";
import { Plus } from "lucide-react";

export const UsersList = () => {
  const { data: users, isLoading } = useGetUsers();

  const openModal = userModalStore((state) => state.openModal);

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-bg hover:bg-primary-bg/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No clients yet. Add your first client!
          </div>
        ) : (
          users.map((user: UserType) => <UserItem key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};
