export default function avatarSource({
  avatar,
  gender,
}: {
  avatar: string | null | undefined;
  gender: string | null | undefined;
}) {
  const img = () => {
    switch (gender) {
      case "Male":
        return "/images/avatar-male.jpg";
      case "Female":
        return "/images/avatar-female.jpg";
      default:
        return "";
    }
  };

  return avatar || img();
}
