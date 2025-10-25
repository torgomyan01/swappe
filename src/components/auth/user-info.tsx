import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not authenticated</p>;

  const user = session?.user as any;

  return (
    <div className="user-info">
      <h3>User Information</h3>

      {user?.isHelper ? (
        <div className="helper-user">
          <p>
            <strong>Type:</strong> Helper User
          </p>
          <p>
            <strong>Helper Name:</strong> {user.name}
          </p>
          <p>
            <strong>Helper Email:</strong> {user.email}
          </p>
          <p>
            <strong>Helper Role:</strong> {user.helper_role}
          </p>
          <p>
            <strong>Main User ID:</strong> {user.main_user_id}
          </p>
          <p>
            <strong>Main User Name:</strong> {user.main_user_name}
          </p>
          <p>
            <strong>Main User Email:</strong> {user.main_user_email}
          </p>
          <p>
            <strong>Account Tariff:</strong> {user.tariff}
          </p>
          <p>
            <strong>Account Balance:</strong> {user.balance}
          </p>
        </div>
      ) : (
        <div className="main-user">
          <p>
            <strong>Type:</strong> Main User
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {JSON.stringify(user.role)}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          <p>
            <strong>Tariff:</strong> {user.tariff}
          </p>
          <p>
            <strong>Balance:</strong> {user.balance}
          </p>
        </div>
      )}
    </div>
  );
}
