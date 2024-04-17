export const formatUserFullName = (fullname: string) => {
  const fullnameParts = fullname.split(' ')

  return fullnameParts.length > 2
    ? fullnameParts.slice(0, 2).join(' ')
    : fullname
}
