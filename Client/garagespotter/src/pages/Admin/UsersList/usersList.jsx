import React, { useState, useEffect, useContext } from "react";
import styles from "../admin.module.scss";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";

const UsersList = () => {
    const { authData } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/getUsers`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            const data = await response.json();
            console.log(authData);
            setUsers(
                data?.value.filter(
                    (user) => user.email != authData?.user.email
                ) || []
            );
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
        }
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setShowDeleteModal(true);
    };

    const deleteUser = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/deleteUser?userId=${selectedUserId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            const result = await response.json();

            if (result.success) {
                toast.success("User deleted successfully.");
                setUsers(users.filter((user) => user.id !== selectedUserId));
            } else {
                toast.error(result.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        } finally {
            setShowDeleteModal(false);
            setSelectedUserId(null);
        }
    };

    useEffect(() => {
        if (authData?.token) {
            fetchUsers();
        }
    }, [authData]);

    const filteredUsers = users.filter((user) =>
        Object.values(user)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>User List</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search users..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span
                                    className={`${styles.roleBadge} ${
                                        user.role === "Admin"
                                            ? styles.admin
                                            : styles.user
                                    }`}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className={styles.actions}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteClick(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className={styles.confirmationModal}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this user?</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={deleteUser}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;
