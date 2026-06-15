import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TripCalculator } from '../models/TripModels';
import type { ITrip } from '../models/TripModels'; // Dodato 'type' - ovo rešava grešku!
import "../App.css";
 <Navbar />
const Offers = () => {
    const navigate = useNavigate();
    
    // Tipiziramo state pomoću tvog ITrip interfejsa
    const [trips, setTrips] = useState<ITrip[]>([]);
    
    useEffect(() => {
        const mockData: ITrip[] = [
            { 
                id: 1, 
                naslov: "Pariz", 
                opis: "Grad svetlosti i romantike, poznat po umetnosti, istoriji i jedinstvenoj arhitekturi.", 
                cena: 165, // Osnovna cena bez poreza
                slika: "/paris.jpg",
                kategorija: "Evropa"
            },
            { 
                id: 2, 
                naslov: "Rim", 
                opis: "Večni grad bogate istorije, antičkih građevina i autentične italijanske kulture.", 
                cena: 207, // Osnovna cena bez poreza
                slika: "/rome.jpg",
                kategorija: "Evropa"
            }
        ];
        setTrips(mockData);
    }, []);

    return (
        <div className="offers-page">
           

            <div className="offers-header">
                <h1 className="offers-main-title">Preporučene ponude</h1>
                <p className="offers-subtitle">Izdvojene gotove ponude za Vas!</p>
            </div>

            <div className="offers-container">
                <h3 className="offers-section-title">Po vašoj listi želja smo izdvojili:</h3>
                
                <div className="offers-grid">
                    {trips.map(trip => {
                        // Koristimo tvoju statičku klasu TripCalculator za računanje cene sa 20% poreza
                        // Npr. 165 * 1.20 = 199€ | 207 * 1.20 = 249€
                        const konacnaCena = Math.round(TripCalculator.izracunajSaPorezom(trip.cena));

                        return (
                            <div key={trip.id} className="offer-card">
                                <div className="offer-image-box">
                                    <img src={trip.slika} alt={trip.naslov} />
                                </div>
                                
                                <p className="offer-description">{trip.opis}</p>
                                
                                <div className="offer-footer-row">
                                    <div className="offer-price">
                                        <span className="price-label">Od</span>
                                        <span className="price-amount">€{konacnaCena}</span>
                                    </div>
                                    <button 
                                        className="offer-info-btn" 
                                        onClick={() => navigate(`/offers/${trip.id}`)}
                                    >
                                        Više informacija
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="offers-load-more-container">
                <button className="offers-load-more-btn">
                    Prikaži još ponuda <span className="arrow-icon">↩</span>
                </button>
            </div>
        </div>
    );
};

export default Offers;