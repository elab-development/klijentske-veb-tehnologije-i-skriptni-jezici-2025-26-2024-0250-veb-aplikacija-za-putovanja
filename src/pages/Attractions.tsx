import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { travelTripCalculator } from '../models/TripModels';

interface IBooking {
    id: number;
    destinacija: string;
    grad: string;
    datum: string;
    plan: string;
    brojOsoba: number;
    dodaci: string[];
    ukupnaCena: number;
    datumRezervacije: string;
}

const generateUniqueRandomId = () => {
    return Math.floor(Math.random() * 99999999) + 1;
};

// Gradovi sa cenama avantura
const GRAD_OPCIJE = [
    { grad: "Pariz", drzava: "Francuska", bazaCena: 199 },
    { grad: "Rim", drzava: "Italija", bazaCena: 149 },
    { grad: "Barselona", drzava: "Španija", bazaCena: 179 },
    { grad: "Tokio", drzava: "Japan", bazaCena: 490 }
];

// Detaljni planovi
const PLAN_OPCIJE: { [key: string]: { ime: string; doplata: number }[] } = {
    Francuska: [
        { ime: "Disneyland + Muzej Luvr", doplata: 40 },
        { ime: "Ajfelova Kula + Krstarenje Sennom", doplata: 20 },
        { ime: "Standard obilazak grada i katedrala", doplata: 0 }
    ],
    Italija: [
        { ime: "Koloseum + Vatikan muzeji", doplata: 35 },
        { ime: "Panteon + degustacija pasta i vina", doplata: 15 },
        { ime: "Standard šetnja gradom", doplata: 0 }
    ],
    Španija: [
        { ime: "Sagrada Familia + Park Guell", doplata: 30 },
        { ime: "Flamenko veče + tapas obilazak", doplata: 20 },
        { ime: "Standard posjeta starom gradu", doplata: 0 }
    ],
    Japan: [
        { ime: "Planina Fudži i Hakone izlet", doplata: 70 },
        { ime: "Šibuja prelaz + tradicionalni čaj ceremony", doplata: 30 },
        { ime: "Standard obilazak modernog Tokija", doplata: 0 }
    ]
};

