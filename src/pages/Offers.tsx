import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { travelTripCalculator } from '../models/TripModels';
import type { ITrip } from '../models/TripModels';
import "../App.css";
import { useApp } from '../context/AppContext';

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

const Offers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlist, toggleWishlist, profile, addBooking } = useApp();

    // Stanja za interaktivni Modal sa detaljima i brzu rezervaciju
    const [selectedTripForModal, setSelectedTripForModal] = useState<ITrip | null>(null);
    const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>(() => {
        try {
            const storagedRecent = sessionStorage.getItem('travel_recently_viewed');
            if (storagedRecent) {
                const parsed = JSON.parse(storagedRecent);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Greška pri čitanju recently viewed iz sessionStorage", e);
        }
        return [];
    });

    // Stanja za polja u formi za rezervaciju izleta unutar Modala
    const [bookingIme, setBookingIme] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");
    const [bookingTelefon, setBookingTelefon] = useState("");
    const [bookingDatum, setBookingDatum] = useState("");
    const [bookingOsoba, setBookingOsoba] = useState<number>(2);
    const [odabraniDodaci, setOdabraniDodaci] = useState<string[]>([]);
    const [isBookedSuccess, setIsBookedSuccess] = useState(false);

    // PAGINACIJA - Stanje za praćenje trenutne stranice i broj po stranici
    const [trenutnaStranica, setTrenutnaStranica] = useState<number>(1);
    const stavkePoStranici = 3;

    // Filter states
    const [filteri, setFilteri] = useState(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlDest = queryParams.get('destinacija') || '';
        const urlBudzet = queryParams.get('budzet') || '';
        return {
            destinacija: urlDest,
            budzetMax: urlBudzet,
            kategorija: 'Sve',
            sortiranje: 'default', // 'default', 'cena-asc', 'cena-desc'
            tipPutovanja: 'Sve',   // 'Sve', 'Romantika', 'Istorija', 'Odmor', 'Grad', 'Avantura', 'Luksuz'
            trajanjeDana: 'Sve',   // 'Sve', 'kratko', 'srednje', 'dugo'
            smestaj: 'Sve'         // 'Sve', '3 zvezdice', '4 zvezdice', '5 zvezdica'
        };
    });

    // Ako se URL parametri promene naknadno (npr. navigacija), osveži filtere
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlDest = queryParams.get('destinacija') || '';
        const urlBudzet = queryParams.get('budzet') || '';
        
        let active = true;
        Promise.resolve().then(() => {
            if (active) {
                setFilteri(prev => {
                    if (prev.destinacija === urlDest && prev.budzetMax === urlBudzet) {
                        return prev;
                    }
                    return {
                        ...prev,
                        destinacija: urlDest,
                        budzetMax: urlBudzet
                    };
                });
                setTrenutnaStranica(1);
            }
        });
        return () => {
            active = false;
        };
    }, [location.search]);

    // Funkcija za menjanje filtera koja automatski vraća stranicu na 1
    const updateFilteri = (noviFilteri: typeof filteri) => {
        setFilteri(noviFilteri);
        setTrenutnaStranica(1);
    };

    // Primeni reaktivne filtere (Functionality 1: Multi-criteria filtering + sorting)
    const trips = useMemo(() => {
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

        return filtrirano;
    }, [filteri]);

    // FUNCTIONALITY 2: Toggle wishlist item and synchronize with LocalStorage Context
    const handleToggleWishlist = (tripName: string, tripKategorija: string) => {
        toggleWishlist(tripName, tripKategorija);
    };

    const handleOtvoriDetalje = (trip: ITrip) => {
        setIsBookedSuccess(false);
        setSelectedTripForModal(trip);
        
        // Automatski popuni podatke iz profila korisnika sačuvanih u localStorage
        if (profile) {
            setBookingIme(profile.ime || "");
            setBookingEmail(profile.email || "");
            setBookingTelefon(profile.telefon || "");
        }
        
        // Postavi podrazumevani datum (za nedelju dana)
        const d = new Date();
        d.setDate(d.getDate() + 7);
        setBookingDatum(d.toISOString().slice(0, 10));
        setBookingOsoba(2);
        setOdabraniDodaci([]);

        // Sačuvaj u sessionStorage (Nedavno pregledani) kao smisleni session podaci
        try {
            const storagedRecent = sessionStorage.getItem('travel_recently_viewed');
            let list: number[] = [];
            if (storagedRecent) {
                list = JSON.parse(storagedRecent);
            }
            // Izbaci duplikat i stavi na vrh
            list = list.filter(id => id !== trip.id);
            const novaLista = [trip.id, ...list].slice(0, 4);
            setRecentlyViewedIds(novaLista);
            sessionStorage.setItem('travel_recently_viewed', JSON.stringify(novaLista));
        } catch (e) {
            console.error("Greška pri čuvanju u sessionStorage:", e);
        }
    };

    const handlePotvrdiRezervaciju = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTripForModal) return;

        if (!bookingIme.trim() || !bookingEmail.trim() || !bookingTelefon.trim() || !bookingDatum) {
            alert("Molimo Vas da popunite sva obavezna polja!");
            return;
        }

        // Izračunaj krajnju cenu sa uključenim dodacima
        const osnovnaCena = travelTripCalculator.izracunajSaPorezom(selectedTripForModal.cena);
        let dodaciBonus = 0;
        if (odabraniDodaci.includes("Osiguranje")) dodaciBonus += 25;
        if (odabraniDodaci.includes("Polupansion")) dodaciBonus += 60;
        if (odabraniDodaci.includes("Lokalni vodič")) dodaciBonus += 30;

        const ukupnoCenaZaRezervaciju = (osnovnaCena * bookingOsoba) + dodaciBonus;

        const novaRezervacija = {
            id: Date.now(),
            destinacija: selectedTripForModal.naslov,
            grad: selectedTripForModal.naslov,
            datum: bookingDatum,
            plan: `${selectedTripForModal.trajanjeDana} dana, smeštaj: ${selectedTripForModal.smestaj}`,
            brojOsoba: bookingOsoba,
            dodaci: odabraniDodaci,
            ukupnaCena: Math.round(ukupnoCenaZaRezervaciju),
            datumRezervacije: new Date().toLocaleDateString('sr-RS')
        };

        // Poziv funkcije iz AppContext-a koja automatski upisuje u localStorage pod travel_bookings
        addBooking(novaRezervacija);
        setIsBookedSuccess(true);
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
    const aktivnaStranica = Math.min(trenutnaStranica, ukupnoStranica) || 1;
    const indeksPoslednjeStavke = aktivnaStranica * stavkePoStranici;
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
                            onChange={(e) => updateFilteri({...filteri, destinacija: e.target.value})}
                        />
                    </div>

                    <div className="small-filter-box">
                        <label>Maks. budžet (€):</label>
                        <input 
                            type="number" 
                            placeholder="Svi budžeti" 
                            value={filteri.budzetMax}
                            onChange={(e) => updateFilteri({...filteri, budzetMax: e.target.value})}
                        />
                    </div>

                    <div className="small-filter-box">
                        <label>Sortiraj cene:</label>
                        <select 
                            value={filteri.sortiranje}
                            onChange={(e) => updateFilteri({...filteri, sortiranje: e.target.value})}
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
                            onChange={(e) => updateFilteri({...filteri, tipPutovanja: e.target.value})}
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
                            onChange={(e) => updateFilteri({...filteri, trajanjeDana: e.target.value})}
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
                            onChange={(e) => updateFilteri({...filteri, smestaj: e.target.value})}
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
                                onClick={() => updateFilteri({...filteri, kategorija: kat})}
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
                                                onClick={() => handleOtvoriDetalje(trip)}
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
                                disabled={aktivnaStranica === 1}
                            >
                                ◀ Prethodna
                            </button>
                            
                            {Array.from({ length: ukupnoStranica }, (_, i) => i + 1).map((brojStranice) => (
                                <button
                                    key={brojStranice}
                                    className={`pagination-btn ${aktivnaStranica === brojStranice ? 'active' : ''}`}
                                    onClick={() => setTrenutnaStranica(brojStranice)}
                                >
                                    {brojStranice}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-btn"
                                onClick={() => setTrenutnaStranica(prev => Math.min(prev + 1, ukupnoStranica))}
                                disabled={aktivnaStranica === ukupnoStranica}
                            >
                                Sledeća ▶
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="offers-load-more-container" style={{ marginTop: '20px', marginBottom: '40px' }}>
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#a19e95' }}>
                    Stranica <strong>{aktivnaStranica}</strong> od ukupno <strong>{ukupnoStranica}</strong>
                </div>
            </div>

            {/* NEDAVNO PREGLEDANO (sessionStorage) */}
            {(() => {
                const SVE_OPC_PONUDE: ITrip[] = SVE_PONUDE;
                const recentlyViewedTrips = recentlyViewedIds
                    .map(id => SVE_OPC_PONUDE.find(t => t.id === id))
                    .filter((t): t is ITrip => !!t);

                if (recentlyViewedTrips.length === 0) return null;

                return (
                    <div className="recently-viewed-section" style={{ maxWidth: '1200px', margin: '40px auto 60px auto', padding: '0 20px', clear: 'both' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eae8e4', paddingBottom: '10px' }}>
                            <h3 style={{ fontSize: '16px', fontFamily: 'Playfair Display', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                👀 Nedavno ste pregledali (sačuvano u sesiji):
                            </h3>
                            <button
                                onClick={() => {
                                    setRecentlyViewedIds([]);
                                    sessionStorage.removeItem('travel_recently_viewed');
                                }}
                                style={{ background: 'none', border: 'none', color: '#cf4638', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                            >
                                Očisti istoriju pregleda
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {recentlyViewedTrips.map(rt => {
                                const taxPrice = Math.round(travelTripCalculator.izracunajSaPorezom(rt.cena));
                                return (
                                    <div key={rt.id} style={{ display: 'flex', gap: '12px', background: '#fcfbf9', border: '1px solid #eae8e4', borderRadius: '8px', padding: '10px', alignItems: 'center' }}>
                                        <img src="slike/image5.png" alt={rt.naslov} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rt.naslov}</h4>
                                            <div style={{ fontSize: '11px', color: '#6e6b64', marginTop: '2px' }}>{rt.trajanjeDana} dana • {rt.tipPutovanja}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#cf4638' }}>{travelTripCalculator.formatirajCenu(taxPrice)}</span>
                                                <button 
                                                    onClick={() => handleOtvoriDetalje(rt)}
                                                    style={{ background: '#cf4638', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Otvori ➔
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* INTERAKTIVNI MODAL ZA REZERVACIJU / DETALJE */}
            {selectedTripForModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '850px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Dugme za zatvaranje */}
                        <button 
                            onClick={() => setSelectedTripForModal(null)}
                            style={{
                                position: 'absolute',
                                top: '15px', right: '15px',
                                background: '#f5f4f0',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px', height: '32px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                                fontWeight: 'bold',
                                color: '#6e6b64',
                                zIndex: 10
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#eae8e4'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f5f4f0'}
                        >
                            ✕
                        </button>

                        {!isBookedSuccess ? (
                            <form onSubmit={handlePotvrdiRezervaciju} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', width: '100%', margin: 0 }} className="responsive-modal-grid">
                                
                                {/* Leva strana: Detalji ponude */}
                                <div style={{ background: '#fcfbf9', padding: '30px', borderRight: '1px solid #eae8e4' }}>
                                    <span style={{ fontSize: '11px', background: '#cf4638', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {selectedTripForModal.kategorija}
                                    </span>
                                    <h3 style={{ fontSize: '28px', fontFamily: 'Playfair Display', fontWeight: 800, margin: '10px 0', color: '#1a1a1a' }}>
                                        {selectedTripForModal.naslov}
                                    </h3>
                                    
                                    <img src="slike/image5.png" alt={selectedTripForModal.naslov} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                                    
                                    <p style={{ fontSize: '13px', color: '#6e6b64', lineHeight: '1.6', marginBottom: '20px' }}>
                                        {selectedTripForModal.opis}
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderTop: '1px dashed #eae8e4', paddingTop: '15px' }}>
                                        <div>⏱️ <strong>Trajanje:</strong> {selectedTripForModal.trajanjeDana} dana</div>
                                        <div>🏨 <strong>Smeštaj:</strong> Hotel {selectedTripForModal.smestaj}</div>
                                        <div>🏷️ <strong>Tip putovanja:</strong> {selectedTripForModal.tipPutovanja}</div>
                                        <div style={{ marginTop: '10px', fontSize: '14px', borderTop: '1px solid #eae8e4', paddingTop: '10px' }}>
                                            Osnovna cena: <strong style={{ color: '#cf4638' }}>{travelTripCalculator.formatirajCenu(Math.round(travelTripCalculator.izracunajSaPorezom(selectedTripForModal.cena)))}</strong> sa porezom
                                        </div>
                                    </div>
                                </div>

                                {/* Desna strana: Rezervaciona forma */}
                                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
                                    <div>
                                        <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '5px', color: '#1a1a1a' }}>Potvrda rezervacije</h3>
                                        <p style={{ fontSize: '12.5px', color: '#6e6b64', marginBottom: '20px' }}>Popunite podatke u nastavku za brzu rezervaciju. Podaci sa Vašeg profila su automatski preuzeti kako biste uštedeli vreme.</p>

                                        {/* Polja */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>Ime i prezime putnika:</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={bookingIme}
                                                    onChange={e => setBookingIme(e.target.value)}
                                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #eae8e4', borderRadius: '6px', fontSize: '13.5px' }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>E-mail:</label>
                                                    <input 
                                                        type="email" 
                                                        required
                                                        value={bookingEmail}
                                                        onChange={e => setBookingEmail(e.target.value)}
                                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #eae8e4', borderRadius: '6px', fontSize: '13.5px' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>Telefon:</label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        value={bookingTelefon}
                                                        onChange={e => setBookingTelefon(e.target.value)}
                                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #eae8e4', borderRadius: '6px', fontSize: '13.5px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>Željeni datum polaska:</label>
                                                    <input 
                                                        type="date" 
                                                        required
                                                        value={bookingDatum}
                                                        onChange={e => setBookingDatum(e.target.value)}
                                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #eae8e4', borderRadius: '6px', fontSize: '13.5px' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>Broj putnika:</label>
                                                    <select 
                                                        value={bookingOsoba}
                                                        onChange={e => setBookingOsoba(parseInt(e.target.value))}
                                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #eae8e4', borderRadius: '6px', fontSize: '13.5px', background: '#fff' }}
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'osoba' : n < 5 ? 'osobe' : 'osoba'}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Dodaci */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>Dodatne opcije za izlet (pojedinačne cene):</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {[
                                                        { name: "Osiguranje", price: "25€", desc: "Putno zdravstveno osiguranje" },
                                                        { name: "Polupansion", price: "60€", desc: "Uključen doručak i večera" },
                                                        { name: "Lokalni vodič", price: "30€", desc: "Stručno vođenje na jeziku" }
                                                    ].map(opt => {
                                                        const isChecked = odabraniDodaci.includes(opt.name);
                                                        return (
                                                            <label key={opt.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', background: isChecked ? '#fffcfb' : '#faf9f6', padding: '6px 10px', borderRadius: '6px', border: isChecked ? '1px solid #cf4638' : '1px solid #eae8e4', transition: 'all 0.2s' }}>
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => {
                                                                        if (isChecked) {
                                                                            setOdabraniDodaci(odabraniDodaci.filter(x => x !== opt.name));
                                                                        } else {
                                                                            setOdabraniDodaci([...odabraniDodaci, opt.name]);
                                                                        }
                                                                    }}
                                                                    style={{ accentColor: '#cf4638' }}
                                                                />
                                                                <div style={{ flex: 1 }}>
                                                                    <strong>{opt.name}</strong> <span style={{ color: '#6e6b64', fontSize: '11px' }}>({opt.desc})</span>
                                                                </div>
                                                                <span style={{ fontWeight: 'bold', color: '#cf4638' }}>+{opt.price}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kalkulacija cene i slanje */}
                                    <div style={{ borderTop: '1px solid #eae8e4', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6e6b64' }}>Konačna obračunata cena:</div>
                                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>
                                                {(() => {
                                                    const bP = travelTripCalculator.izracunajSaPorezom(selectedTripForModal.cena);
                                                    let bonus = 0;
                                                    if (odabraniDodaci.includes("Osiguranje")) bonus += 25;
                                                    if (odabraniDodaci.includes("Polupansion")) bonus += 60;
                                                    if (odabraniDodaci.includes("Lokalni vodič")) bonus += 30;
                                                    return travelTripCalculator.formatirajCenu(Math.round((bP * bookingOsoba) + bonus));
                                                })()}
                                            </div>
                                        </div>
                                        
                                        <button 
                                            type="submit"
                                            style={{
                                                background: '#cf4638',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '12px 20px',
                                                fontSize: '13.5px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 6px -1px rgba(207, 70, 56, 0.25)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Potvrdi rezervaciju 🚀
                                        </button>
                                    </div>

                                </div>
                            </form>
                        ) : (
                            /* USPEH REZERVACIJE */
                            <div style={{ padding: '50px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '50px' }}>🎉</span>
                                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Rezervacija uspešno kreirana!</h2>
                                <p style={{ fontSize: '14px', color: '#6e6b64', maxWidth: '450px', margin: '0 auto', lineHeight: '1.6' }}>
                                    Vaša rezervacija za putovanje <strong>{selectedTripForModal.naslov}</strong> je uspešno obrađena i zabeležena u sistemu (lokalno skladište)! Popunjeni lični podaci kao i konačni obračun cene su uspešno sinhronizovani. Detalje možete pratiti na Vašem nalogu u bilo kom trenutku.
                                </p>
                                <div style={{ background: '#faf9f6', padding: '15px 25px', borderRadius: '8px', border: '1px solid #eae8e4', display: 'inline-flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', margin: '10px 0', textAlign: 'left' }}>
                                    <div>📍 <strong>Destinacija:</strong> {selectedTripForModal.naslov}</div>
                                    <div>📅 <strong>Datum polaska:</strong> {new Date(bookingDatum).toLocaleDateString('sr-RS')}</div>
                                    <div>👥 <strong>Broj putnika:</strong> {bookingOsoba} putnik(a)</div>
                                    <div>💳 <strong>Plaćanje:</strong> Preko povezane kartice {profile?.kartica || "Automatski"}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedTripForModal(null)}
                                        style={{ background: '#eae8e4', color: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Zatvori prozor
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/profile')}
                                        style={{ background: '#cf4638', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Pogledaj na Profilu 👤
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;