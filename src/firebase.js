import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, collection
    // ,addDoc, getDocs, getDoc, where, query 
} from "firebase/firestore"
// import {cityDb} from './temp/m-city-export';

const firebaseConfig = {
    apiKey: "AIzaSyDib41TivsxtE1hSowbpAa5YjZFOdvrz0M",
    authDomain: "mcity-c3b19.firebaseapp.com",
    projectId: "mcity-c3b19",
    storageBucket: "mcity-c3b19.appspot.com",
    messagingSenderId: "594723928711",
    appId: "1:594723928711:web:81cbc13b8d89e626e9d622",
    measurementId: "G-VWL9R9MCWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// DB
const DB = getFirestore();
const matchesCollection = collection(DB, 'matches');
const playersCollection = collection(DB, 'players');
const positionsCollection = collection(DB, 'positions');
const promotionsCollection = collection(DB, 'promotions');
const teamsCollection = collection(DB, 'teams');

// cityDb.matches.forEach(async (item) => {
//     try {
//         await addDoc(matchesCollection, item);
//         console.log('added ' + JSON.stringify(item));
//     } catch (e) {
//         console.log(e);
//     }
// });

// cityDb.players.forEach(async (item) => {
//     try {
//         await addDoc(playersCollection, item);
//         console.log('added ' + JSON.stringify(item));
//     } catch (e) {
//         console.log(e);
//     }
// });

// cityDb.positions.forEach(async (item) => {
//     try {
//         await addDoc(positionsCollection, item);
//         console.log('added ' + JSON.stringify(item));
//     } catch (e) {
//         console.log(e);
//     }
// });

// cityDb.promotions.forEach(async (item) => {
//     try {
//         await addDoc(promotionsCollection, item);
//         console.log('added ' + JSON.stringify(item));
//     } catch (e) {
//         console.log(e);
//     }
// });

// cityDb.teams.forEach(async (item) => {
//     try {
//         await addDoc(teamsCollection, item);
//         console.log('added ' + JSON.stringify(item));
//     } catch (e) {
//         console.log(e);
//     }
// });


export {
    app,
    matchesCollection,
    playersCollection,
    positionsCollection,
    promotionsCollection,
    teamsCollection
}