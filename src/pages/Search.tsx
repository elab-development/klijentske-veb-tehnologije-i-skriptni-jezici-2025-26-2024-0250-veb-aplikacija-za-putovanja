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

    // FUNCTIONALITY 7: Travel Currency & Conversions Calculator Widget state
    const [currencyCalc, setCurrencyCalc] = useState({
        izIznos: '100',
        izValuta: 'EUR',
        uValuta: 'RSD'
    });
    const [konvertovaniIznos, setKonvertovaniIznos] = useState<number>(11700);

    const kursevi: { [key: string]: { [key: string]: number } } = {
        EUR: { EUR: 1, RSD: 117.2, USD: 1.08, GBP: 0.85 },
        RSD: { EUR: 0.0085, RSD: 1, USD: 0.0092, GBP: 0.0073 },
        USD: { EUR: 0.93, RSD: 108.5, USD: 1, GBP: 0.79 },
        GBP: { EUR: 1.18, RSD: 137.9, USD: 1.27, GBP: 1 }
    };

    const handleKonverzija = (iznos: string, iz: string, u: string) => {
        const num = parseFloat(iznos);
        if (isNaN(num)) {
            setKonvertovaniIznos(0);
            return;
        }
        const stopa = kursevi[iz]?.[u] || 1;
        setKonvertovaniIznos(parseFloat((num * stopa).toFixed(2)));
    };

    const predloziKonverziju = (eurIznos: number) => {
        setCurrencyCalc({
            izIznos: eurIznos.toString(),
            izValuta: 'EUR',
            uValuta: 'RSD'
        });
        handleKonverzija(eurIznos.toString(), 'EUR', 'RSD');
    };

    const handlePretraziPutovanja = () => {
        // Kreiranje query parametara na osnovu forme
        const params = new URLSearchParams();
        if (searchParams.destinacija) params.append('destinacija', searchParams.destinacija);
        if (searchParams.brojPutnika) params.append('brojPutnika', searchParams.brojPutnika);
        if (searchParams.turistickaAgencija) params.append('turistickaAgencija', searchParams.turistickaAgencija);
        if (searchParams.tipPutovanja) params.append('tipPutovanja', searchParams.tipPutovanja);
        if (searchParams.budzet) params.append('budzet', searchParams.budzet);
        
        navigate(`/offers?${params.toString()}`);
    };

    return (
        <div className="search-page" id="search-page-root">
            <Navbar />

            {/* 2. GLAVNI NASLOV */}
            <div className="search-header" id="search-main-header">
                <h2>Pronađi putovanje!</h2>
                <p>Za Vas ćemo pretražiti sve dostupne turističke ponude!</p>
            </div>

            {/* 3. FORMA SA INPUTIMA I GRAFIKOM */}
            <div className="search-content-wrapper" id="search-main-content">
                
                {/* Avion sa leve strane */}
                <div className="side-graphic-left" id="airplane-side-graphic">
                    <img src="/slike/image7.png" alt="Avion" className="flying-plane" />
                </div>

                {/* Središnji deo: Input polja raspoređena po redovima */}
                <div className="search-inputs-container" id="search-inputs-box">
                    
                    {/* Prvi red: Destinacija, Broj putnika, Agencija */}
                    <div className="search-row">
                        <InputField
                            label="Destinacija"
                            type="text"
                            placeholder="Npr. Pariz, Rim, Barselona..."
                            value={searchParams.destinacija}
                            onChange={(e) => setSearchParams({...searchParams, destinacija: e.target.value})}
                        />
                        <InputField
                            label="Maksimalni budžet (€)"
                            type="text"
                            placeholder="Npr. 300"
                            value={searchParams.budzet}
                            onChange={(e) => setSearchParams({...searchParams, budzet: e.target.value})}
                        />
                        <InputField
                            label="Turistička agencija"
                            type="text"
                            placeholder="Sve agencije"
                            value={searchParams.turistickaAgencija}
                            onChange={(e) => setSearchParams({...searchParams, turistickaAgencija: e.target.value})}
                        />
                    </div>

                    {/* Drugi red: Tip putovanja, Broj putnika */}
                    <div className="search-row dynamic-row-2">
                        <InputField
                            label="Tip putovanja"
                            type="text"
                            placeholder="Npr. Vikend, Letovanje, Evropski gradovi"
                            value={searchParams.tipPutovanja}
                            onChange={(e) => setSearchParams({...searchParams, tipPutovanja: e.target.value})}
                        />
                        <InputField
                            label="Broj putnika"
                            type="text"
                            placeholder="Npr. 2"
                            value={searchParams.brojPutnika}
                            onChange={(e) => setSearchParams({...searchParams, brojPutnika: e.target.value})}
                        />
                    </div>

                    {/* Dugme za iniciranje pretrage */}
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton 
                            className="main-search-btn" 
                            text="Prikaži odgovarajuće ponude 🔍" 
                            onClick={handlePretraziPutovanja} 
                        />
                    </div>

                </div>

                {/* Polaroid sličice sa desne strane */}
                <div className="side-graphic-right" id="polaroid-side-graphic">
                    <img src="/slike/image8.png" alt="Slike" className="polaroid-img" />
                </div>

            </div>

            {/* CURRENCY CALCULATOR AND QUICK ACCESS SHEET (Functionality 7) */}
            <div className="currency-calculator-wrapper" id="travel-currency-calculator">
                <div className="currency-calculator-card">
                    <div className="calc-header-title">
                        <span className="calc-badge">ALAT KORISTAN ZA PUTNIKE 💸</span>
                        <h3>Kalkulator putnog budžeta & Kursna lista</h3>
                        <p>Pretvori novac pre rezervacije prema trenutnom srednjem kursu</p>
                    </div>

                    <div className="calc-inputs-grid">
                        <div className="calc-input-group">
                            <label>Iznos:</label>
                            <input 
                                type="number" 
                                value={currencyCalc.izIznos} 
                                onChange={(e) => {
                                    setCurrencyCalc({...currencyCalc, izIznos: e.target.value});
                                    handleKonverzija(e.target.value, currencyCalc.izValuta, currencyCalc.uValuta);
                                }}
                                min="1"
                                placeholder="Iznos za konverziju"
                            />
                        </div>

                        <div className="calc-input-group">
                            <label>Iz valute:</label>
                            <select 
                                value={currencyCalc.izValuta} 
                                onChange={(e) => {
                                    setCurrencyCalc({...currencyCalc, izValuta: e.target.value});
                                    handleKonverzija(currencyCalc.izIznos, e.target.value, currencyCalc.uValuta);
                                }}
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="RSD">RSD (din)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>

                        <div className="calc-input-group">
                            <label>U valutu:</label>
                            <select 
                                value={currencyCalc.uValuta} 
                                onChange={(e) => {
                                    setCurrencyCalc({...currencyCalc, uValuta: e.target.value});
                                    handleKonverzija(currencyCalc.izIznos, currencyCalc.izValuta, e.target.value);
                                }}
                            >
                                <option value="RSD">RSD (din)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>

                        <div className="calc-result-box">
                            <span className="result-label">Ukupno dobijate:</span>
                            <span className="result-amount">{konvertovaniIznos.toLocaleString()} {currencyCalc.uValuta}</span>
                        </div>
                    </div>

                    {/* Quick convert buttons */}
                    <div className="calc-suggestions">
                        <span>Brzi predlozi džeparca:</span>
                        <button onClick={() => predloziKonverziju(50)}>50 EUR</button>
                        <button onClick={() => predloziKonverziju(150)}>150 EUR</button>
                        <button onClick={() => predloziKonverziju(500)}>500 EUR</button>
                        <button onClick={() => predloziKonverziju(1000)}>1000 EUR</button>
                    </div>
                </div>
            </div>

            {/* 4. SEKCIJA SA KALENDARIMA I DUGMIĆIMA */}
            <div className="calendars-section" id="calendars-navigation-blocks">
                
                {/* Levi blok: Datum polaska + Kalendar + Dugme */}
                <div className="calendar-block" id="departure-date-block">
                    <span className="calendar-label-btn">Datumi i Ponude</span>
                    <div className="mock-calendar-box">
                        <img src="/slike/image9.png" alt="Kalendar odlazak" />
                    </div>
                    <p style={{ fontSize: '13px', color: '#6e6b64', textAlign: 'center', margin: '0 10px' }}>
                        Pregledaj sve gotove aranžmane, njihove popuste i aktivne lokacije.
                    </p>
                    <CustomButton className="main-search-btn" text="Sve gotove ponude" onClick={() => navigate('/offers')} />
                </div>

                {/* Desni blok: Datum odlaska + Kalendar + Dugme */}
                <div className="calendar-block" id="arrival-date-block">
                    <span className="calendar-label-btn">Izleti i Atrakcije</span>
                    <div className="mock-calendar-box">
                        <img src="/slike/image9.png" alt="Kalendar povratak" />
                    </div>
                    <p style={{ fontSize: '13px', color: '#6e6b64', textAlign: 'center', margin: '0 10px' }}>
                        Odaberi avanturu na destinaciji: Disneyland, Ajfelova kula, kafići i muzeji.
                    </p>
                    <CustomButton className="attraction-search-btn" text="Atrakcije & Izleti" onClick={() => navigate('/attractions')} />
                </div>

            </div>

        </div>
    );
};

export default Search;