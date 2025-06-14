import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Users, Wifi, Zap, Wind } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  increment,
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase-config'; // Make sure to import your Firebase config

// Firebase service functions
const fetchLocations = async () => {
  try {
    const locationsCollection = collection(db, 'locations');
    const locationsSnapshot = await getDocs(locationsCollection);
    return locationsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(location => location.isActive);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

const fetchRoutes = async (sourceLocation, destinationLocation) => {
  try {
    const routesCollection = collection(db, 'routes');
    const routesSnapshot = await getDocs(routesCollection);
    const routes = routesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return routes.filter(route => 
      route.isActive && 
      route.sourceLocation === sourceLocation && 
      route.destinationLocation === destinationLocation
    );
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

const fetchSchedulesByRoute = async (routeId, selectedDate) => {
  try {
    const schedulesCollection = collection(db, 'schedules');
    const q = query(
      schedulesCollection, 
      where('routeId', '==', routeId),
      where('departureDate', '==', selectedDate),
      where('isActive', '==', true)
    );
    const schedulesSnapshot = await getDocs(q);
    const schedules = schedulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by departure time in JavaScript instead of Firestore
    return schedules.sort((a, b) => {
      return a.departureTime.localeCompare(b.departureTime);
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};

const fetchBusDetails = async (busId) => {
  try {
    const busDoc = doc(db, 'buses', busId);
    const busSnapshot = await getDoc(busDoc);
    if (busSnapshot.exists()) {
      return { id: busSnapshot.id, ...busSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching bus details:', error);
    return null;
  }
};

const createBooking = async (bookingData) => {
  try {
    // Add booking to bookings collection
    const bookingsCollection = collection(db, 'bookings');
    const bookingRef = await addDoc(bookingsCollection, {
      ...bookingData,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      createdAt: new Date()
    });

    // Update available seats in schedule
    const scheduleDoc = doc(db, 'schedules', bookingData.scheduleId);
    await updateDoc(scheduleDoc, {
      availableSeats: increment(-bookingData.seatsBooked)
    });

    return bookingRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const BusTicketBooking = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [availableBuses, setAvailableBuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setInitialLoading(true);
      const locationData = await fetchLocations();
      setLocations(locationData);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const searchBuses = async () => {
    if (!searchData.from || !searchData.to) {
      alert('Please select both source and destination locations');
      return;
    }

    if (searchData.from === searchData.to) {
      alert('Source and destination cannot be the same');
      return;
    }

    setLoading(true);
    setAvailableBuses([]);
    
    try {
      // Find routes that match the search criteria
      const routes = await fetchRoutes(searchData.from, searchData.to);
      
      if (routes.length === 0) {
        setAvailableBuses([]);
        setLoading(false);
        return;
      }

      // Get all schedules for matching routes
      const allSchedules = [];
      for (const route of routes) {
        const schedules = await fetchSchedulesByRoute(route.routeId, searchData.date);
        allSchedules.push(...schedules.map(schedule => ({ ...schedule, route })));
      }

      // Get bus details for each schedule
      const busDetails = [];
      for (const schedule of allSchedules) {
        const bus = await fetchBusDetails(schedule.busId);
        if (bus && bus.status === 'active') {
          busDetails.push({
            ...schedule,
            ...bus,
            scheduleId: schedule.id
          });
        }
      }

      // Filter out buses with no available seats
      const availableBusesWithSeats = busDetails.filter(bus => bus.availableSeats > 0);
      setAvailableBuses(availableBusesWithSeats);
      
    } catch (error) {
      console.error('Error searching buses:', error);
      alert('Error searching buses. Please try again.');
      setAvailableBuses([]);
    }
    
    setLoading(false);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'ac': return <Wind className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'usb charging': return <Zap className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleBooking = (bus) => {
    setSelectedBus(bus);
    setShowBooking(true);
  };

  const BookingModal = ({ bus, onClose }) => {
    const [passengerInfo, setPassengerInfo] = useState({
      name: '',
      phone: '',
      email: '',
      seats: 1
    });
    const [bookingLoading, setBookingLoading] = useState(false);

    const handleBookingSubmit = async () => {
      if (!passengerInfo.name || !passengerInfo.phone) {
        alert('Please fill in all required fields');
        return;
      }

      if (passengerInfo.seats > bus.availableSeats) {
        alert(`Only ${bus.availableSeats} seats are available`);
        return;
      }

      setBookingLoading(true);
      
      try {
        const bookingData = {
          scheduleId: bus.scheduleId,
          busId: bus.busId,
          routeId: bus.routeId,
          passengerName: passengerInfo.name,
          passengerPhone: passengerInfo.phone,
          passengerEmail: passengerInfo.email,
          seatsBooked: passengerInfo.seats,
          totalFare: bus.fare * passengerInfo.seats,
          departureDate: bus.departureDate,
          departureTime: bus.departureTime,
          sourceLocation: searchData.from,
          destinationLocation: searchData.to,
          busNumber: bus.busNumber,
          busName: bus.busName
        };

        const bookingId = await createBooking(bookingData);
        
        alert(`Booking confirmed!\nBooking ID: ${bookingId}\nPassenger: ${passengerInfo.name}\nSeats: ${passengerInfo.seats}\nTotal Amount: ₹${bus.fare * passengerInfo.seats}`);
        
        // Refresh the bus list to show updated seat availability
        searchBuses();
        onClose();
        
      } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed. Please try again.');
      } finally {
        setBookingLoading(false);
      }
    };

    const maxSeats = Math.min(5, bus.availableSeats); // Limit to 5 seats or available seats

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book Your Ticket</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={bookingLoading}
              >
                ×
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold">{bus.busName}</h3>
              <p className="text-sm text-gray-600">{bus.busNumber}</p>
              <p className="text-sm">{searchData.from} → {searchData.to}</p>
              <p className="text-sm">{bus.departureTime} - {bus.arrivalTime}</p>
              <p className="font-semibold text-blue-600">₹{bus.fare} per seat</p>
              <p className="text-sm text-green-600">{bus.availableSeats} seats available</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={passengerInfo.name}
                  onChange={(e) => setPassengerInfo({...passengerInfo, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={passengerInfo.phone}
                  onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={passengerInfo.email}
                  onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Number of Seats</label>
                <select
                  value={passengerInfo.seats}
                  onChange={(e) => setPassengerInfo({...passengerInfo, seats: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                >
                  {Array.from({length: maxSeats}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} Seat{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-xl text-blue-600">₹{bus.fare * passengerInfo.seats}</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Book Your Bus Ticket</h1>
        
        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={searchData.from}
              onChange={(e) => setSearchData({...searchData, from: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select departure city</option>
              {locations.map(location => (
                <option key={location.locationId} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={searchData.to}
              onChange={(e) => setSearchData({...searchData, to: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select destination city</option>
              {locations.map(location => (
                <option key={location.locationId} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={searchBuses}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for available buses...</p>
        </div>
      )}

      {!loading && availableBuses.length === 0 && searchData.from && searchData.to && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No buses found for the selected route and date.</p>
          <p className="text-gray-500 mt-2">Please try different locations or dates.</p>
        </div>
      )}

      {!loading && availableBuses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Buses ({availableBuses.length})</h2>
          
          {availableBuses.map((bus) => (
            <div key={bus.scheduleId} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{bus.busName}</h3>
                      <p className="text-gray-600">{bus.busNumber} • {bus.operator}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {bus.departureTime} - {bus.arrivalTime}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {bus.availableSeats} seats available
                        </div>
                      </div>
                      
                      {bus.amenities && bus.amenities.length > 0 && (
                        <div className="flex items-center gap-3 mt-3">
                          {bus.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹{bus.fare}</div>
                  <div className="text-sm text-gray-500">per seat</div>
                </div>
                
                <div className="text-center lg:text-right">
                  <button
                    onClick={() => handleBooking(bus)}
                    disabled={bus.availableSeats === 0}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium w-full lg:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {bus.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedBus && (
        <BookingModal 
          bus={selectedBus} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </div>
  );
};

export default BusTicketBooking;