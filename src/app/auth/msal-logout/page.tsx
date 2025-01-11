import styles from './styles.module.css';
// import Auth from './components/Auth';

export default function MsalLogoutPage() {
    return (
        <div className="jumbotron" style={{ margin: '10%' }}>
            <h1>Goodbye!</h1>
            <p>You have signed out and your cache has been cleared.</p>
            <a className="btn btn-primary" href="/" role="button">Take me back</a>
        </div>
    );
}
