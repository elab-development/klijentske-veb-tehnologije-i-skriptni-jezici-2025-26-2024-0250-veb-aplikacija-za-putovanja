import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import Navbar from '../components/Navbar';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const Search = () => {
    const navigate = useNavigate();

    // Tvoj klasičan state za formu
    const [searchParams, setSearchParams] = useState({
        destinacija: '',
        brojPutnika: '',
        turistickaAgencija: '',
        tipPutovanja: '',
        budzet: ''
    });

    return (
        <div className="search-page">
            <Navbar />

            {/* 2. GLAVNI NASLOV */}
            <div className="search-header">
                <h2>Pronađi putovanje!</h2>
                <p>Za Vas ćemo pretražiti sve dostupne turističke ponude!</p>
            </div>

            {/* 3. FORMA SA INPUTIMA I GRAFIKOM */}
            <div className="search-content-wrapper">
                
                {/* Avion sa leve strane */}
                <div className="side-graphic-left">
                    <img src="/slike/image7.png" alt="Avion" className="flying-plane" />
                </div>

                {/* Središnji deo: Input polja raspoređena po redovima */}
                <div className="search-inputs-container">
                    
                    {/* Prvi red: Destinacija, Broj putnika, Agencija */}
                    <div className="search-row">
                        <InputField
                            label="Destinacija"
                            type="text"
                            value={searchParams.destinacija}
                            onChange={(e) => setSearchParams({...searchParams, destinacija: e.target.value})}
                        />
                        <InputField
                            label="Broj putnika"
                            type="text"
                            value={searchParams.brojPutnika}
                            onChange={(e) => setSearchParams({...searchParams, brojPutnika: e.target.value})}
                        />
                        <InputField
                            label="Turistička agencija"
                            type="text"
                            value={searchParams.turistickaAgencija}
                            onChange={(e) => setSearchParams({...searchParams, turistickaAgencija: e.target.value})}
                        />
                    </div>

                    {/* Drugi red: Tip putovanja, Budžet */}
                    <div className="search-row dynamic-row-2">
                        <InputField
                            label="Tip putovanja"
                            type="text"
                            value={searchParams.tipPutovanja}
                            onChange={(e) => setSearchParams({...searchParams, tipPutovanja: e.target.value})}
                        />
                        <InputField
                            label="Budžet"
                            type="text"
                            value={searchParams.budzet}
                            onChange={(e) => setSearchParams({...searchParams, budzet: e.target.value})}
                        />
                    </div>

                </div>

                {/* Polaroid sličice sa desne strane */}
                <div className="side-graphic-right">
                    <img src="/slike/image8.png" alt="Slike" className="polaroid-img" />
                </div>

                {/* Polaroid sličice sa desne strane */}
                <div className="side-graphic-right">
                    <img src="/slike/image8.png" alt="Slike" className="polaroid-img" />
                </div>

            </div>

            {/* 4. SEKCIJA SA KALENDARIMA I DUGMIĆIMA */}
            <div className="calendars-section">
                
                {/* Levi blok: Datum polaska + Kalendar + Dugme */}
                <div className="calendar-block">
                    <span className="calendar-label-btn">Datum polaska</span>
                    <div className="mock-calendar-box">
                        <img src="/slike/image9.png" alt="Kalendar odlazak" />
                    </div>
                    <CustomButton className="main-search-btn" text="Pretraži" onClick={() => navigate('/offers')} />
                </div>

                {/* Desni blok: Datum odlaska + Kalendar + Dugme */}
                <div className="calendar-block">
                    <span className="calendar-label-btn">Datum odlaska</span>
                    <div className="mock-calendar-box">
                        <img src="/slike/image9.png" alt="Kalendar povratak" />
                    </div>
                    <CustomButton className="attraction-search-btn" text="Pretraži atrakcije grada" onClick={() => navigate('/attractions')} />
                </div>

            </div>

        </div>
    );
};

export default Search;