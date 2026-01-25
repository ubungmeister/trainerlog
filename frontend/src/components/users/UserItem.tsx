import type { UserType } from "types/userType";
import Avatar from "boring-avatars";
import { userModalStore } from "app/store/user/userModalStore";
import { Pencil } from "lucide-react";

const avatarNames = [
  "Sally Ride",
  "Henrietta Swan",
  "Ma Rainey",
  "Maya Angelou",
  "Lucy Stone",
  "Mother Frances",
];

export const UserItem = ({ user }: { user: UserType }) => {
  const openModal = userModalStore((state) => state.openModal);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <Avatar
          size={44}
          name={avatarNames[Math.floor(Math.random() * avatarNames.length)]}
          colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
          variant="beam"
        />
        <div>
          <h3 className="font-medium text-gray-900">{user.fullName}</h3>
          <p className="text-sm text-gray-500">Client</p>
        </div>
      </div>
      <button
        onClick={() => openModal(user)}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Edit client"
      >
        <Pencil size={18} className="text-gray-500" />
      </button>
    </div>
  );
};
