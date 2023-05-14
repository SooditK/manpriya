export function initialsOfName(name: string): string | undefined | null {
  if (!name) {
    return undefined;
  }
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0]?.charAt(0);
  }
  const [firstName, lastName] = names;
  if (!firstName || !lastName) {
    return undefined;
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}
