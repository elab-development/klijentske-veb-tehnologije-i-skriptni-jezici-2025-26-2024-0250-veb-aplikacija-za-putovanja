export interface ITrip {
    id: number;
    naslov: string;
    opis: string;
    cena: number;
    slika: string;
    kategorija: string;
}

export interface IReview {
    id: number;
    ime: string;
    tekst: string;
    ocena: number;
}

// 1. Interfejs sa metodama za kalkulaciju cena i popusta
export interface ITripCalculator {
    izracunajSaPorezom(cena: number): number;
    primeniPopust(cena: number, popust: number): number;
    formatirajCenu(cena: number): string;
}

// 2. Interfejs sa metodama za proveru i obradu recenzija i komentara
export interface IReviewValidator {
    proveriDuzinuKomentara(tekst: string, min?: number, max?: number): boolean;
    formatirajImeAutora(ime: string): string;
}

export class TripCalculator implements ITripCalculator {
    // Implementacija metoda iz interfejsa ITripCalculator
    izracunajSaPorezom(cena: number): number {
        return cena * 1.20;
    }

    primeniPopust(cena: number, popust: number): number {
        return cena - (cena * (popust / 100));
    }

    formatirajCenu(cena: number): string {
        return `€${Math.round(cena)}`;
    }

    // Statičke verzije metoda radi kompletne kompatibilnosti unutar aplikacije
    static izracunajSaPorezom(cena: number): number {
        return cena * 1.20;
    }

    static primeniPopust(cena: number, popust: number): number {
        return cena - (cena * (popust / 100));
    }

    static formatirajCenu(cena: number): string {
        return `€${Math.round(cena)}`;
    }
}

export class ReviewValidator implements IReviewValidator {
    // Implementacija metoda iz interfejsa IReviewValidator
    proveriDuzinuKomentara(tekst: string, min: number = 10, max: number = 250): boolean {
        const cistTekst = tekst.trim();
        return cistTekst.length >= min && cistTekst.length <= max;
    }

    formatirajImeAutora(ime: string): string {
        const cistoIme = ime.trim();
        if (!cistoIme) return "Anoniman putnik";
        
        // Reči počinju velikim slovom
        return cistoIme
            .split(/\s+/)
            .map(rec => rec.charAt(0).toUpperCase() + rec.slice(1).toLowerCase())
            .join(" ");
    }

    // Statičke verzije metoda radi kompletne kompatibilnosti unutar aplikacije
    static proveriDuzinuKomentara(tekst: string, min: number = 10, max: number = 250): boolean {
        const cistTekst = tekst.trim();
        return cistTekst.length >= min && cistTekst.length <= max;
    }

    static formatirajImeAutora(ime: string): string {
        const cistoIme = ime.trim();
        if (!cistoIme) return "Anoniman putnik";
        
        return cistoIme
            .split(/\s+/)
            .map(rec => rec.charAt(0).toUpperCase() + rec.slice(1).toLowerCase())
            .join(" ");
    }
}

// Izvozimo konkretne instance koje implementiraju navedene interfejse
export const travelTripCalculator: ITripCalculator = new TripCalculator();
export const travelReviewValidator: IReviewValidator = new ReviewValidator();
