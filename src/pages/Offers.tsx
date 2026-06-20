import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TripCalculator } from '../models/TripModels';
import type { ITrip } from '../models/TripModels';
import "../App.css";
import { useApp } from '../context/AppContext';

const Offers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlist, toggleWishlist, setWishlistExternally } = useApp();
    
    // Proširena baza destinacija za bogatije filtriranje
    const SVE_PONUDE: ITrip[] = [
        { 
            id: 1, 
            naslov: "Pariz", 
            opis: "Grad svetlosti i romantike, poznat po umetnosti, kulturi, svetski poznatim muzejima i izuzetnoj kuhinji.", 
            cena: 165,
            slika: "slike/image5.png",
            kategorija: "Evropa"
        },
        { 
            id: 2, 
            naslov: "Rim", 
            opis: "Večni grad bogate istorije, antičkih monumentalnih građevina, Koloseuma i vrhunskog sladoleda.", 
            cena: 207,
            slika: "slike/image5.png",
            kategorija: "Evropa"
        },
        { 
            id: 3, 
            naslov: "Barselona", 
            opis: "Mediteranski biser koji spaja Gaudijevu neverovatnu arhitekturu, peščane plaže i bogat noćni život.", 
            cena: 180,
            slika: "slike/image5.png",
            kategorija: "Evropa"
        },
        { 
            id: 4, 
            naslov: "Tokio", 
            opis: "Futuristička metropola gde se savremeni neboderi mešaju sa drevnim šintoističkim hramovima.", 
            cena: 640,
            slika: "slike/image5.png",
            kategorija: "Azija"
        },
        { 
            id: 5, 
            naslov: "Njujork", 
            opis: "Grad koji nikad ne spava. Prošetajte Central Parkom, Tajms Skverom i doživite magiju Brodveja.", 
            cena: 750,
            slika: "slike/image5.png",
            kategorija: "Amerika"
        },
        { 
            id: 6, 
            naslov: "Atina", 
            opis: "Kolijevka zapadne civilizacije, istorijski hramovi Akropolja i ukusna lokalna grčka kuhinja.", 
            cena: 130,
            slika: "slike/image5.png",
            kategorija: "Evropa"
        }
    ];

    // Filter states
    const [filteri, setFilteri] = useState({
        destinacija: '',
        budzetMax: '',
        kategorija: 'Sve',
        sortiranje: 'default' // 'default', 'cena-asc', 'cena-desc'
    });

    const [trips, setTrips] = useState<ITrip[]>(SVE_PONUDE);

    // Na startu, preuzmi parametre iz URL-a (poslate sa Search.tsx) i napuni Wishlist
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlDest = queryParams.get('destinacija') || '';
        const urlBudzet = queryParams.get('budzet') || '';
        
        setFilteri(prev => ({
            ...prev,
            destinacija: urlDest,
            budzetMax: urlBudzet
        }));

        // Učitaj wishlistu iz localStorage-a i sinhronizuj preko konteksta
        try {
            const storaged = localStorage.getItem('travel_wishlist');
            if (storaged) {
                const parsed = JSON.parse(storaged);
                if (Array.isArray(parsed)) {
                    setWishlistExternally(parsed);
                }
            }
        } catch (e) {
            console.error("Greška pri čitanju wishliste", e);
        }
    }, [location.search]);

    // Primeni reaktivne filtere (Functionality 1: Multi-criteria filtering + sorting)
    useEffect(() => {
        let filtrirano = [...SVE_PONUDE];

        // 1. Filtriranje po destinaciji (tekstualni unos)
        if (filteri.destinacija) {
            const upit = filteri.destinacija.toLowerCase();
            filtrirano = filtrirano.filter(t => 
                t.naslov.toLowerCase().includes(upit) || 
                t.opis.toLowerCase().includes(upit)
            );
        }

        // 2. Filtriranje po maksimalnom budžetu (proveravamo cenu sa porezom)
        if (filteri.budzetMax) {
            const max = parseFloat(filteri.budzetMax);
            if (!isNaN(max)) {
                filtrirano = filtrirano.filter(t => {
                    const finalna = TripCalculator.izracunajSaPorezom(t.cena);
                    return finalna <= max;
                });
            }
        }

        // 3. Filtriranje po kategorijama (Evropa, Azija, Amerika)
        if (filteri.kategorija !== 'Sve') {
            filtrirano = filtrirano.filter(t => t.kategorija === filteri.kategorija);
        }

        // 4. Sortiranje
        if (filteri.sortiranje === 'cena-asc') {
            filtrirano.sort((a, b) => a.cena - b.cena);
        } else if (filteri.sortiranje === 'cena-desc') {
            filtrirano.sort((a, b) => b.cena - a.cena);
        }

        setTrips(filtrirano);
    }, [filteri]);

    // FUNCTIONALITY 2: Toggle wishlist item and synchronize with LocalStorage Context
    const handleToggleWishlist = (tripName: string, tripKategorija: string) => {
        toggleWishlist(tripName, tripKategorija);
    };

    // Resetuj sve filtere
    const handleObrisiFiltere = () => {
        setFilteri({
            destinacija: '',
            budzetMax: '',
            kategorija: 'Sve',
            sortiranje: 'default'
        });
        navigate('/offers');
    };

    return (
        <div className="offers-page" id="offers-page-root">
            <Navbar />

            <div className="offers-header" id="offers-main-header">
                <h1 className="offers-main-title">Preporučene ponude</h1>
                <p className="offers-subtitle">Istražite gotove evropske i svetske aranžmane sa uključenim popustima!</p>
            </div>

            {/* INTERACTIVE FILTERS CONTROLS DISPLAY (Functionality 1 Component UI) */}
            <div className="offers-filters-pills-bar">
                <div className="filters-search-inputs">
                    <div className="small-filter-box">
                        <label>Brza pretraga:</label>
                        <input 
                            type="text" 
                            placeholder="Pretraži ponude..." 
                            value={filteri.destinacija}
                            onChange={(e) => setFilteri({...filteri, destinacija: e.target.value})}
                        />
                    </div>

                    <div className="small-filter-box">
                        <label>Maks. budžet (€):</label>
                        <input 
                            type="number" 
                            placeholder="Svi budžeti" 
                            value={filteri.budzetMax}
                            onChange={(e) => setFilteri({...filteri, budzetMax: e.target.value})}
                        />
                    </div>

                    <div className="small-filter-box">
                        <label>Sortiraj cene:</label>
                        <select 
                            value={filteri.sortiranje}
                            onChange={(e) => setFilteri({...filteri, sortiranje: e.target.value})}
                        >
                            <option value="default">Standardno</option>
                            <option value="cena-asc">Cena: od najniže</option>
                            <option value="cena-desc">Cena: od najviše</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills and Reset Action */}
                <div className="category-pills-row">
                    <div className="pills-container">
                        {['Sve', 'Evropa', 'Azija', 'Amerika'].map((kat) => (
                            <button 
                                key={kat}
                                className={`category-pill-btn ${filteri.kategorija === kat ? 'pill-active' : ''}`}
                                onClick={() => setFilteri({...filteri, kategorija: kat})}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>

                    {(filteri.destinacija || filteri.budzetMax || filteri.kategorija !== 'Sve' || filteri.sortiranje !== 'default') && (
                        <button className="reset-filters-btn" onClick={handleObrisiFiltere}>
                            Očisti filtere ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="offers-container" id="offers-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="offers-section-title">Izaberite željeno putovanje:</h3>
                    <span style={{ fontSize: '14px', color: '#6e6b64', fontWeight: 600 }}>Prilagođeno vama ({trips.length} rezultata)</span>
                </div>
                
                {trips.length === 0 ? (
                    <div className="no-trips-fallback">
                        <p>Nema pronađenih ponuda sa zadatim kriterijumima.</p>
                        <button className="reset-filters-btn" onClick={handleObrisiFiltere} style={{ marginTop: '10px' }}>Prikaži sve ponude</button>
                    </div>
                ) : (
                    <div className="offers-grid">
                        {trips.map(trip => {
                            const konacnaCena = Math.round(TripCalculator.izracunajSaPorezom(trip.cena));
                            const listFormattedName = `${trip.naslov} - ${trip.kategorija}`;
                            const isSaved = wishlist.includes(listFormattedName);

                            return (
                                <div key={trip.id} className="offer-card" id={`offer-card-${trip.id}`}>
                                    <div className="offer-image-box" style={{ position: 'relative' }}>
                                        <img src="slike/image5.png" alt={trip.naslov} />
                                        
                                        {/* FUNCTIONALITY 2 Wishlist Heart Toggle Trigger Button Overlay */}
                                        <button 
                                            className={`wishlist-heart-badge ${isSaved ? 'heart-saved' : ''}`}
                                            onClick={() => handleToggleWishlist(trip.naslov, trip.kategorija)}
                                            title={isSaved ? "Ukloni iz liste želja" : "Sačuvaj u listu želja"}
                                        >
                                            {isSaved ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                    
                                    <div className="offer-card-details">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ fontSize: '20px', fontFamily: 'Playfair Display', fontWeight: 700 }}>{trip.naslov}</h4>
                                            <span className="offer-category-badge">{trip.kategorija}</span>
                                        </div>
                                        <p className="offer-description">{trip.opis}</p>
                                    </div>
                                    
                                    <div className="offer-footer-row">
                                        <div className="offer-price">
                                            <span className="price-label">Od (sa porezom)</span>
                                            <span className="price-amount">{TripCalculator.formatirajCenu(konacnaCena)}</span>
                                        </div>
                                        <button 
                                            className="offer-info-btn" 
                                            onClick={() => {
                                                alert(`Uspješna simulacija pregleda detalja za: ${trip.naslov}!\n\nID Ponude: ${trip.id}\nKategorija: ${trip.kategorija}\nOsnovna cena: ${TripCalculator.formatirajCenu(trip.cena)}\nCena sa 20% poreza: ${TripCalculator.formatirajCenu(konacnaCena)}`);
                                            }}
                                        >
                                            Detaljnije ➔
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="offers-load-more-container">
                <button className="offers-load-more-btn" onClick={() => alert("Preuzimanje spoljnih turističkih agencija je završeno! Sve dostupne offline ponude su već prikazane.")}>
                    Prikaži još ponuda <span className="arrow-icon">↩</span>
                </button>
            </div>
        </div>
    );
};

export default Offers;