const Attractions = () => {
    const navigate = useNavigate();
    const { addBooking } = useApp();

    // State za selektovani grad
    const [odabraniIndeks, setOdabraniIndeks] = useState<number>(0);
    const selektovaniGrad = GRAD_OPCIJE[odabraniIndeks];

    // Form states
    const [brojOsoba, setBrojOsoba] = useState<number>(1);
    const [datum, setDatum] = useState("2026-05-27");
    const [odabraniPlanIndeks, setOdabraniPlanIndeks] = useState<number>(0);

    // Extras/Services state
    const [dodaci, setDodaci] = useState({
        fastTrack: false, // 35 Eur po osobi
        privatniVodic: false, // 50 Eur fiksno
        transfer: false // 25 Eur po osobi
    });

    // Reaktivna kalkulacija cene (Functionality 4: Dynamic Budget Calculator)
    const obracun = useMemo(() => {
        const plans = PLAN_OPCIJE[selektovaniGrad.drzava] || [];
        const planDoplata = plans[odabraniPlanIndeks]?.doplata || 0;
        
        // Osnovna cena po osobi = baza + plan doplata
        const osnovicaPoOsobi = selektovaniGrad.bazaCena + planDoplata;
        const ukupnaOsnovica = osnovicaPoOsobi * brojOsoba;

        // Izračunaj dodatke
        let sumaDodataka = 0;
        if (dodaci.fastTrack) sumaDodataka += 35 * brojOsoba;
        if (dodaci.transfer) sumaDodataka += 25 * brojOsoba;
        if (dodaci.privatniVodic) sumaDodataka += 50; // flat fee

        const subtotal = ukupnaOsnovica + sumaDodataka;
        const izracunaniPorez = subtotal * 0.20; // 20% PDV
        const finalnaCena = subtotal + izracunaniPorez;

        return {
            osnovica: ukupnaOsnovica,
            naknadaDodaci: sumaDodataka,
            porez: Math.round(izracunaniPorez),
            ukupno: Math.round(finalnaCena)
        };
    }, [selektovaniGrad, odabraniPlanIndeks, brojOsoba, dodaci]);

    // FUNCTIONALITY 4: Create booking object and persist in LocalStorage Context
    const handleRezersisiSada = () => {
        const plans = PLAN_OPCIJE[selektovaniGrad.drzava] || [];
        const izabraniPlanIme = plans[odabraniPlanIndeks]?.ime || "Standard";

        const izabraniDodaciNazivi: string[] = [];
        if (dodaci.fastTrack) izabraniDodaciNazivi.push("Brzi prolaz (Fast Track)");
        if (dodaci.transfer) izabraniDodaciNazivi.push("Luksuzni transfer");
        if (dodaci.privatniVodic) izabraniDodaciNazivi.push("Privatni licencirani vodič");

        const uuidGeneratedId = generateUniqueRandomId();

        const novaRezervacija: IBooking = {
            id: uuidGeneratedId,
            destinacija: selektovaniGrad.drzava,
            grad: selektovaniGrad.grad,
            datum,
            plan: izabraniPlanIme,
            brojOsoba,
            dodaci: izabraniDodaciNazivi,
            ukupnaCena: obracun.ukupno,
            datumRezervacije: new Date().toLocaleDateString('sr-RS')
        };

        try {
            addBooking(novaRezervacija);

            alert(`Uspešno ste rezervisali izlet za ${selektovaniGrad.grad}! Vaša rezervacija je sačuvana u Vašem profilu.`);
            navigate('/profile');
        } catch (e) {
            console.error("Greška pri čuvanju rezervacije", e);
            alert("Došlo je do greške prilikom čuvanja rezervacije.");
        }
    };

    const trenutniPlanovi = PLAN_OPCIJE[selektovaniGrad.drzava] || [];

    return (
        <div className="attractions-page" id="attractions-page-root">
            <Navbar />
            
            <div className="attractions-header" id="attractions-main-header">
                <h2>Istraži izlete i atrakcije grada</h2>
                <p className="attractions-subtitle">Rezervišite ulaznice, brze propusnice i transfere direktno preko našeg interaktivnog servisa!</p>
                <div className="slanted-text">Zvijezde Vam predlažu personalizovane obilaske! ✨</div>
            </div>

            <div className="attractions-form-wrapper" id="attractions-configurator">
                
                {/* LEVA KARTICA: Lokacija, Datum i Plan */}
                <div className="attractions-card" id="configurator-left-card">
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '20px', marginBottom: '18px', borderBottom: '1.5px solid #eae8e4', paddingBottom: '8px' }}>1. Odaberite lokaciju</h3>
                    
                    <div className="attractions-input-box">
                        <label>Odaberite grad posjete:</label>
                        <select 
                            value={odabraniIndeks} 
                            onChange={(e) => {
                                setOdabraniIndeks(parseInt(e.target.value));
                                setOdabraniPlanIndeks(0);
                            }}
                            style={{ height: '46px', borderRadius: '12px', border: '1.5px solid #eae8e4' }}
                        >
                            {GRAD_OPCIJE.map((item, index) => (
                                <option key={index} value={index}>{item.grad} ({item.drzava})</option>
                            ))}
                        </select>
                    </div>

                    <div className="attractions-row-style" style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <div className="attractions-input-box" style={{ flex: 1 }}>
                            <label>Država:</label>
                            <input type="text" value={selektovaniGrad.drzava} disabled className="disabled-input" />
                        </div>
                        <div className="attractions-input-box" style={{ flex: 1 }}>
                            <label>Bazična cijena obilaska:</label>
                            <input type="text" value={travelTripCalculator.formatirajCenu(selektovaniGrad.bazaCena)} disabled className="disabled-input" />
                        </div>
                    </div>

                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '20px', marginBottom: '18px', marginTop: '24px', borderBottom: '1.5px solid #eae8e4', paddingBottom: '8px' }}>2. Detalji i plan ture</h3>

                    <div className="attractions-input-box">
                        <label>Plan obilaska / aktivnosti:</label>
                        <select 
                            value={odabraniPlanIndeks} 
                            onChange={(e) => setOdabraniPlanIndeks(parseInt(e.target.value))}
                        >
                            {trenutniPlanovi.map((plan, idx) => (
                                <option key={idx} value={idx}>
                                    {plan.ime} {plan.doplata > 0 ? `(+${travelTripCalculator.formatirajCenu(plan.doplata)})` : '(Uključeno u bazu)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="attractions-input-box" style={{ marginTop: '12px' }}>
                        <label>Datum planiranog polaska obilaska:</label>
                        <input 
                            type="date" 
                            value={datum} 
                            onChange={(e) => setDatum(e.target.value)}
                            style={{
                                height: '46px',
                                padding: '12px',
                                border: '1.5px solid #eae8e4',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background: '#ffffff',
                                width: '100%'
                            }} 
                        />
                    </div>
                </div>

                {/* DESNA KARTICA: Extras, Količina i Kalkulator */}
                <div className="attractions-card right-card-align" id="configurator-right-card">
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '20px', marginBottom: '18px', borderBottom: '1.5px solid #eae8e4', paddingBottom: '8px' }}>3. Dodatne pogodnosti i putnici</h3>
                    
                    <div className="attractions-input-box" style={{ marginBottom: '16px' }}>
                        <label>Broj putnika za koje se plaća:</label>
                        <div className="number-stepper-box" style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                type="button"
                                className="styled-step-btn" 
                                onClick={() => setBrojOsoba(prev => Math.max(1, prev - 1))}
                                style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eae8e4', fontWeight: 'bold' }}
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                value={brojOsoba} 
                                onChange={(e) => setBrojOsoba(Math.max(1, parseInt(e.target.value) || 1))} 
                                min="1"
                                style={{ textAlign: 'center', flex: 1, height: '40px' }}
                            />
                            <button 
                                type="button"
                                className="styled-step-btn" 
                                onClick={() => setBrojOsoba(prev => prev + 1)}
                                style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eae8e4', fontWeight: 'bold' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <label className="extras-section-label" style={{ display: 'block', fontSize: '13px', color: '#55534e', fontWeight: 600, marginBottom: '8px' }}>Podesi dodatne servise za cijelu grupu:</label>
                    <div className="extras-selector-lines" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        
                        <label className="checkbox-amenity-line" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1.5px solid #eae8e4', borderRadius: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={dodaci.fastTrack} 
                                onChange={(e) => setDodaci({...dodaci, fastTrack: e.target.checked})} 
                                style={{ accentColor: '#cf4638', width: '18px', height: '18px' }}
                            />
                            <div style={{ fontSize: '13.5px', fontWeight: 600 }}>
                                VIP Brzi prolaz (Fast Track) <span className="price-tag-sub">(+€35 po osobi)</span>
                            </div>
                        </label>

                        <label className="checkbox-amenity-line" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1.5px solid #eae8e4', borderRadius: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={dodaci.transfer} 
                                onChange={(e) => setDodaci({...dodaci, transfer: e.target.checked})} 
                                style={{ accentColor: '#cf4638', width: '18px', height: '18px' }}
                            />
                            <div style={{ fontSize: '13.5px', fontWeight: 600 }}>
                                Aerodromski Transfer <span className="price-tag-sub">(+€25 po osobi)</span>
                            </div>
                        </label>

                        <label className="checkbox-amenity-line" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1.5px solid #eae8e4', borderRadius: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={dodaci.privatniVodic} 
                                onChange={(e) => setDodaci({...dodaci, privatniVodic: e.target.checked})} 
                                style={{ accentColor: '#cf4638', width: '18px', height: '18px' }}
                            />
                            <div style={{ fontSize: '13.5px', fontWeight: 600 }}>
                                Licencirani Privatni Vodič <span className="price-tag-sub">(+€50 flat fee)</span>
                            </div>
                        </label>
                    </div>

                    {/* PRISTIN CALCULATOR BILL SUMMARY CONTAINER */}
                    <div className="calculator-receipt-box" style={{ background: '#faf9f6', border: '1.5px solid #eae8e4', borderRadius: '14px', padding: '18px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#a19e95' }}>PREGLED OBRAČUNA</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '13.5px', borderBottom: '1px solid #eae8e4', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Baza i turistički plan ({brojOsoba}x):</span>
                                <span style={{ fontWeight: 600 }}>{travelTripCalculator.formatirajCenu(obracun.osnovica)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Dodatne usluge / servisi:</span>
                                <span style={{ fontWeight: 600 }}>{travelTripCalculator.formatirajCenu(obracun.naknadaDodaci)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Turistička taksa & PDV (20%):</span>
                                <span style={{ fontWeight: 600 }}>{travelTripCalculator.formatirajCenu(obracun.porez)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Ukupno za uplatu:</span>
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '24px', fontWeight: 'bold', color: '#cf4638' }}>{travelTripCalculator.formatirajCenu(obracun.ukupno)}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* 4. DUGMIĆI NA DNU ZA AKCIJU */}
            <div className="attractions-footer-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', maxWidth: '1000px', margin: '40px auto 0 auto', padding: '0 40px' }}>
                <button 
                    className="attractions-special-btn" 
                    onClick={() => navigate('/offers')}
                    style={{ background: 'transparent', border: '1.5px solid #eae8e4', color: '#1e1e1e' }}
                >
                    Prikaži druge ponude ⟳
                </button>
                <button 
                    className="attractions-special-btn" 
                    onClick={handleRezersisiSada}
                    style={{ background: '#cf4638', color: '#ffffff' }}
                >
                    Završi rezervaciju & Sačuvaj ➔
                </button>
            </div>

        </div>
    );
};

export default Attractions;