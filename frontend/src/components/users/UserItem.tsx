import type { UserType } from "types/userType";
import Avatar from "boring-avatars";
import { userModalStore } from "app/store/user/userModalStore";
import { Link } from "react-router-dom";
const avatarNames = [
  "Sally Ride",
  "Henrietta Swan",
  "Ma Rainey",
  "Maya Angelou",
  "Lucy Stone",
  "Mother Frances",
];

const UserItem = ({ user }: { user: UserType }) => {
  const openModal = userModalStore((state) => state.openModal);

  return (
    <div className="flex flex-row items-center justify-between gap-2 p-4 border-b-1 border-primary-button last:border-b-0">
      <Link
        to={`/client/${user.id}`}
        className="flex flex-row items-center gap-2 w-[200px]"
      >
        <Avatar
          size={40}
          name={avatarNames[Math.floor(Math.random() * avatarNames.length)]}
          colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
          variant="beam"
        />
        <h3>{user.fullName}</h3>
      </Link>
      <div className=" ">
        <button
          onClick={() => openModal(user)}
          className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserItem;
