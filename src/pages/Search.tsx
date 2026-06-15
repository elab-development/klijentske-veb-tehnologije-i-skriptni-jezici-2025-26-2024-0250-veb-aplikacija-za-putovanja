import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

const Search = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({ destinacija: '', brPutnika: 1 });

    return (
        <div className="container">
            <h2>Pronađi putovanje!</h2>
            <input type="text" placeholder="Destinacija" onChange={(e) => setSearchParams({...searchParams, destinacija: e.target.value})} />
            <input type="number" placeholder="Broj putnika" onChange={(e) => setSearchParams({...searchParams, brPutnika: parseInt(e.target.value)})} />
            
            <div style={{ marginTop: '20px' }}>
                <CustomButton text="Pretraži ponude" onClick={() => navigate('/offers')} />
                <CustomButton text="Pretraži atrakcije grada" onClick={() => navigate('/attractions')} />
            </div>
        </div>
    );
};
export default Search;