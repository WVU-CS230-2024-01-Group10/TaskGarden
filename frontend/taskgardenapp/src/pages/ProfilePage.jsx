import React from 'react';
import '../styles/profileStyles.css'; 

// Need to implement db operations to fetch user info


function ProfilePage() {

    return (
        <div className="ProfilePage">
            <h1 className="userLabel">Username</h1>
            <div className="gridContainer">
                <div className="item1">
                    <h2>Account Information</h2>
                    <p>Name: John Doe</p>
                    <p>Username: JohnDoe123</p>
                    <p>Email: example@gmail.com</p>
                    <button type="button" className="change">Change email</button>
                    <button type="button" className="change">Change password</button>
                    <h2 className="achievementsLabel">Achievements</h2>
                    <p>Total Tasks Completed: X</p>
                    <p>Total Points Earned: X</p>
                    <p>Total Plants Grown: X</p>
                </div>
                <div className="item2">
                    <h2>Current plant: Flower</h2>
                    <img src="https://raw.githubusercontent.com/WVU-CS230-2024-01-Group10/TaskGardenBackup/main/PNG%20Images/png%20Flower%20Stage%205.png?token=GHSAT0AAAAAACMOJD2MITKTB4GJ6LPLF5O2ZQQPF2A" alt="Plant" />
                </div>
                <div className="item3">
                    <button type="button" className="deleteAccBtn">Delete Account</button>
                    <p className="alert">*Account cannot be recovered after deletion.</p>
                </div>
                <div className="item4">
                    <a href="/">
                        <button type="button" className="signOutBtn"> Sign Out</button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;