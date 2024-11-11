import React, { useState, useEffect, useContext } from "react";
import styles from "./usersList.module.scss";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";

const UsersList = () => {
    const { authData } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/getUsers`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            const data = await response.json();
            setUsers(data?.value || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/deleteUser?userId=${userId}`,
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
                setUsers(users.filter((user) => user.id !== userId));
            } else {
                toast.error(result.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    useEffect(() => {
        if (authData?.token) {
            fetchUsers();
        }
    }, [authData]);

    return (
        <div className={styles.usersList}>
            <h2 className={styles.title}>User List</h2>
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
                    {users.map((user, index) => (
                        <tr key={index}>
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
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;
