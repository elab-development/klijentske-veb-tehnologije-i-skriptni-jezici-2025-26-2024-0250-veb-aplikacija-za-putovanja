import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { travelReviewValidator } from '../models/TripModels';
import type { IReview } from '../models/TripModels';
import "../App.css";

//uspesno pracenje logicke strukture projekta!!!

const Reviews = () => {
    // Strogo tipiziran state prema tvom modelu, sa učitavanjem iz skladišta
    const standardneRecenzije: IReview[] = [
        {
            id: 1,
            ime: "Nikola Marković",
            ocena: 5,
            tekst: "Koristio sam aplikaciju za planiranje letovanja i iskustvo je bilo odlično. Proces rezervacije je brz, a informacije su bile jasno prikazane."
        },
        {
            id: 2,
            ime: "Sara Ilić",
            ocena: 5,
            tekst: "Prvi put sam sama organizovala putovanje i aplikacija mi je baš olakšala ceo proces. Definitivno ću je koristiti ponovo."
        },
        {
            id: 3,
            ime: "Milica Jovanović",
            ocena: 4,
            tekst: "Rezervacija je bila završena za manje od 5 minuta. Aplikacija je pregledna, jednostavna i stvarno mi je pomogla da pronađem idealno putovanje za vikend."
        }
    ];

    const [reviews, setReviews] = useState<IReview[]>([]);
    
    // Form fields state
    const [noviKomentar, setNoviKomentar] = useState("");
    const [imeKorisnika, setImeKorisnika] = useState("");
    const [odabranaOcena, setOdabranaOcena] = useState<number>(5);
    const [hoveredOcena, setHoveredOcena] = useState<number | null>(null);
    const maxKaraktera = 250;

    // Load persisted reviews
    useEffect(() => {
        try {
            const storaged = localStorage.getItem('travel_reviews');
            if (storaged) {
                const parsed = JSON.parse(storaged);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setReviews(parsed);
                    return;
                }
            }
        } catch (e) {
            console.error(e);
        }
        // Fallback
        setReviews(standardneRecenzije);
    }, []);

    // Helper za repeat zvezdica
    const renderStars = (ocena: number) => {
        return "★".repeat(ocena) + "☆".repeat(5 - ocena);
    };

    // FUNCTIONALITY 3: Form submission with validation and persistence
    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!imeKorisnika.trim()) {
            alert("Molimo Vas da unesete Vaše ime.");
            return;
        }

        // Korišćenje metode iz interfejsa IReviewValidator preko instance travelReviewValidator
        const isValidComment = travelReviewValidator.proveriDuzinuKomentara(noviKomentar, 10, maxKaraktera);
        if (!isValidComment) {
            alert(`Vaša recenzija mora imati između 10 i ${maxKaraktera} karaktera.`);
            return;
        }

        // Korišćenje metode iz interfejsa IReviewValidator za formatiranje imena
        const formatiranoIme = travelReviewValidator.formatirajImeAutora(imeKorisnika);

        const novaRecenzija: IReview = {
            id: Date.now(), // Unikatan ID generisan preko tajmstempa
            ime: formatiranoIme,
            ocena: odabranaOcena,
            tekst: noviKomentar.trim()
        };

        const azuriranaLista = [novaRecenzija, ...reviews];
        setReviews(azuriranaLista);
        localStorage.setItem('travel_reviews', JSON.stringify(azuriranaLista));

        // Reset polja
        setNoviKomentar("");
        setImeKorisnika("");
        setOdabranaOcena(5);
        alert("Hvala Vam! Recenzija je uspješno dodana i sačuvana.");
    };

    return (
        <div className="reviews-page" id="reviews-page-root">
            <Navbar />

            <div className="reviews-header" id="reviews-main-header">
                <h1 className="reviews-main-title">Iskustvo naših klijenata</h1>
                <p className="reviews-subtitle">Priče putnika koji su sa nama stvorili nezaboravne uspomene!</p>
            </div>

            <div className="reviews-container" id="reviews-feed">
                {reviews.map((r) => (
                    <div key={r.id} className="review-row-item" id={`review-item-${r.id}`}>
                        <div className="review-avatar-box">
                            <span className="review-avatar-emoji">👤</span>
                        </div>
                        
                        <div className="review-content-box">
                            <div className="review-stars" style={{ color: '#cf4638', fontSize: '18px', marginBottom: '4px' }}>
                                {renderStars(r.ocena)}
                            </div>
                            <p className="review-text">
                                "{r.tekst}"
                            </p>
                            <span className="review-author" style={{ fontSize: '13px', color: '#6e6b64', fontWeight: 700, marginTop: '5px' }}>
                                — {r.ime}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* FORM ZA DODAVANJE ISKUSTVA (Functionality 3 Interactive Form Container) */}
            <div className="share-experience-wrapper">
                <div className="share-experience-card" id="interactive-review-form-card" style={{ maxWidth: '600px' }}>
                    <h3>Podelite Vaše Iskustvo</h3>
                    <p style={{ fontSize: '13px', color: '#6e6b64', marginBottom: '16px' }}>Vaše povratne informacije nam pomažu da budemo još bolji!</p>
                    
                    <form onSubmit={handleAddReview} className="input-reviews-form">
                        
                        {/* Interactive Star Rating Selector input */}
                        <div className="rating-select-container">
                            <label className="input-form-label">Vaša ocena:</label>
                            <div className="interactive-stars-row">
                                {[1, 2, 3, 4, 5].map((starIndex) => {
                                    const isHighlighted = hoveredOcena !== null 
                                        ? starIndex <= hoveredOcena 
                                        : starIndex <= odabranaOcena;
                                    return (
                                        <span 
                                            key={starIndex}
                                            className={`interactive-star-icon ${isHighlighted ? 'star-gold' : 'star-muted'}`}
                                            onMouseEnter={() => setHoveredOcena(starIndex)}
                                            onMouseLeave={() => setHoveredOcena(null)}
                                            onClick={() => setOdabranaOcena(starIndex)}
                                            style={{ cursor: 'pointer', fontSize: '28px', marginRight: '6px' }}
                                        >
                                            {isHighlighted ? '★' : '☆'}
                                        </span>
                                    );
                                })}
                                <span className="rating-current-val">({odabranaOcena} / 5)</span>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="form-group-field" style={{ marginBottom: '14px', marginTop: '14px' }}>
                            <label className="input-form-label">Vaše ime i prezime:</label>
                            <input 
                                type="text"
                                className="styled-comment-input"
                                placeholder="Ime i prezime"
                                value={imeKorisnika}
                                onChange={(e) => setImeKorisnika(e.target.value)}
                                maxLength={50}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #eae8e4',
                                    outline: 'none',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Comment Input with Character Limit (Functionality 3 widget) */}
                        <div className="form-group-field" style={{ marginBottom: '6px' }}>
                            <label className="input-form-label">Napišite utiske sa putovanja:</label>
                            <textarea 
                                className="styled-comment-textarea"
                                placeholder="Podijelite više detalja o agenciji, hotelu, cijenama ili vodiču..."
                                value={noviKomentar}
                                onChange={(e) => {
                                    if (e.target.value.length <= maxKaraktera) {
                                        setNoviKomentar(e.target.value);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #eae8e4',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Real-time reactive counter */}
                        <div className="character-limit-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a19e95', marginBottom: '20px' }}>
                            <span>Minimalno 10 karaktera</span>
                            <span className={noviKomentar.length > maxKaraktera - 20 ? "limit-warning" : ""}>
                                Preostalo: {maxKaraktera - noviKomentar.length} / {maxKaraktera}
                            </span>
                        </div>

                        <button type="submit" className="login-btn" style={{ height: '44px', width: '100%', fontSize: '14.5px' }}>
                            Pošalji recenziju ★
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reviews;