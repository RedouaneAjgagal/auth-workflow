const currentUser = async (req, res) => {
    res.status(200).json({ user: { userId: req.user.id, name: req.user.name, role: req.user.role } });
}

module.exports = {
    currentUser
};