import React, { createContext, useContext, useState, useEffect } from 'react';

export interface IProfileData {
  ime: string;
  pol: string;
  datumRodjenja: string;
  telefon: string;
  email: string;
  kartica: string;
}

export interface IBooking {
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

interface AppContextType {
  profile: IProfileData;
  wishlist: string[];
  bookings: IBooking[];
  isAuthenticated: boolean;
  login: (email: string) => void;
  registerUser: (data: { ime: string; pol: string; telefon: string; email: string; rodjenje: string }) => void;
  logout: () => void;
  updateProfile: (data: IProfileData) => boolean;
  toggleWishlist: (tripName: string, category: string) => void;
  addBooking: (booking: IBooking) => void;
  cancelBooking: (id: number) => void;
  setWishlistExternally: (items: string[]) => void;
}

const defaultProfile: IProfileData = {
  ime: "Anja Karadžić",
  pol: "Žinski",
  datumRodjenja: "2005-05-23",
  telefon: "+381635492851",
  email: "anjakaradzic@gmail.com",
  kartica: "4532 9981 3324 6543"
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<IProfileData>(defaultProfile);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load initial states from localStorage if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('travel_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        localStorage.setItem('travel_profile', JSON.stringify(defaultProfile));
      }

      const savedWishlist = localStorage.getItem('travel_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedBookings = localStorage.getItem('travel_bookings');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }

      const savedAuth = localStorage.getItem('travel_isAuthenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Greška pri učitavanju Context skladišta:", e);
    }
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('travel_isAuthenticated', 'true');
    // If the logging-in email matches the profile email, keep current profile,
    // otherwise update email or initialize a default profile
    setProfile(prev => {
      const updated = { ...prev, email };
      localStorage.setItem('travel_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const registerUser = (data: { ime: string; pol: string; telefon: string; email: string; rodjenje: string }) => {
    const updatedProfile: IProfileData = {
      ime: data.ime,
      pol: data.pol || "Žinski",
      datumRodjenja: data.rodjenje,
      telefon: data.telefon,
      email: data.email,
      kartica: "4532 9981 3324 6543" // default mock card for new registrations
    };
    setProfile(updatedProfile);
    setIsAuthenticated(true);
    localStorage.setItem('travel_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('travel_isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('travel_isAuthenticated');
  };

  const updateProfile = (newData: IProfileData): boolean => {
    try {
      setProfile(newData);
      localStorage.setItem('travel_profile', JSON.stringify(newData));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const toggleWishlist = (tripName: string, category: string) => {
    const key = `${tripName} - ${category}`;
    setWishlist(prev => {
      let nextList: string[];
      if (prev.includes(key)) {
        nextList = prev.filter(x => x !== key);
      } else {
        nextList = [...prev, key];
      }
      localStorage.setItem('travel_wishlist', JSON.stringify(nextList));
      return nextList;
    });
  };

  const setWishlistExternally = (items: string[]) => {
    setWishlist(items);
    localStorage.setItem('travel_wishlist', JSON.stringify(items));
  };

  const addBooking = (newBooking: IBooking) => {
    setBookings(prev => {
      const nextList = [...prev, newBooking];
      localStorage.setItem('travel_bookings', JSON.stringify(nextList));
      return nextList;
    });
  };

  const cancelBooking = (id: number) => {
    setBookings(prev => {
      const nextList = prev.filter(b => b.id !== id);
      localStorage.setItem('travel_bookings', JSON.stringify(nextList));
      return nextList;
    });
  };

  return (
    <AppContext.Provider value={{
      profile,
      wishlist,
      bookings,
      isAuthenticated,
      login,
      registerUser,
      logout,
      updateProfile,
      toggleWishlist,
      addBooking,
      cancelBooking,
      setWishlistExternally
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
