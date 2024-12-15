import React, { useContext, useEffect, useState } from "react";

import styles from "./editProfile.module.scss";
import ProfileTab from "./Tabs/profileTab";
import PasswordTab from "./Tabs/passwordTab";
import DeleteTab from "./Tabs/deleteTab";
import NewUserPassword from "./newPassword";
import TabHeader from "./tabHeader";
import { AuthContext } from "../../context/AuthContext";

const EditProfile = () => {
    const { authData } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("profile");

    const passwordVerification =
        authData.user?.passwordVerification === "False" ? false : true;

    if (!passwordVerification) {
        return <NewUserPassword />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerForm}>
                <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
                <div className={styles.editProfileContainer}>
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "password" && <PasswordTab />}
                    {activeTab === "delete" && <DeleteTab />}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
