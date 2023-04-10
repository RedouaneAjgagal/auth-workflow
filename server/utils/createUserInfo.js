const createUserInfo = (payload) => {
    const userInfo = {
        id: payload.id,
        name: payload.name,
        role: payload.role
    }
    return userInfo;
}

module.exports = createUserInfo;