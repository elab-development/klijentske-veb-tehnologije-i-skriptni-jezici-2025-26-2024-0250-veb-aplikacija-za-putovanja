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
}