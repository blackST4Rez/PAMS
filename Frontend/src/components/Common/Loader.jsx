import { FadeLoader } from 'react-spinners';

/*
  Shared page-level loader — a centered FadeLoader, no caption.
*/
const Loader = () => {
    return (
        <div className="fade-in flex items-center justify-center">
            <FadeLoader color="#173ef0" scale={1.4} />
        </div>
    );
};

export default Loader;