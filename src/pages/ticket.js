import React, { useState, useEffect, useMemo } from 'react';
import { Search, Clock, Users, Wifi, Zap, Wind } from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { useAuth } from '@/lib/auth-context';

const FALLBACK_LOCATIONS = [
  'Bangalore',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kolkata',
  'Mumbai',
  'Pune',
  'Surat',
  'Vizag',
];

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
    Number(value) || 0
  );

const getDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export default function TicketBookingPage() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: getDateString(),
  });
  const [availableBuses, setAvailableBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLocations = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'locations'));
        if (!isMounted) return;

        if (snapshot.empty) {
          setLocations(FALLBACK_LOCATIONS);
        } else {
          const names = snapshot.docs
            .map((docSnap) => docSnap.data())
            .filter((loc) => loc?.isActive !== false)
            .map((loc) => loc.name)
            .filter(Boolean)
            .sort();
          setLocations(names.length ? names : FALLBACK_LOCATIONS);
        }
      } catch (err) {
        console.error('Failed to load locations', err);
        if (isMounted) {
          setLocations(FALLBACK_LOCATIONS);
        }
      } finally {
        if (isMounted) {
          setLocationsLoading(false);
        }
      }
    };

    fetchLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  const searchDisabled = useMemo(
    () => loading || locationsLoading,
    [loading, locationsLoading]
  );

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to) {
      alert('Please select both source and destination locations');
      return;
    }
    if (searchData.from === searchData.to) {
      alert('Source and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setAvailableBuses([]);

    try {
      const schedulesRef = collection(db, 'schedules');
      const schedulesQuery = query(
        schedulesRef,
        where('sourceLocation', '==', searchData.from),
        where('destinationLocation', '==', searchData.to),
        where('departureDate', '==', searchData.date)
      );

      const snapshot = await getDocs(schedulesQuery);
      if (snapshot.empty) {
        setAvailableBuses([]);
        return;
      }

      const enrichedSchedules = await Promise.all(
        snapshot.docs.map(async (scheduleDoc) => {
          const schedule = scheduleDoc.data();
          let busDetails = null;

          if (schedule.busId) {
            try {
              const busSnap = await getDoc(doc(db, 'buses', schedule.busId));
              if (busSnap.exists()) {
                busDetails = { id: busSnap.id, ...busSnap.data() };
              }
            } catch (error) {
              console.warn('Unable to read bus document', error);
            }
          }

          return {
            scheduleId: scheduleDoc.id,
            ...schedule,
            busId: busDetails?.id ?? schedule.busId ?? null,
            busName: busDetails?.busName ?? schedule.busName ?? 'Express Coach',
            busNumber: busDetails?.busNumber ?? schedule.busNumber ?? 'N/A',
            operator: busDetails?.operator ?? schedule.operator ?? 'Partner Operator',
            fare: busDetails?.fare ?? schedule.fare ?? 0,
            availableSeats:
              busDetails?.availableSeats ?? schedule.availableSeats ?? 0,
            totalSeats: busDetails?.totalSeats ?? schedule.totalSeats ?? 0,
            amenities: busDetails?.amenities ?? schedule.amenities ?? [],
            status: busDetails?.status ?? schedule.status ?? 'active',
          };
        })
      );

      const filtered = enrichedSchedules.filter(
        (bus) => bus.status !== 'sold_out' && bus.availableSeats > 0
      );
      setAvailableBuses(filtered);
    } catch (err) {
      console.error('Error fetching schedules', err);
      setError(
        'Unable to fetch schedules right now. Please try again in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch ((amenity || '').toLowerCase()) {
      case 'ac':
        return <Wind className="w-4 h-4" />;
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'usb charging':
      case 'charging':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const BookingModal = ({ bus, onClose }) => {
    const [passengerInfo, setPassengerInfo] = useState({
      name: user?.displayName || '',
      phone: '',
      email: user?.email || '',
      seats: 1,
    });
    const [bookingLoading, setBookingLoading] = useState(false);

    const handleBookingSubmit = async () => {
      if (!user) {
        alert('Please login to continue booking');
        return;
      }
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
        const bookingPayload = {
          scheduleId: bus.scheduleId,
          busId: bus.busId,
          busName: bus.busName,
          busNumber: bus.busNumber,
          operator: bus.operator,
          passengerName: passengerInfo.name,
          passengerPhone: passengerInfo.phone,
          passengerEmail: passengerInfo.email,
          seatsBooked: passengerInfo.seats,
          totalFare: bus.fare * passengerInfo.seats,
          departureDate: bus.departureDate,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          sourceLocation: bus.sourceLocation,
          destinationLocation: bus.destinationLocation,
          status: 'confirmed',
          bookingDate: serverTimestamp(),
          userId: user.uid,
        };

        const bookingRef = await addDoc(collection(db, 'bookings'), bookingPayload);

        if (bus.busId) {
          try {
            await updateDoc(doc(db, 'buses', bus.busId), {
              availableSeats: increment(-passengerInfo.seats),
            });
          } catch (seatError) {
            console.warn('Unable to update seat count', seatError);
          }
        }

        setAvailableBuses((prev) =>
          prev.map((item) =>
            item.scheduleId === bus.scheduleId
              ? {
                  ...item,
                  availableSeats: item.availableSeats - passengerInfo.seats,
                }
              : item
          )
        );

        alert(
          `Booking confirmed! 🎉\n\nBooking ID: ${bookingRef.id}\nPassenger: ${passengerInfo.name}\nSeats: ${passengerInfo.seats}\nTotal Amount: ${formatCurrency(
            bus.fare * passengerInfo.seats
          )}`
        );
        onClose();
      } catch (bookingError) {
        console.error('Error saving booking', bookingError);
        alert(
          bookingError?.message ||
            'Failed to save booking. Please check your internet connection and try again.'
        );
      } finally {
        setBookingLoading(false);
      }
    };

    const maxSeats = Math.min(5, bus.availableSeats);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
              <p className="text-sm">
                {bus.sourceLocation} → {bus.destinationLocation}
              </p>
              <p className="text-sm">
                {bus.departureTime} - {bus.arrivalTime}
              </p>
              <p className="font-semibold text-blue-600">
                {formatCurrency(bus.fare)} per seat
              </p>
              <p className="text-sm text-green-600">
                {bus.availableSeats} seats available
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={passengerInfo.name}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={passengerInfo.phone}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={passengerInfo.email}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Seats
                </label>
                <select
                  value={passengerInfo.seats}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      seats: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={bookingLoading}
                >
                  {Array.from({ length: maxSeats }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Seat{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-xl text-blue-600">
                    {formatCurrency(bus.fare * passengerInfo.seats)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Book Your Bus Ticket
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={searchData.from}
              onChange={(e) =>
                setSearchData({ ...searchData, from: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={locationsLoading}
            >
              <option value="">Select departure city</option>
              {locations.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={searchData.to}
              onChange={(e) =>
                setSearchData({ ...searchData, to: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={locationsLoading}
            >
              <option value="">Select destination city</option>
              {locations.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
 
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) =>
                setSearchData({ ...searchData, date: e.target.value })
              }
              min={getDateString()}
              max={getDateString(30)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={searchDisabled}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </div>
        {locationsLoading && (
          <p className="text-sm text-gray-500">Loading cities...</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Searching for available buses...</p>
        </div>
      )}

      {!loading &&
        !error &&
        availableBuses.length === 0 &&
        searchData.from &&
        searchData.to && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              No buses found for the selected route and date.
            </p>
            <p className="text-gray-500 mt-2">
              Try picking a different departure date or city pair.
            </p>
          </div>
        )}

      {!loading && availableBuses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Buses ({availableBuses.length})
          </h2>

          {availableBuses.map((bus) => (
            <div
              key={bus.scheduleId}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="w-10 h-6 bg-blue-600 rounded" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {bus.busName}
                      </h3>
                      <p className="text-gray-600">
                        {bus.busNumber} • {bus.operator}
                      </p>

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
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          {bus.amenities.map((amenity, index) => (
                            <div
                              key={`${amenity}-${index}`}
                              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                            >
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
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(bus.fare)}
                  </div>
                  <div className="text-sm text-gray-500">per seat</div>
                </div>

                <div className="text-center lg:text-right">
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('Please login to book tickets');
                        return;
                      }
                      setSelectedBus({
                        ...bus,
                        sourceLocation: searchData.from,
                        destinationLocation: searchData.to,
                      });
                      setShowBooking(true);
                    }}
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

      {showBooking && selectedBus && (
        <BookingModal
          bus={selectedBus}
          onClose={() => {
            setShowBooking(false);
            setSelectedBus(null);
          }}
        />
      )}
    </div>
  );
}

