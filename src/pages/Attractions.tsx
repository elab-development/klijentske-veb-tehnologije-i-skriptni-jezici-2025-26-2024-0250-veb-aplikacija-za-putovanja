import React, { useState } from 'react';
import CustomButton from '../components/CustomButton';

const Attractions = () => {
    return (
        <div className="container">
            <h2>Atrakcije grada:</h2>
            <div className="form-grid">
                <input type="text" placeholder="Država: Francuska" disabled />
                <input type="text" placeholder="Grad: Pariz" disabled />
                <select>
                    <option>Cena po osobi: 199e</option>
                </select>
                <input type="number" placeholder="Broj osoba" />
                <CustomButton text="Rezerviši!" onClick={() => alert("Rezervisano!")} />
            </div>
        </div>
    );
};
export default Attractions;