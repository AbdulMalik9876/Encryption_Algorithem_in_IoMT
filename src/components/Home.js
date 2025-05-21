import Hero from './Hero';
import Highlights from './Highlights';
import Metrics from './Metrics';
import './styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <Hero />
      <Highlights />
      <Metrics />
    </div>
  );
}

export default Home;