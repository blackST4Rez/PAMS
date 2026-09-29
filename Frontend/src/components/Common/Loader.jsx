import { FadeLoader } from 'react-spinners';

/*
  Page-level loader — matches the login button spinner:
  small white FadeLoader, centered.
*/
const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <span
                style={{
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                }}
            >
                <FadeLoader color="#173ef0" />
            </span>
        </div>
    );
};

export default Loader;