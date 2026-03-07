import { useGetUsers } from "hooks/users";
import { type UserType } from "types/userType";
import { DataLoading } from "components/ui";
import { Link } from "react-router-dom";
import Avatar from "boring-avatars";
import { ChevronRight } from "lucide-react";

const avatarNames = [
  "Sally Ride",
  "Henrietta Swan",
  "Ma Rainey",
  "Maya Angelou",
  "Lucy Stone",
  "Mother Frances",
];

export default function Sessions() {
  const { data: users, isLoading } = useGetUsers();

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="page-content-box">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sessions</h1>
        <p className="text-gray-500 mb-4">Select a client to view their training sessions</p>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No clients yet. Add a client from the Clients tab.
            </div>
          ) : (
            users.map((user: UserType) => (
              <Link
                key={user.id}
                to={`/sessions/${user.id}`}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    size={44}
                    name={avatarNames[Math.floor(Math.random() * avatarNames.length)]}
                    colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
                    variant="beam"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">View sessions</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
