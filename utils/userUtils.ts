export const getInitials = (name: string) => {
  return name.includes(" ")
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}