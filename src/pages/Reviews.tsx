import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { IReview } from '../models/TripModels'; // DODATO 'type' pred IReview!
import "../App.css";
 <Navbar />
const Reviews = () => {
    // Strogo tipiziran state prema tvom modelu
    const [reviews, setReviews] = useState<IReview[]>([
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
            ocena: 5,
            tekst: "Rezervacija je bila završena za manje od 5 minuta. Aplikacija je pregledna, jednostavna i stvarno mi je pomogla da pronađem idealno putovanje za vikend."
        }
    ]);

    const [noviKomentar, setNoviKomentar] = useState("");

    // Funkcija koja generiše zvezdice na osnovu broja (ocena) iz modela
    const renderStars = (ocena: number) => {
        return "⭐".repeat(ocena);
    };

    return (
        <div className="reviews-page">
         

            <div className="reviews-header">
                <h1 className="reviews-main-title">Iskustvo naših klijenata</h1>
                <p className="reviews-subtitle">Priče putnika koji su sa nama stvorili nezaboravne uspomene!</p>
            </div>

            <div className="reviews-container">
                {reviews.map((r, index) => (
                    <div key={r.id} className="review-row-item">
                        <div className="review-avatar-box">
                            <img src={`slike/image.png`} alt={r.ime} />
                        </div>
                        
                        <div className="review-content-box">
                            <div className="review-stars">{renderStars(r.ocena)}</div>
                            <p className="review-text">
                                "{r.tekst}" <span className="review-author">— {r.ime}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="share-experience-card">
                <h3>Podelite vaše iskustvo</h3>
                <div className="share-stars">☆☆☆☆☆</div>
                <div className="share-input-row">
                    <div className="share-user-avatar">
                        <img src="/slike/image2.png" alt="Korisnik" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="..." 
                        value={noviKomentar}
                        onChange={(e) => setNoviKomentar(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Reviews;