// firebaseService.js - Place this file in your src/services/ directory
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Bus Service Functions
export const busService = {
  // Get all buses
  getAllBuses: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'buses'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Get active buses
  getActiveBuses: async () => {
    try {
      const q = query(
        collection(db, 'buses'), 
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching active buses:', error);
      throw error;
    }
  },

  // Add new bus
  addBus: async (busData) => {
    try {
      const docRef = await addDoc(collection(db, 'buses'), {
        ...busData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding bus:', error);
      throw error;
    }
  }
};

// Route Service Functions
export const routeService = {
  // Get all routes
  getAllRoutes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'routes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Get routes by source and destination
  getRoutesByLocations: async (source, destination) => {
    try {
      const q = query(
        collection(db, 'routes'),
        where('sourceLocation', '==', source),
        where('destinationLocation', '==', destination),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Add new route
  addRoute: async (routeData) => {
    try {
      const docRef = await addDoc(collection(db, 'routes'), {
        ...routeData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding route:', error);
      throw error;
    }
  }
};

// Schedule Service Functions
export const scheduleService = {
  // Get schedules by route and date
  getSchedulesByRoute: async (routeId, date) => {
    try {
      const q = query(
        collection(db, 'schedules'),
        where('routeId', '==', routeId),
        where('departureDate', '==', date),
        where('isActive', '==', true),
        orderBy('departureTime')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  // Get available buses for a route
  getAvailableBuses: async (source, destination, date) => {
    try {
      // First get routes matching source and destination
      const routes = await routeService.getRoutesByLocations(source, destination);
      
      let allSchedules = [];
      
      // Get schedules for each route
      for (const route of routes) {
        const schedules = await scheduleService.getSchedulesByRoute(route.id, date);
        
        // Enhance schedules with route and bus information
        for (const schedule of schedules) {
          const busDoc = await getDoc(doc(db, 'buses', schedule.busId));
          if (busDoc.exists()) {
            allSchedules.push({
              ...schedule,
              route: route,
              bus: { id: busDoc.id, ...busDoc.data() }
            });
          }
        }
      }
      
      return allSchedules;
    } catch (error) {
      console.error('Error fetching available buses:', error);
      throw error;
    }
  },

  // Add new schedule
  addSchedule: async (scheduleData) => {
    try {
      const docRef = await addDoc(collection(db, 'schedules'), {
        ...scheduleData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding schedule:', error);
      throw error;
    }
  }
};

// Location Service Functions
export const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const q = query(
        collection(db, 'locations'),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Add new location
  addLocation: async (locationData) => {
    try {
      const docRef = await addDoc(collection(db, 'locations'), {
        ...locationData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }
};

// Booking Service Functions (for future use)
export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        bookingDate: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('bookingDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }
};