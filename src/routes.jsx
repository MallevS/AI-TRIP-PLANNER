import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CreateTrip from './create-trip';
import MyTrips from './my-trips';
import About from './about/Index';
import Contact from './contact/Index';
import Pricing from './pricing/Index';
import Destinations from './destinations/Index';
import ViewTrip from './view-trip/[tripid]';

function RoutesComponent() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/view-trip/:tripId" element={<ViewTrip />} />
      </Routes>
    </HashRouter>
  );
}

export default RoutesComponent;
