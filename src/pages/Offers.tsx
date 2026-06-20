import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { travelTripCalculator } from '../models/TripModels';
import type { ITrip } from '../models/TripModels';
import "../App.css";
import { useApp } from '../context/AppContext';

const Offers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlist, toggleWishlist, setWishlistExternally } = useApp();
    
    // Proširena baza destinacija za bogatije i kompletnije filtriranje i paginaciju sa tematskim atributima
    const SVE_PONUDE: ITrip[] = [
        { 
            id: 1, 
            naslov: "Pariz", 
            opis: "Grad svetlosti i romantike, poznat po umetnosti, kulturi, svetski poznatim muzejima i izuzetnoj kuhinji.", 
            cena: 165,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Romantika",
            trajanjeDana: 5,
            smestaj: "4 zvezdice"
        },
        { 
            id: 2, 
            naslov: "Rim", 
            opis: "Večni grad bogate istorije, antičkih monumentalnih građevina, Koloseuma i vrhunskog italijanskog sladoleda.", 
            cena: 207,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Istorija",
            trajanjeDana: 4,
            smestaj: "3 zvezdice"
        },
        { 
            id: 3, 
            naslov: "Barselona", 
            opis: "Mediteranski biser koji spaja Gaudijevu neverovatnu arhitekturu, peščane plaže i bogat katalonski temperament.", 
            cena: 180,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Odmor",
            trajanjeDana: 7,
            smestaj: "4 zvezdice"
        },
        { 
            id: 4, 
            naslov: "Tokio", 
            opis: "Futuristička metropola gde se najsavremeniji neboderi mešaju sa drevnim šintoističkim hramovima.", 
            cena: 640,
            slika: "slike/image5.png",
            kategorija: "Azija",
            tipPutovanja: "Grad",
            trajanjeDana: 10,
            smestaj: "5 zvezdica"
        },
        { 
            id: 5, 
            naslov: "Njujork", 
            opis: "Grad koji nikad ne spava. Prošetajte Central Parkom, Tajms Skverom i doživite magiju Brodveja sa visina.", 
            cena: 750,
            slika: "slike/image5.png",
            kategorija: "Amerika",
            tipPutovanja: "Grad",
            trajanjeDana: 8,
            smestaj: "4 zvezdice"
        },
        { 
            id: 6, 
            naslov: "Atina", 
            opis: "Kolijevka zapadne civilizacije, istorijski hramovi Akropolja, predivno more i ukusna tradicionalna grčka kuhinja.", 
            cena: 130,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Istorija",
            trajanjeDana: 6,
            smestaj: "3 zvezdice"
        },
        { 
            id: 7, 
            naslov: "London", 
            opis: "Kosmopolitski grad bogat istorijom, muzejima sa besplatnim ulazom, prelepim kraljevskim parkovima i Big Benom.", 
            cena: 220,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Grad",
            trajanjeDana: 5,
            smestaj: "4 zvezdice"
        },
        { 
            id: 8, 
            naslov: "Kairo", 
            opis: "Kolevka drevne egipatske civilizacije, fascinantne piramide u Gizi, veličanstvena reka Nil i pustinjske avanture.", 
            cena: 450,
            slika: "slike/image5.png",
            kategorija: "Ostalo",
            tipPutovanja: "Avantura",
            trajanjeDana: 7,
            smestaj: "3 zvezdice"
        },
        { 
            id: 9, 
            naslov: "Sidnej", 
            opis: "Australijska metropola sa čuvenom zgradom Opere, prelepom lukom, sunčanim plažama i divljim kengurima u blizini.", 
            cena: 920,
            slika: "slike/image5.png",
            kategorija: "Ostalo",
            tipPutovanja: "Avantura",
            trajanjeDana: 12,
            smestaj: "5 zvezdica"
        },
        { 
            id: 10, 
            naslov: "Dubai", 
            opis: "Ultra-luksuzni grad u pustinji, čuveni neboder Burdž Kalifa, raj za vrhunski šoping i futurističke projekte.", 
            cena: 580,
            slika: "slike/image5.png",
            kategorija: "Azija",
            tipPutovanja: "Luksuz",
            trajanjeDana: 6,
            smestaj: "5 zvezdica"
        },
        { 
            id: 11, 
            naslov: "Rio de Žaneiro", 
            opis: "Karnaval, sunčana plaža Kopakabana, zadivljujući kip Hrista Spasitelja i zarazna muzička samba energija.", 
            cena: 780,
            slika: "slike/image5.png",
            kategorija: "Amerika",
            tipPutovanja: "Odmor",
            trajanjeDana: 10,
            smestaj: "4 zvezdice"
        },
        { 
            id: 12, 
            naslov: "Rejkjavik", 
            opis: "Netaknuta islandska priroda, vreli gejziri, geotermalni izvori i čuvena igra polarne svetlosti na noćnom nebu.", 
            cena: 390,
            slika: "slike/image5.png",
            kategorija: "Evropa",
            tipPutovanja: "Avantura",
            trajanjeDana: 8,
            smestaj: "3 zvezdice"
        }
    ];

    // Filter states
    const [filteri, setFilteri] = useState({
        destinacija: '',
        budzetMax: '',
        kategorija: 'Sve',
        sortiranje: 'default', // 'default', 'cena-asc', 'cena-desc'
        tipPutovanja: 'Sve',   // 'Sve', 'Romantika', 'Istorija', 'Odmor', 'Grad', 'Avantura', 'Luksuz'
        trajanjeDana: 'Sve',   // 'Sve', 'kratko', 'srednje', 'dugo'
        smestaj: 'Sve'         // 'Sve', '3 zvezdice', '4 zvezdice', '5 zvezdica'
    });

    const [trips, setTrips] = useState<ITrip[]>(SVE_PONUDE);

    // PAGINACIJA - Stanje za praćenje trenutne stranice i broj po stranici
    const [trenutnaStranica, setTrenutnaStranica] = useState<number>(1);
    const stavkePoStranici = 3;

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
                    const finalna = travelTripCalculator.izracunajSaPorezom(t.cena);
                    return finalna <= max;
                });
            }
        }

        // 3. Filtriranje po kategorijama (Evropa, Azija, Amerika, Ostalo)
        if (filteri.kategorija !== 'Sve') {
            filtrirano = filtrirano.filter(t => t.kategorija === filteri.kategorija);
        }

        // 4. Filtriranje po tipu putovanja
        if (filteri.tipPutovanja !== 'Sve') {
            filtrirano = filtrirano.filter(t => t.tipPutovanja === filteri.tipPutovanja);
        }

        // 5. Filtriranje po trajanju dana
        if (filteri.trajanjeDana !== 'Sve') {
            filtrirano = filtrirano.filter(t => {
                const d = t.trajanjeDana || 0;
                if (filteri.trajanjeDana === 'kratko') return d >= 1 && d <= 4;
                if (filteri.trajanjeDana === 'srednje') return d >= 5 && d <= 8;
                if (filteri.trajanjeDana === 'dugo') return d >= 9;
                return true;
            });
        }

        // 6. Filtriranje po vrsti smeštaja
        if (filteri.smestaj !== 'Sve') {
            filtrirano = filtrirano.filter(t => t.smestaj === filteri.smestaj);
        }

        // 7. Sortiranje
        if (filteri.sortiranje === 'cena-asc') {
            filtrirano.sort((a, b) => a.cena - b.cena);
        } else if (filteri.sortiranje === 'cena-desc') {
            filtrirano.sort((a, b) => b.cena - a.cena);
        }

        setTrips(filtrirano);
        setTrenutnaStranica(1); // Kad god se filteri promene, vraćamo se na prvu stranu
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
            sortiranje: 'default',
            tipPutovanja: 'Sve',
            trajanjeDana: 'Sve',
            smestaj: 'Sve'
        });
        navigate('/offers');
    };

    // MATEMATIKA ZA PAGINACIJU
    const ukupnoStranica = Math.ceil(trips.length / stavkePoStranici) || 1;
    const indeksPoslednjeStavke = trenutnaStranica * stavkePoStranici;
    const indeksPrveStavke = indeksPoslednjeStavke - stavkePoStranici;
    const prikazanePonude = trips.slice(indeksPrveStavke, indeksPoslednjeStavke);

    return (
        <div className="offers-page" id="offers-page-root">
            <Navbar />

            <div className="offers-header" id="offers-main-header">
                <h1 className="offers-main-title">Preporučene ponude</h1>
                <p className="offers-subtitle">Istražite gotove svetske aranžmane sa uključenim popustima i ugrađenom paginacijom!</p>
            </div>

            {/* INTERACTIVE FILTERS CONTROLS DISPLAY (Functionality 1 Component UI) */}
            <div className="offers-filters-pills-bar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

                {/* ADVANCED THEMATIC REVEAL FILTERS (New requirement matching travel context) */}
                <div className="filters-search-inputs" style={{ borderTop: '1px solid #eae8e4', paddingTop: '15px', marginTop: '0px' }}>
                    <div className="small-filter-box">
                        <label>Tip Putovanja:</label>
                        <select 
                            value={filteri.tipPutovanja}
                            onChange={(e) => setFilteri({...filteri, tipPutovanja: e.target.value})}
                        >
                            <option value="Sve">Sva putovanja</option>
                            <option value="Romantika">Romantika</option>
                            <option value="Istorija">Istorija</option>
                            <option value="Odmor">Odmor & Plaža</option>
                            <option value="Grad">City Break / Grad</option>
                            <option value="Avantura">Avantura / Izlet</option>
                            <option value="Luksuz">Ekskluzivni Luksuz</option>
                        </select>
                    </div>

                    <div className="small-filter-box">
                        <label>Trajanje putovanja:</label>
                        <select 
                            value={filteri.trajanjeDana}
                            onChange={(e) => setFilteri({...filteri, trajanjeDana: e.target.value})}
                        >
                            <option value="Sve">Bilo koje trajanje</option>
                            <option value="kratko">Kratko (1-4 dana)</option>
                            <option value="srednje">Srednje (5-8 dana)</option>
                            <option value="dugo">Dugačko (9+ dana)</option>
                        </select>
                    </div>

                    <div className="small-filter-box">
                        <label>Kategorija smeštaja:</label>
                        <select 
                            value={filteri.smestaj}
                            onChange={(e) => setFilteri({...filteri, smestaj: e.target.value})}
                        >
                            <option value="Sve">Bilo koji smeštaj</option>
                            <option value="3 zvezdice">★★3★ Standard (3*)</option>
                            <option value="4 zvezdice">★★4★ Premium (4*)</option>
                            <option value="5 zvezdica">★★5★ Luksuz (5*)</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills and Reset Action */}
                <div className="category-pills-row" style={{ borderTop: '1px solid #eae8e4', paddingTop: '10px' }}>
                    <div className="pills-container">
                        {['Sve', 'Evropa', 'Azija', 'Amerika', 'Ostalo'].map((kat) => (
                            <button 
                                key={kat}
                                className={`category-pill-btn ${filteri.kategorija === kat ? 'pill-active' : ''}`}
                                onClick={() => setFilteri({...filteri, kategorija: kat})}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>

                    {(filteri.destinacija || filteri.budzetMax || filteri.kategorija !== 'Sve' || filteri.sortiranje !== 'default' || filteri.tipPutovanja !== 'Sve' || filteri.trajanjeDana !== 'Sve' || filteri.smestaj !== 'Sve') && (
                        <button className="reset-filters-btn" onClick={handleObrisiFiltere}>
                            Očisti filtere ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="offers-container" id="offers-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="offers-section-title">Izaberite željeno putovanje:</h3>
                    <span style={{ fontSize: '14px', color: '#6e6b64', fontWeight: 600 }}>
                        Prikazano {(trips.length > 0) ? (indeksPrveStavke + 1) : 0}-{(indeksPoslednjeStavke > trips.length) ? trips.length : indeksPoslednjeStavke} od {trips.length} rezultata
                    </span>
                </div>
                
                {trips.length === 0 ? (
                    <div className="no-trips-fallback">
                        <p>Nema pronađenih ponuda sa zadatim kriterijumima.</p>
                        <button className="reset-filters-btn" onClick={handleObrisiFiltere} style={{ marginTop: '10px' }}>Prikaži sve ponude</button>
                    </div>
                ) : (
                    <>
                        <div className="offers-grid">
                            {prikazanePonude.map(trip => {
                                const konacnaCena = Math.round(travelTripCalculator.izracunajSaPorezom(trip.cena));
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
                                            <p className="offer-description" style={{ marginBottom: '12px' }}>{trip.opis}</p>
                                            
                                            {/* Beautiful metadata badges for travel attributes */}
                                            {trip.trajanjeDana && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                                    <span style={{ fontSize: '11px', background: '#faf9f6', border: '1px solid #eae8e4', color: '#6e6b64', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                                                        ⏱️ {trip.trajanjeDana} dana
                                                    </span>
                                                    <span style={{ fontSize: '11px', background: '#faf9f6', border: '1px solid #eae8e4', color: '#6e6b64', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                                                        🏷️ {trip.tipPutovanja}
                                                    </span>
                                                    <span style={{ fontSize: '11px', background: '#faf9f6', border: '1px solid #eae8e4', color: '#6e6b64', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                                                        🏨 {trip.smestaj}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="offer-footer-row">
                                            <div className="offer-price">
                                                <span className="price-label">Od (sa porezom)</span>
                                                <span className="price-amount">{travelTripCalculator.formatirajCenu(konacnaCena)}</span>
                                            </div>
                                            <button 
                                                className="offer-info-btn" 
                                                onClick={() => {
                                                    alert(`Uspješna simulacija pregleda detalja za: ${trip.naslov}!\n\nID Ponude: ${trip.id}\nKategorija: ${trip.kategorija}\nOsnovna cena: ${travelTripCalculator.formatirajCenu(trip.cena)}\nCena sa 20% poreza: ${travelTripCalculator.formatirajCenu(konacnaCena)}`);
                                                }}
                                            >
                                                Detaljnije ➔
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* REGULAR INTERACTIVE PAGINATION COMPONENT DISPLAY */}
                        <div className="pagination-container" id="offers-pagination-controls">
                            <button 
                                className="pagination-btn"
                                onClick={() => setTrenutnaStranica(prev => Math.max(prev - 1, 1))}
                                disabled={trenutnaStranica === 1}
                            >
                                ◀ Prethodna
                            </button>
                            
                            {Array.from({ length: ukupnoStranica }, (_, i) => i + 1).map((brojStranice) => (
                                <button
                                    key={brojStranice}
                                    className={`pagination-btn ${trenutnaStranica === brojStranice ? 'active' : ''}`}
                                    onClick={() => setTrenutnaStranica(brojStranice)}
                                >
                                    {brojStranice}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-btn"
                                onClick={() => setTrenutnaStranica(prev => Math.min(prev + 1, ukupnoStranica))}
                                disabled={trenutnaStranica === ukupnoStranica}
                            >
                                Sledeća ▶
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="offers-load-more-container" style={{ marginTop: '20px', marginBottom: '40px' }}>
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#a19e95' }}>
                    Stranica <strong>{trenutnaStranica}</strong> od ukupno <strong>{ukupnoStranica}</strong>
                </div>
            </div>
        </div>
    );
};

export default Offers;