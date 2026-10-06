import styles from "./Header.module.css";
import logo from "./logo.png"; 

function Header() {
    return (
        <header className= { styles.header } >
        <h1 className={ styles.title }>
            <img src={ logo } alt = "Andromeda Studio Logo" className = { styles.logo } />
                Andromeda Studio
                    </h1>
                    </header>
  );
}

export default Header;