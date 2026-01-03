
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
import { db } from '@/lib/firebase-config';

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

export const routeService = {
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

  getAvailableBuses: async (source, destination, date) => {
    try {
      const routes = await routeService.getRoutesByLocations(source, destination);
      
      let allSchedules = [];
      
      for (const route of routes) {
        const schedules = await scheduleService.getSchedulesByRoute(route.id, date);
        
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

export const locationService = {
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

export const bookingService = {
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