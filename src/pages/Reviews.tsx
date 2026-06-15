import React, { useState, useEffect } from 'react';
import { type IReview } from '../models/TripModels';

const Reviews = () => {
    const [reviews, setReviews] = useState<IReview[]>([]);

    useEffect(() => {
    
        fetch('https://jsonplaceholder.typicode.com/comments?_limit=3')
            .then(res => res.json())
            .then(data => {
                const mappedReviews = data.map((item: any) => ({
                    id: item.id,
                    ime: item.email,
                    tekst: item.body,
                    ocena: 5
                }));
                setReviews(mappedReviews);
            });
    }, []);

    return (
        <div className="container">
            <h1>Iskustvo naših klijenata</h1>
            {reviews.map(r => (
                <div key={r.id} className="review-card">
                    <h4>{r.ime} ⭐⭐⭐⭐⭐</h4>
                    <p>"{r.tekst}"</p>
                </div>
            ))}
        </div>
    );
};
export default Reviews;