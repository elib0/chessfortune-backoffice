const RoomUserInfo = ({ user, room }: { user?: "w" | "b"; room: any }) => {
  const player = room?.players?.[user ? user : room?.createdBy];

  if (!player || !player.profile) {
    return <div>No user information available</div>;
  }

  const { displayName, email } = player.profile;

  return (
    <div className="w-full flex flex-col">
      <h2 className="capitalize">{displayName}</h2>
      <h3 className="capitalize">{email}</h3>
    </div>
  );
};

export default RoomUserInfo;
