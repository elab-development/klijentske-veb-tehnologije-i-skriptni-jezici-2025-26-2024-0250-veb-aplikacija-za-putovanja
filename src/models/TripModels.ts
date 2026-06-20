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

export class TripCalculator {
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

export class ReviewValidator {
    static proveriDuzinuKomentara(tekst: string, min: number = 10, max: number = 250): boolean {
        const cistTekst = tekst.trim();
        return cistTekst.length >= min && cistTekst.length <= max;
    }

    static formatirajImeAutora(ime: string): string {
        const cistoIme = ime.trim();
        if (!cistoIme) return "Anoniman putnik";
        
        // Reči počinju velikim slovom
        return cistoIme
            .split(/\s+/)
            .map(rec => rec.charAt(0).toUpperCase() + rec.slice(1).toLowerCase())
            .join(" ");
    }
}