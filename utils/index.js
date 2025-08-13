export const getUserIdSanitized = (uid) => {
    return uid.split('|')[1];
}
