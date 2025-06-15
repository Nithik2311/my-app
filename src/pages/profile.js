import Head from 'next/head';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/router';
import { Clock, MapPin, Bus, Ticket, Calendar } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { useState, useEffect } from 'react';


export default function Profile() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where('passengerEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      const userBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100">
        <div className="text-2xl font-semibold text-indigo-600">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Head>
        <title>Your Profile</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-3">
              Your Profile
            </h1>
            <p className="text-lg text-indigo-700">Manage your account and bookings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Gradient Header */}
                <div className="h-3 bg-gradient-to-r from-blue-500 to-violet-600"></div>
                
                {/* Profile Content */}
                <div className="p-8">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center">
                      {user.displayName && (
                        <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
                      )}
                      <p className="text-indigo-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-indigo-500 font-medium">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                    </div>

                    <button
                      onClick={async () => { await logout(); router.push('/login'); }}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-violet-600"></div>
                
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Ticket className="text-violet-600" /> Your Bookings
                  </h2>

                  {bookingsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You haven't made any bookings yet.</p>
                      <button 
                        onClick={() => router.push('/bus-ticket-booking')}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Book a Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                <Bus className="text-blue-600" /> {booking.busName}
                              </h3>
                              <p className="text-gray-600 text-sm">{booking.busNumber}</p>
                              <p className="text-indigo-600 font-medium">Booking ID: {booking.id}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-violet-600" />
                                <span>{booking.sourceLocation} → {booking.destinationLocation}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-4 h-4 text-violet-600" />
                                <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-violet-600" />
                                <span>{booking.departureTime}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="bg-indigo-50 p-3 rounded-lg">
                                <p className="text-sm text-indigo-500">Passenger</p>
                                <p className="font-medium">{booking.passengerName}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">Seats</p>
                                  <p className="font-medium">{booking.seatsBooked}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Total</p>
                                  <p className="font-bold text-blue-600">₹{booking.totalFare}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}