import React, { useState, useEffect } from 'react';
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

    // FUNCTIONALITY 7: Travel Currency & Conversions Calculator Widget state with API integrations
    const [currencyCalc, setCurrencyCalc] = useState({
        izIznos: '100',
        izValuta: 'EUR',
        uValuta: 'RSD'
    });
    const [konvertovaniIznos, setKonvertovaniIznos] = useState<number>(11700);

    const [apiRates, setApiRates] = useState<{ [key: string]: number }>({
        EUR: 1,
        RSD: 117.2,
        USD: 1.08,
        GBP: 0.85,
        JPY: 172.5
    });
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const handleKonverzija = (iznos: string, iz: string, u: string, customRates?: { [key: string]: number }) => {
        const num = parseFloat(iznos);
        if (isNaN(num)) {
            setKonvertovaniIznos(0);
            return;
        }
        const activeRates = customRates || apiRates;
        const eurDoIz = activeRates[iz] || 1;
        const eurDoU = activeRates[u] || 1;
        const stopa = (1 / eurDoIz) * eurDoU;
        setKonvertovaniIznos(parseFloat((num * stopa).toFixed(2)));
    };

    const predloziKonverziju = (eurIznos: number) => {
        setCurrencyCalc({
            izIznos: eurIznos.toString(),
            izValuta: 'EUR',
            uValuta: 'RSD'
        });
        handleKonverzija(eurIznos.toString(), 'EUR', 'RSD', apiRates);
    };

    // API 1: Fetch live exchange rates from Open ExchangeRate API
    useEffect(() => {
        fetch('https://open.er-api.com/v6/latest/EUR')
            .then(res => {
                if (!res.ok) throw new Error("Neuspešan odziv kursne liste");
                return res.json();
            })
            .then(data => {
                if (data && data.rates) {
                    const freshRates = {
                        EUR: 1,
                        RSD: data.rates.RSD || 117.2,
                        USD: data.rates.USD || 1.08,
                        GBP: data.rates.GBP || 0.85,
                        JPY: data.rates.JPY || 172.5
                    };
                    setApiRates(freshRates);
                    
                    if (data.time_last_update_utc) {
                        const date = new Date(data.time_last_update_utc);
                        setLastUpdated(date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('sr-RS'));
                    } else {
                        setLastUpdated(new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }));
                    }

                    // Pre-convert with high-precision live data
                    const num = parseFloat(currencyCalc.izIznos);
                    if (!isNaN(num)) {
                        const eurDoIz = freshRates[currencyCalc.izValuta as keyof typeof freshRates] || 1;
                        const eurDoU = freshRates[currencyCalc.uValuta as keyof typeof freshRates] || 1;
                        const stopa = (1 / eurDoIz) * eurDoU;
                        setKonvertovaniIznos(parseFloat((num * stopa).toFixed(2)));
                    }
                }
            })
            .catch(err => {
                console.error("Greška pri automatskom učitavanju kursne liste uživo:", err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // API 2: Vremenska prognoza coordinate options (Open-Meteo Integration)
    const LOCATIONS = [
        { name: 'Beograd', country: 'Srbija', lat: 44.8156, lon: 20.4612 },
        { name: 'Pariz', country: 'Francuska', lat: 48.8566, lon: 2.3522 },
        { name: 'Rim', country: 'Italija', lat: 41.9028, lon: 12.4964 },
        { name: 'Barselona', country: 'Španija', lat: 41.3851, lon: 2.1734 },
        { name: 'Tokio', country: 'Japan', lat: 35.6762, lon: 139.6503 },
        { name: 'Njujork', country: 'SAD', lat: 40.7128, lon: -74.0060 },
        { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
        { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
        { name: 'Rio de Žaneiro', country: 'Brazil', lat: -22.9068, lon: -43.1729 },
        { name: 'Rejkjavik', country: 'Island', lat: 64.1466, lon: -21.9426 }
    ];

    interface ICurrentWeather {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
    }

    const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0);
    const [weatherTrigger, setWeatherTrigger] = useState<number>(0);
    const [weatherData, setWeatherData] = useState<ICurrentWeather | null>(null);
    const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
    const [weatherError, setWeatherError] = useState<string>('');

    const triggerWeatherFetch = () => {
        setWeatherTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const city = LOCATIONS[selectedCityIdx];
        if (!city) return;
        
        let active = true;
        
        // Use Promise scheduler to avoid calling setState synchronously in effect body
        Promise.resolve().then(() => {
            if (active) {
                setWeatherLoading(true);
                setWeatherError('');
            }
        });
        
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
            .then(res => {
                if (!res.ok) throw new Error("Neuspešan odziv meteo servera");
                return res.json();
            })
            .then(data => {
                if (active) {
                    if (data && data.current_weather) {
                        setWeatherData(data.current_weather);
                    } else {
                        throw new Error("Greška u deserializaciji meteo formata");
                    }
                }
            })
            .catch(err => {
                console.error("Greška pri preuzimanju prognoze:", err);
                if (active) {
                    setWeatherError('Nije moguće učitati vremensku prognozu sa API-ja.');
                }
            })
            .finally(() => {
                if (active) {
                    setWeatherLoading(false);
                }
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCityIdx, weatherTrigger]);

    const getWeatherDetails = (code: number) => {
        switch (code) {
            case 0: return { desc: 'Vedro i sunčano', icon: '☀️', bgClass: 'weather-sunny' };
            case 1:
            case 2:
            case 3: return { desc: 'Delimično oblačno', icon: '⛅', bgClass: 'weather-cloudy' };
            case 45:
            case 48: return { desc: 'Magla / niska oblačnost', icon: '🌫️', bgClass: 'weather-foggy' };
            case 51:
            case 53:
            case 55: return { desc: 'Svetla rominjajuća kiša', icon: '🌦️', bgClass: 'weather-rainy' };
            case 61:
            case 63:
            case 65: return { desc: 'Kišni talasi', icon: '🌧️', bgClass: 'weather-rainy' };
            case 71:
            case 73:
            case 75: return { desc: 'Mogući sneg / padavine', icon: '❄️', bgClass: 'weather-snowy' };
            case 80:
            case 81:
            case 82: return { desc: 'Lokalni pljuskovi', icon: '⛈️', bgClass: 'weather-rainy' };
            case 95:
            case 96:
            case 99: return { desc: 'Oluja sa grmljavinom', icon: '⚡', bgClass: 'weather-stormy' };
            default: return { desc: 'Umereni vremenski uslovi', icon: '🌍', bgClass: 'weather-default' };
        }
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

            {/* TWO LIVE APIS UTILITY GRID (Kursna lista i Vremenska prognoza) */}
            <div className="dashboard-widgets-grid" id="travel-dashboard-widgets">
                
                {/* 1. CURRENCY CALCULATOR CARD (API 1) */}
                <div className="currency-calculator-card" id="currency-calculator-box">
                    <div className="calc-header-title">
                        <span className="calc-badge">AŽURNI KURS UŽIVO 💸</span>
                        <h3>Kalkulator putnog budžeta</h3>
                        <p>Pretvori novac uz srednji kurs {lastUpdated ? `(ažurirano u ${lastUpdated})` : '(sa API-ja)'}</p>
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
                                    const nextVal = e.target.value;
                                    setCurrencyCalc({...currencyCalc, izValuta: nextVal});
                                    handleKonverzija(currencyCalc.izIznos, nextVal, currencyCalc.uValuta);
                                }}
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="RSD">RSD (din)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                            </select>
                        </div>

                        <div className="calc-input-group">
                            <label>U valutu:</label>
                            <select 
                                value={currencyCalc.uValuta} 
                                onChange={(e) => {
                                    const nextVal = e.target.value;
                                    setCurrencyCalc({...currencyCalc, uValuta: nextVal});
                                    handleKonverzija(currencyCalc.izIznos, currencyCalc.izValuta, nextVal);
                                }}
                            >
                                <option value="RSD">RSD (din)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
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

                {/* 2. REAL-TIME LIVE WEATHER FORECAST CARD (API 2) */}
                <div className="weather-forecast-card" id="weather-forecast-box">
                    <div className="calc-header-title">
                        <span className="weather-badge">METEO METRIKA UŽIVO 🌤️</span>
                        <h3>Vremenska prognoza za putnike</h3>
                        <p>Trenutna lokalna temperatura i vremenski uslovi na destinaciji</p>
                    </div>

                    <div className="weather-selector-row">
                        <div className="weather-input-group">
                            <label>Izaberi željenu destinaciju:</label>
                            <select
                                value={selectedCityIdx}
                                onChange={(e) => setSelectedCityIdx(parseInt(e.target.value))}
                                className="weather-select"
                                style={{ height: '44px', width: '100%', borderRadius: '10px', fontSize: '14px', border: '1.5px solid #eae8e4', background: 'white' }}
                            >
                                {LOCATIONS.map((city, idx) => (
                                    <option key={idx} value={idx}>{city.name} ({city.country})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {weatherLoading ? (
                        <div className="weather-loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '24px 0', minHeight: '120px' }}>
                            <div className="weather-spinner" style={{ width: '28px', height: '28px', border: '3px solid #fdf0ee', borderTopColor: '#cf4638', borderRadius: '50%', animation: 'weather-spin 1s linear infinite' }}></div>
                            <span style={{ fontSize: '12.5px', color: '#6e6b64', fontWeight: 500 }}>Preuzimanje vremenskih prilika sa satelita...</span>
                        </div>
                    ) : weatherError ? (
                        <div className="weather-error" style={{ color: '#cf4638', fontSize: '13.5px', padding: '24px 0', fontWeight: 600, textAlign: 'center' }}>
                            ⚠️ {weatherError}
                            <button onClick={triggerWeatherFetch} style={{ marginLeft: '10px', textDecoration: 'underline', color: '#1a1a1a', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>Pokušaj ponovo</button>
                        </div>
                    ) : weatherData ? (
                        (() => {
                            const details = getWeatherDetails(weatherData.weathercode);
                            return (
                                <div className={`weather-display-body ${details.bgClass}`} style={{ marginTop: '16px', borderRadius: '14px', padding: '16px', background: 'linear-gradient(135deg, #fdfcfa, #faf7f2)', border: '1px solid #eae8e4' }}>
                                    <div className="weather-main-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <span className="weather-emoji" style={{ fontSize: '44px', textShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{details.icon}</span>
                                        <div className="weather-temp-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="weather-temp" style={{ fontSize: '28px', fontFamily: 'JetBrains Mono', fontWeight: 'bold', color: '#1a1a1a' }}>{weatherData.temperature}°C</span>
                                            <span className="weather-desc" style={{ fontSize: '13px', fontWeight: 600, color: '#cf4638' }}>{details.desc}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="weather-sub-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px', borderTop: '1px solid #eae8e4', paddingTop: '14px' }}>
                                        <div className="weather-stat-box" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="weather-stat-label" style={{ fontSize: '10.5px', color: '#a19e95', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Sila vetra</span>
                                            <span className="weather-stat-val" style={{ fontSize: '13px', fontWeight: 600, color: '#1e1e1e', marginTop: '3px' }}>💨 {weatherData.windspeed} km/h</span>
                                        </div>
                                        <div className="weather-stat-box" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="weather-stat-label" style={{ fontSize: '10.5px', color: '#a19e95', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Ugao vetra</span>
                                            <span className="weather-stat-val" style={{ fontSize: '13px', fontWeight: 600, color: '#1e1e1e', marginTop: '3px' }}>🧭 {weatherData.winddirection}°</span>
                                        </div>
                                        <div className="weather-stat-box" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="weather-stat-label" style={{ fontSize: '10.5px', color: '#a19e95', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Satelit</span>
                                            <span className="weather-stat-val" style={{ fontSize: '13.5px', fontWeight: 700, color: '#2e7d32', marginTop: '3px' }}>🟢 Aktivno</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : null}
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