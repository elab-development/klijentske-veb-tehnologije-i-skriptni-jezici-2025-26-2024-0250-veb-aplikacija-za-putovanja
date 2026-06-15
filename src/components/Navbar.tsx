import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <Link to="/">Prijava</Link>
            <Link to="/offers">Ponude</Link>
        </nav>
    );
};

export default Navbar;