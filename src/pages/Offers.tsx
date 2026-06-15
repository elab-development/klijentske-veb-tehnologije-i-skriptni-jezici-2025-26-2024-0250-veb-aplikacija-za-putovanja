import React, { useState, useEffect } from 'react';
import { type ITrip, TripCalculator } from '../models/TripModels';
import CustomButton from '../components/CustomButton';

const Offers = () => {
    const [trips, setTrips] = useState<ITrip[]>([]);
    
    useEffect(() => {
        const mockData: ITrip[] = [
            { id: 1, naslov: "Pariz", opis: "Grad svetlosti", cena: 199, slika: "paris.jpg", kategorija: "Evropa" }
        ];
        setTrips(mockData);
    }, []);

    return (
        <div>
            <h2>Preporučene ponude</h2>
            {trips.map(trip => (
                <div key={trip.id}>
                    <h3>{trip.naslov}</h3>
                    <p>Cena: {TripCalculator.izracunajSaPorezom(trip.cena)}€</p>
                </div>
            ))}
        </div>
    );
};

export default Offers;