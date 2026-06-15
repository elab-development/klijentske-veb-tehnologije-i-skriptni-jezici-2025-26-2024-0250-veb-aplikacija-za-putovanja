import React from 'react';

const Profile = () => {
    const wishlist = ["Barselona - Španija", "Pariz - Francuska", "Rim - Italija"];

    return (
        <div className="container">
            <h1>Profil</h1>
            <div className="user-info">
                <p>Ime: Anja</p>
                <p>Email: anjakaradzic@gmail.com</p>
                <p>Registrovan/a od: 2023.</p>
            </div>
            <h3>Wishlist - Sačuvane lokacije:</h3>
            <ul>
                {wishlist.map((item, index) => <li key={index}>❤️ {item}</li>)}
            </ul>
        </div>
    );
};
export default Profile;