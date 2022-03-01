import BeatLoader from 'react-spinners/BeatLoader';
import './style.scss'

const FetchSpinner = () => {
  return <div className="fetch-spinner">
    <BeatLoader color="#393f60" size={25} />
  </div>
};

export default FetchSpinner;